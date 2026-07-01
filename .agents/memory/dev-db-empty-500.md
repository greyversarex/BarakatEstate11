---
name: Empty dev DB causes 500 on all list endpoints
description: In a fresh Replit dev environment the Postgres DB has no tables, so every API SELECT 500s
---

# Fresh dev environment → empty Postgres → 500 everywhere

**Symptom:** every public API list endpoint (`/api/listings`, `/api/reviews`, ...) returns 500 in the
Replit dev preview, even though `DATABASE_URL` is set and the api-server workflow is RUNNING. pino-http
only logs a generic "failed with status code 500" — the real cause is `relation "listings" does not exist`.

**Cause:** the dev Postgres (Replit built-in, host `helium`) starts with NO schema. Drizzle schema is
never auto-applied. `checkDatabase({environment:"development"})` may even report "not provisioned" while
`DATABASE_URL` still points at a live-but-empty DB.

**Fix (dev only):**
1. `pnpm --filter @workspace/db run push` — creates tables from `lib/db/src/schema/admin.ts`.
2. `psql "$DATABASE_URL" -f deploy/initdb/02-seed.sql` — seeds admin (admin/admin123) + 6 listings.

**Why it matters:** prod (Timeweb Docker) is unaffected — it loads schema+seed from `deploy/initdb/`
on first boot of an empty pg volume. This is purely a dev-environment bootstrap gap, so "500 everywhere
in preview" after a fresh clone/migration maps here, NOT to a code bug.
