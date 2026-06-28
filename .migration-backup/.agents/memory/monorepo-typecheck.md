---
name: Monorepo typecheck
description: How to typecheck this pnpm monorepo correctly and a known pre-existing failure to not chase.
---

- Always typecheck via the **root** `pnpm run typecheck` — it builds the lib project references (e.g. `@workspace/db`) first. Running an isolated `pnpm --filter @workspace/api-server run typecheck` falsely reports `@workspace/db has no exported member ...` because the referenced lib hasn't been built.
- **Pre-existing failure, do not chase:** the api-server has TS2769 "No overload matches this call / not assignable to never" errors on Drizzle `eq(table.id, req.params.id)` calls (Express 5 types `req.params` values as `string | string[]`). These exist across many routes in HEAD and do **not** block the esbuild runtime build (`pnpm --filter @workspace/api-server run build` succeeds). Don't assume a new edit caused them — confirm against HEAD first.
