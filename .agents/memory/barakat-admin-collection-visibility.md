---
name: Admin collection draft/status visibility
description: Rule for who may read unpublished (draft) rows across admin-backed collections.
---

# Admin collection draft visibility

Any admin-backed collection with a `status` (draft/published, new/approved, etc.) must split reads into two surfaces:
- **Public route** (`/api/<name>`, `/api/<name>/:slug`): return ONLY published/approved rows. Never trust auth here.
- **Admin route** (`/api/admin/<name>`): gate every read AND write. For admin-only collections (e.g. blog) require `role === "admin"` on GET list and GET /:id too — not just writes.

**Why:** A blog review caught that admin GET routes without auth/role checks leaked draft posts (unauth could fetch a draft by id; any logged-in non-admin could list drafts). Writes were guarded but reads were not.

**How to apply:** When adding a new admin collection, copy the auth/role guard onto the read handlers, not only POST/PUT/PATCH/DELETE. If a collection is seller-scoped (like viewings/listings), filter rows by ownership instead of a blanket admin check.
