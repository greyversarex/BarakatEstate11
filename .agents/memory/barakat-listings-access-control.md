---
name: Barakat listings access-control gap
description: The listings mutate routes trust the request body and only check authentication, not ownership/role — a known IDOR gap.
---

# Barakat listings mutate routes: known access-control gap

The listings write routes (`POST/PUT/PATCH/DELETE /api/listings`) in `artifacts/api-server/src/routes/admin/listings.ts` only check that the caller is authenticated. They do **not** verify that the listing belongs to the caller, and they pass the request body straight into Drizzle (`.set({ ...req.body })` / `.values({ ...req.body })`) with no per-role field allowlist.

**Consequence:** any logged-in seller can edit/delete any listing by id (IDOR) and set any column.

**What is enforced today:** only the `isHero` flag (homepage hero showcase) is gated — it is stripped from the body for non-admins server-side, and the admin checkbox is hidden for non-admins. Everything else (price, isFeatured, isNew, isUrgent, ownership) is still wide open.

**Why:** the homepage hero is a global, site-wide element, so it must be admin-controlled; the rest of the gap is pre-existing and was left untouched to avoid scope creep.

**How to apply:** if asked to harden listings security, add ownership checks (admin OR `sellerId/employeeId === user.id`) to the mutate/delete handlers and a per-role field allowlist before writing. `GET /listings` already scopes correctly by role; mirror that pattern.
