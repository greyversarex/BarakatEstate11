---
name: Prod migration must backfill enum values + psql ON_ERROR_STOP
description: Why sync-prod-schema.sql adds enum values outside the transaction and why update.sh runs psql with ON_ERROR_STOP=1
---

**Rule:** `lib/db/migrations/sync-prod-schema.sql` must (a) `CREATE TYPE IF NOT EXISTS` for enums AND (b) `ALTER TYPE ... ADD VALUE IF NOT EXISTS` for every enum value, placed OUTSIDE the BEGIN/COMMIT block. `deploy/update.sh` must run psql with `-v ON_ERROR_STOP=1` and fail loudly.

**Why:** Prod (Timeweb) DB was initialized from an older initdb dump where `user_role` lacked `'seller'`. `CREATE TYPE IF NOT EXISTS` never amends existing types, so inserting a seller user failed on prod ("Failed query: insert into admin_users..."). Worse, psql without ON_ERROR_STOP exits 0 on SQL errors, so a rolled-back migration was reported as "Схема синхронизирована". `ALTER TYPE ADD VALUE` cannot run inside a transaction block, hence outside BEGIN/COMMIT.

**How to apply:** When adding a new enum value to `lib/db/src/schema/admin.ts`, also add a matching `ALTER TYPE ... ADD VALUE IF NOT EXISTS` line in the enum section (before BEGIN) of sync-prod-schema.sql. Test with two consecutive runs against dev DB for idempotence.

Related client rule: admin settings saves (`onFieldSave` in UserDashboard.tsx) must only commit local state AFTER a successful PUT and must throw on failure — otherwise ListManager shows deletions that were never persisted ("deleted item reappears after reload").
