---
name: Timeweb self-hosted Docker deploy
description: Quirks and traps when deploying BarakatEstate to the user's own Timeweb server via Docker (NOT Replit deploy)
---

# Timeweb production deploy (user's own server)

Project on server: `/root/BarakatEstate11`, compose at `deploy/docker-compose.yml`.
Services: deploy-api-1 (8080), deploy-caddy-1 (80/443, serves barakat + barakat-admin dist), deploy-db-1 (postgres:16-alpine, 5432).

## deploy/ folder now committed to the repo (permanent fix DONE)
Top-level `deploy/` (Dockerfile, Caddyfile, docker-compose.yml, README.md, .env.example, initdb/) is now tracked in the repo, copied from `.migration-backup/deploy/`. So `git pull` / hard reset to origin/main now RESTORES deploy/ instead of wiping it.
Only `.env.example` is committed — the real `deploy/.env` (POSTGRES_PASSWORD, JWT_SECRET, etc.) stays on the server only and is untracked, so `git reset --hard` keeps it (but `git clean -fdx` would delete it — never run clean on the server).
History note: before this, deploy/ lived only on the server; the monorepo migration had moved it under `.migration-backup/deploy/`, and a full reset on the server wiped it = broken build/run.

## Trap: pnpm version drift breaks the build
Server corepack pulls the latest pnpm (e.g. 11.9.0) unless pinned. pnpm 11 treats packages with unrun build scripts (esbuild) as a FATAL `ERR_PNPM_IGNORED_BUILDS` (exit 1).
**Fix:** root package.json must keep `"packageManager": "pnpm@10.26.1"` + `"pnpm": { "onlyBuiltDependencies": ["esbuild"] }`.

## Trap: barakat-admin prod build runs `tsc -b` (dev mode does not)
The Dockerfile runs `pnpm --filter @workspace/barakat-admin run build` = `tsc -b && vite build`. tsc type-checks every file in the include glob, including dead/unused files. Legacy Prisma-era orphans (e.g. `src/lib/store.ts`, `src/lib/validations.ts` importing prisma/bcryptjs/zod) compile fine in `vite dev` but break the prod build. Keep admin src free of orphaned files referencing uninstalled modules.

## Trap: externalized runtime deps must exist in the api image
The api bundle (esbuild, `artifacts/api-server/build.mjs`) externalizes a big list of packages. Most are unused, but any that ARE imported at startup must exist in the runtime image — the api Docker stage copies only `dist`, no node_modules. If an externalized package is imported at module load and missing, the api crashes on boot with `ERR_MODULE_NOT_FOUND` and admin login dies.
**Rule:** if you make an externalized package a startup import, install it in the api stage (or don't externalize it).

## Object storage is now local filesystem (GCS removed)
History: object storage originally used Replit's GCS sidecar (`@google-cloud/storage`, 127.0.0.1:1106), which does not exist on Timeweb — uploads were fully broken in prod, and the api stage had to `npm install @google-cloud/storage` just so the server could boot. That is GONE.
Now: uploads are written to the local filesystem under `UPLOAD_DIR` (docker-compose sets `/data/uploads`, backed by named volume `uploads:`). The api image installs nothing at runtime (copies only `dist`). Therefore:
- Do NOT re-add `@google-cloud/storage` or any runtime npm install to the api stage.
- The `uploads:` volume must survive redeploys — `docker compose down -v` deletes uploaded images along with the DB.
- Uploaded images are validated by magic bytes; SVG is rejected (stored-XSS), responses carry `nosniff`. See `barakat-object-storage.md`.

## DB migrations on prod
api Docker image contains only compiled dist (no pnpm/drizzle/source) -> `db push` cannot run in the api container. Apply schema changes via raw SQL inside the db container with psql (exec -T db, psql -U "$POSTGRES_USER" -d "$POSTGRES_DB", piped heredoc).

## Workflow each update
1. Push Replit -> GitHub (manual, via Replit Git pane). Replit does NOT auto-push.
2. On server: `cd /root/BarakatEstate11 && git fetch origin && git reset --hard origin/main && bash deploy/update.sh`.
   `deploy/update.sh` does it all safely: DB backup -> git reset (keeps untracked `deploy/.env`) -> pnpm-pin check -> `docker compose up -d --build` -> idempotent schema migration (`lib/db/migrations/sync-prod-schema.sql`) -> API health check. It `source`+exports `deploy/.env` into the shell before running compose, so compose resolves every `${VAR}` — both runtime env AND build args (e.g. `VITE_YANDEX_MAPS_API_KEY`, baked into the barakat bundle at build time).

## Schema drift symptom + fix script
If admin create/save fails with a toast like `Failed query: insert into "listings" (...)`,
the prod DB is missing columns the code inserts (schema drift — code updated, DB not migrated).
Idempotent fix committed at `lib/db/migrations/sync-prod-schema.sql` (ADD COLUMN IF NOT EXISTS
for every table/column + enum guards). It must stay in lockstep with `lib/db/src/schema/admin.ts`
— when a column is added to the schema, add the matching `ADD COLUMN IF NOT EXISTS` here too
(e.g. `listings.views` for view-tracking was missing once and broke every prod listings SELECT).
Apply on server (run from repo root, compose lives in deploy/):
  docker compose -f deploy/docker-compose.yml exec -T db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < lib/db/migrations/sync-prod-schema.sql
Verified: the whole script runs clean+idempotent on the dev DB, so failures are prod-DB-only (schema drift).
