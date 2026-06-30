# Barakat Estate

Платформа недвижимости в Душанбе: публичный сайт с объявлениями, картой и заявками, админка для управления контентом, мобильное приложение и общий API.

## Артефакты (приложения монорепо)

- **`artifacts/barakat`** — публичный сайт (React + Vite), путь `/`.
- **`artifacts/barakat-admin`** — админка (React + Vite), путь `/barakat-admin`.
- **`artifacts/barakat-mobile`** — мобильное приложение (Expo).
- **`artifacts/api-server`** — API (Express 5 + Drizzle + PostgreSQL).
- **`artifacts/mockup-sandbox`** — песочница для прототипов на Canvas.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — API сервер
- `pnpm --filter @workspace/barakat run dev` — публичный сайт
- `pnpm --filter @workspace/barakat-admin run dev` — админка
- `pnpm run typecheck` — типчек по всем пакетам
- `pnpm --filter @workspace/db run push` — применить изменения схемы БД (только dev)
- Required env: `DATABASE_URL` — строка подключения к Postgres

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (источник истины схемы: `lib/db/src/schema/admin.ts`)
- Validation: Zod, `drizzle-zod`
- Build (API): esbuild bundle (`artifacts/api-server/build.mjs`)

## Продакшен (self-hosted на Timeweb, Docker)

Боевой сайт работает НЕ на Replit, а на собственном VPS (Timeweb) в Docker.

- Сервер: `/root/BarakatEstate11`, IP `109.73.198.84`, домен `barakat-estate.tj` (1 ГБ RAM — нужен swap).
- Docker-конфиг: папка **`deploy/`** (Dockerfile, docker-compose.yml, Caddyfile, initdb/, README.md, .env.example).
- Сервисы: `api` (8080), `caddy` (80/443, раздаёт статику обоих сайтов + проксирует `/api`), `db` (postgres:16-alpine).
- Секреты (`POSTGRES_PASSWORD`, `JWT_SECRET` и т.д.) лежат только в `deploy/.env` на сервере — в git их НЕТ (там только `.env.example`).

### Обновление продакшена

После пуша кода в GitHub — на сервере выполнить **один скрипт**:

```bash
cd /root/BarakatEstate11
git fetch origin && git reset --hard origin/main   # подтянуть свежий update.sh
bash deploy/update.sh
```

`deploy/update.sh` делает всё безопасно: бэкап БД → свежий код (не трогая `.env`) → проверка пина pnpm → пересборка контейнеров → идемпотентная миграция схемы → проверка логов API.

Подробный первичный деплой (DNS, swap, .env) — в `deploy/README.md`.

### Gotchas продакшена (важно!)

- **НИКОГДА** не запускать на сервере `docker compose down -v` или `git clean` — удалит боевую БД и `deploy/.env`.
- Схема БД на проде обновляется только через `lib/db/migrations/sync-prod-schema.sql` (initdb отрабатывает лишь на пустом томе). При добавлении колонки в `lib/db/src/schema/admin.ts` — добавить такую же строку `ADD COLUMN IF NOT EXISTS` в этот файл.
- pnpm должен быть запинён в `package.json` (`packageManager: pnpm@10.x`), иначе сборка падает.
- Загрузка картинок через объектное хранилище завязана на инфраструктуру Replit и на Timeweb не работает (на вход/сайт не влияет).

## User preferences

- Общение на русском, неформально.

## Pointers

- Детали ловушек деплоя — `.agents/memory/timeweb-deploy.md`
- Структура монорепо — skill `pnpm-workspace`
