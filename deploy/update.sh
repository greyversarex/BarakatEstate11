#!/usr/bin/env bash
# ============================================================================
# Barakat Estate — безопасное обновление продакшена (Timeweb / Docker)
# ----------------------------------------------------------------------------
# Что делает:
#   1. Бэкап базы данных в ~/barakat-backups/
#   2. Забирает свежий код из git (origin/main), НЕ трогая deploy/.env
#   3. Проверяет, что pnpm запинён (иначе сборка падает)
#   4. Пересобирает и перезапускает контейнеры
#   5. Накатывает миграцию схемы на боевую базу (идемпотентно)
#   6. Проверяет, что API поднялся
#
# Запуск с сервера из корня проекта:
#   bash deploy/update.sh
#
# Безопасно запускать повторно. НИЧЕГО не удаляет (ни том БД, ни .env).
# ============================================================================
set -euo pipefail

# --- перейти в корень репозитория (скрипт лежит в deploy/) ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="deploy/.env"
# --env-file: docker compose сам читает deploy/.env своим парсером (значения
# с пробелами, например SITE_ADDRESS, обрабатываются корректно — без shell).
COMPOSE="docker compose -f deploy/docker-compose.yml --env-file $ENV_FILE"

log()  { printf '\n\033[1;33m==> %s\033[0m\n' "$*"; }
fail() { printf '\n\033[1;31mОШИБКА: %s\033[0m\n' "$*" >&2; exit 1; }

# --- проверки окружения ---
[ -f "$ENV_FILE" ] || fail "Не найден $ENV_FILE. Создай его из deploy/.env.example."
command -v docker >/dev/null || fail "Docker не установлен."

# Прочитать нужные переменные из deploy/.env БЕЗОПАСНО, без `source`.
# Значения вроде `SITE_ADDRESS=barakat-estate.tj www.barakat-estate.tj` содержат
# пробел: для docker compose это валидно, но `source` в bash пытается выполнить
# второй домен как команду и падает. Поэтому читаем значения буквально.
read_env() {
  local val
  val="$(grep -E "^$1=" "$ENV_FILE" | tail -n1 | cut -d= -f2-)"
  val="${val%$'\r'}"                 # убрать CR (файл с Windows-переводами строк)
  val="${val#\"}"; val="${val%\"}"   # снять обрамляющие двойные кавычки
  val="${val#\'}"; val="${val%\'}"   # снять обрамляющие одинарные кавычки
  printf '%s' "$val"
}
POSTGRES_USER="$(read_env POSTGRES_USER)"
POSTGRES_DB="$(read_env POSTGRES_DB)"
SITE_ADDRESS="$(read_env SITE_ADDRESS)"
: "${POSTGRES_USER:?POSTGRES_USER не задан в deploy/.env}"
: "${POSTGRES_DB:?POSTGRES_DB не задан в deploy/.env}"

# --- 1. Бэкап базы ---
log "Шаг 1/6 — бэкап базы данных"
BACKUP_DIR="$HOME/barakat-backups"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y-%m-%d_%H-%M-%S).sql"
if $COMPOSE ps db --status running 2>/dev/null | grep -q db; then
  $COMPOSE exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > "$BACKUP_FILE" \
    && log "Бэкап сохранён: $BACKUP_FILE" \
    || log "Не удалось снять бэкап (контейнер db не готов?) — продолжаю без него"
else
  log "Контейнер db не запущен — пропускаю бэкап (первый запуск?)"
fi

# --- 2. Свежий код (deploy/.env остаётся: reset не трогает untracked-файлы) ---
log "Шаг 2/6 — забираю свежий код из git"
git fetch origin
git reset --hard origin/main

# --- 3. Проверка пина pnpm (иначе сборка падает с ERR_PNPM_IGNORED_BUILDS) ---
log "Шаг 3/6 — проверяю пин pnpm"
if ! grep -q '"packageManager": *"pnpm@' package.json; then
  fail "В package.json нет packageManager: pnpm@... — сборка может упасть. Останавливаюсь."
fi
grep '"packageManager"' package.json

# --- 4. Пересборка и запуск ---
log "Шаг 4/6 — пересобираю и поднимаю контейнеры (это займёт несколько минут)"
$COMPOSE up -d --build

# --- 5. Миграция схемы (идемпотентно) ---
log "Шаг 5/6 — накатываю миграцию схемы на базу"
# дождаться готовности базы
for i in $(seq 1 30); do
  if $COMPOSE exec -T db pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; then
    break
  fi
  sleep 2
done
$COMPOSE exec -T db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  < lib/db/migrations/sync-prod-schema.sql
log "Схема синхронизирована"

# --- 6. Проверка API ---
log "Шаг 6/6 — проверяю, что API поднялся"
sleep 3
$COMPOSE ps
echo
log "Последние строки логов API:"
$COMPOSE logs --tail=30 api || true

echo
log "Готово. Открой https://${SITE_ADDRESS%% *}/barakat-admin/ и проверь вход."
log "Если в логах выше есть ERR_MODULE_NOT_FOUND или ошибки — пришли их разработчику."
