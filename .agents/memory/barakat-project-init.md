---
name: Barakat project initialization
description: How to bring the Barakat Estate monorepo up from a fresh checkout, plus known gotchas
---

# Bringing Barakat Estate up from cold

The monorepo (Barakat Estate: `barakat` web, `barakat-admin`, `barakat-mobile`, `api-server`, `mockup-sandbox`) needs two init steps after a fresh checkout — workflows fail until both are done:

1. `pnpm install` at root — node_modules are not committed, so every workflow fails with "vite: not found" / "expo not found" / "Cannot find package 'esbuild'" until installed.
2. `pnpm --filter @workspace/db run push` — the Postgres DB starts empty. Without it the API returns **500** on every data route (e.g. `/api/listings`) because tables don't exist. After push, routes return 200.

**Why:** these are environment-bootstrap steps, not code bugs. Restarting workflows alone is not enough.

## Known gotchas / косяки
- **Admin auth auto-creates a default user**: first login with `admin` / `admin123` inserts that admin row (see `api-server/src/routes/admin/auth.ts`). Hardcoded default creds — fine for dev, must be changed/removed before production.
- **`.migration-backup/` directory** is a full duplicate snapshot from a prior migration. It registers 5 duplicate artifacts/workflows that always show as FAILED — pure noise, not the active build. Active code lives in `artifacts/*` + `lib/*`.
- **Yandex Maps**: browser warns "(Yandex Maps JS API): Invalid API key" — map needs a real key.
- **Image upload now uses Object Storage**: admin `/api/admin/upload` decodes the base64 the client sends, PUTs it to GCS via a presigned URL, sets a public ACL, and returns an absolute serving URL (`<proto>://<host>/api/storage/objects/...`). Served by `routes/storage.ts` (mounted under `/api`, public, no auth). `?download=1` forces a download via Content-Disposition. Old listings may still hold legacy base64 data URLs in the DB — the admin viewer handles both.
- DB has tables but no seed data — listings/blog/reviews come back empty arrays until content is added via admin.
