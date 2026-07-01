# Развёртывание Barakat Estate на VPS (Timeweb)

Полный self-hosted стек в Docker: PostgreSQL + API-сервер + Caddy (статика обоих сайтов и
автоматический HTTPS через Let's Encrypt).

- **Главный сайт:** `https://barakat-estate.tj/`
- **Админка:** `https://barakat-estate.tj/barakat-admin/` (логин: `admin` / пароль: `admin123`)
- **API:** `https://barakat-estate.tj/api/...`

Сервер: 1 vCPU, 1 ГБ RAM, 15 ГБ диск, IP `109.73.198.84`.

---

## 1. Подготовка DNS

В панели управления доменом `barakat-estate.tj` создайте A-записи на IP сервера:

| Тип | Имя | Значение |
|-----|-----|----------|
| A | `@` | `109.73.198.84` |
| A | `www` | `109.73.198.84` |

> HTTPS-сертификат выпустится автоматически только после того, как DNS начнёт указывать на сервер,
> а порты 80 и 443 будут открыты. Распространение DNS может занять до нескольких часов.

---

## 2. Установка Docker на сервере

Подключитесь по SSH и выполните:

```bash
ssh root@109.73.198.84

# Docker + Compose plugin
curl -fsSL https://get.docker.com | sh
```

### Добавьте swap (обязательно для 1 ГБ RAM)

Сборка фронтенда требует памяти — без swap сборка может прерваться (OOM).

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
free -h   # проверьте, что swap появился
```

---

## 3. Загрузка проекта на сервер

Скопируйте папку проекта на сервер (например через `git clone` вашего репозитория или `scp`).
Все команды ниже выполняются из папки `deploy/`:

```bash
cd /путь-к-проекту/deploy
```

---

## 4. Настройка переменных окружения

```bash
cp .env.example .env
nano .env
```

Заполните:

- `POSTGRES_PASSWORD` — придумайте надёжный пароль для базы.
- `JWT_SECRET` — сгенерируйте: `openssl rand -hex 32` и вставьте результат.
- `ACME_EMAIL` — ваш email (для уведомлений Let's Encrypt).
- `SITE_ADDRESS` — оставьте `barakat-estate.tj www.barakat-estate.tj`.
- `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` — заполните, если нужны уведомления о заявках в Telegram. Иначе оставьте пустыми.
- Карты на сайте работают на OpenStreetMap (Leaflet) — отдельный API-ключ или регистрация не нужны.

---

## 5. Запуск

```bash
docker compose build      # первая сборка займёт несколько минут
docker compose up -d
```

При первом запуске PostgreSQL автоматически создаст схему и загрузит тестовые данные
(6 объявлений + учётная запись администратора) из папки `initdb/`.

Проверка статуса и логов:

```bash
docker compose ps
docker compose logs -f caddy   # тут видно процесс выпуска HTTPS-сертификата
docker compose logs -f api
```

Откройте в браузере `https://barakat-estate.tj/`.

---

## 6. Обслуживание

**После смены пароля администратора** зайдите в админку и поменяйте пароль `admin123` —
он указан в коде по умолчанию.

| Действие | Команда |
|----------|---------|
| Перезапуск | `docker compose restart` |
| Остановка | `docker compose down` |
| Обновление кода | загрузить новый код → `docker compose build` → `docker compose up -d` |
| Логи | `docker compose logs -f <api\|caddy\|db>` |
| Бэкап БД | `docker compose exec db pg_dump -U barakat barakat > backup.sql` |

> **Важно:** тестовые данные грузятся только при **первом** запуске (когда том БД пустой).
> Если позже измените схему базы в коде, нужно применить миграции вручную или пересоздать том
> (`docker compose down -v` — **удалит все данные**).

---

## 7. Если что-то не работает

- **Нет HTTPS / сайт не открывается** — проверьте, что DNS уже указывает на `109.73.198.84`
  (`ping barakat-estate.tj`) и порты 80/443 открыты в фаерволе Timeweb. Смотрите `docker compose logs caddy`.
- **API возвращает ошибки** — `docker compose logs api`. Убедитесь, что контейнер `db` здоров (`docker compose ps`).
- **Сборка падает с нехваткой памяти** — проверьте, что swap включён (шаг 2).
