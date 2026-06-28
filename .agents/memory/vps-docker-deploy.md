---
name: VPS Docker deployment
description: How the self-hosted Docker deploy for Barakat Estate is structured and its non-obvious constraints.
---

The `deploy/` folder ships a self-hosted stack for a low-spec Timeweb VPS (1 vCPU, 1GB RAM): PostgreSQL + the esbuild-bundled API + Caddy (serves both static web apps and reverse-proxies `/api/*`, with automatic Let's Encrypt HTTPS).

Key decisions / constraints:
- **Single multi-stage Dockerfile** with targets `builder`, `api`, `web`. Compose builds `api` and `web` targets which both reuse the cached `builder` layer — avoids running `pnpm install` twice. **Why:** 1GB RAM + 15GB disk can't afford duplicate installs.
- **Build context is the repo root** (`context: ..` in compose), so the effective `.dockerignore` is the one at the **repo root**, NOT one inside `deploy/`. A `deploy/.dockerignore` is silently ignored. **Why:** Docker only reads `.dockerignore` from the build context root; without a root one the whole repo (attached_assets, .git) bloats the context and can OOM/fill disk on first build.
- **API runtime copies only `dist/`, no node_modules.** Works because esbuild bundles everything (incl. `pg`, `@workspace/db`, bcryptjs); only truly-optional natives (pg-native) are externalized and pg falls back gracefully.
- **DB schema + seed via Postgres initdb.** `deploy/initdb/01-schema.sql` (pg_dump --schema-only, --no-owner) + `02-seed.sql` (data INSERTs) are mounted to `/docker-entrypoint-initdb.d` and run **only on first boot of an empty volume**. Schema changes later need manual migration or `docker compose down -v` (destroys data).
- **2GB swap is required on the VPS** or the Vite frontend build OOMs.
- **JWT_SECRET is mandatory in production** — the API hard-fails at startup if unset (dev has a fallback).
