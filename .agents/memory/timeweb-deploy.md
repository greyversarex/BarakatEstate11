---
name: Timeweb self-hosted Docker deploy
description: Quirks and traps when deploying BarakatEstate to the user's own Timeweb server via Docker (NOT Replit deploy)
---

# Timeweb production deploy (user's own server)

Project on server: `/root/BarakatEstate11`, compose at `deploy/docker-compose.yml`.
Services: deploy-api-1 (8080), deploy-caddy-1 (80/443, serves barakat + barakat-admin dist), deploy-db-1 (postgres:16-alpine, 5432).

## Trap: deploy/ folder is NOT in the git repo
`deploy/` (Dockerfile, Caddyfile, docker-compose.yml, initdb) exists only on the server / old git history, not in the Replit repo (origin/main).
**Any hard reset to origin/main deletes deploy/.** Recover by checking out the folder from an older commit that still has it.
To update source safely WITHOUT wiping deploy/: fetch origin, then checkout origin/main for everything except the deploy path, e.g. pathspec `. ':(exclude)deploy'`.
**Permanent fix (not yet done):** commit deploy/ (minus .env secrets) into the repo.

## Trap: pnpm version drift breaks the build
Server corepack pulls the latest pnpm (e.g. 11.9.0) unless pinned. pnpm 11 treats packages with unrun build scripts (esbuild) as a FATAL `ERR_PNPM_IGNORED_BUILDS` (exit 1).
**Fix:** root package.json must keep `"packageManager": "pnpm@10.26.1"` + `"pnpm": { "onlyBuiltDependencies": ["esbuild"] }`.

## Trap: barakat-admin prod build runs `tsc -b` (dev mode does not)
The Dockerfile runs `pnpm --filter @workspace/barakat-admin run build` = `tsc -b && vite build`. tsc type-checks every file in the include glob, including dead/unused files. Legacy Prisma-era orphans (e.g. `src/lib/store.ts`, `src/lib/validations.ts` importing prisma/bcryptjs/zod) compile fine in `vite dev` but break the prod build. Keep admin src free of orphaned files referencing uninstalled modules.

## DB migrations on prod
api Docker image contains only compiled dist (no pnpm/drizzle/source) -> `db push` cannot run in the api container. Apply schema changes via raw SQL inside the db container with psql (exec -T db, psql -U "$POSTGRES_USER" -d "$POSTGRES_DB", piped heredoc).

## Workflow each update
1. Push Replit -> GitHub (manual, via Replit Git pane). Replit does NOT auto-push.
2. On server: fetch origin, checkout origin/main excluding deploy, verify `grep packageManager package.json`.
3. `cd deploy && docker compose up -d --build`.
4. Apply any new DB migrations via psql.
