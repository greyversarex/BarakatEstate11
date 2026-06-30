---
name: Barakat monorepo migration created empty DB
description: Why content vanished after the monorepo migration and where the original data backup lives
---

The monorepo/multi-artifact migration (evidenced by `.migration-backup/` duplicate artifacts) provisioned a **fresh, empty Postgres** for the app. The pre-migration data is preserved as a SQL dump in `.migration-backup/deploy/initdb/`:
- `01-schema.sql` — original pg_dump schema (tables/enums)
- `02-seed.sql` — original data: 6 listings + 1 admin user. **No reviews, no site_settings, no extra staff** — those tables were empty originally.

**Why this matters:** if the user reports "everything stopped loading" (listings/reviews/employees), first check row counts — the server/API are usually fine (200s), the DB is just empty. Restore listings by running the INSERTs from `02-seed.sql`; they map cleanly to the current Drizzle `listings` table (extra NOT NULL cols `is_new/is_urgent/is_hero/views` all have defaults). Do NOT re-insert the admin (username `admin` is UNIQUE and already present).

**How to apply:** employees on the public site come from `admin_users` via `GET /api/users`; reviews from `reviews` (only `status='approved'` shown); site profile/settings from `site_settings` key `site_profile`. Empty reviews/staff = expected from backup, not a bug. For data the user added *after* migration, only a Replit checkpoint rollback can recover it.
