---
name: Barakat admin↔API update contract
description: barakat-admin uses PATCH for edits, so every admin API resource needs both PUT and PATCH handlers
---

The barakat-admin frontend (UserDashboard submitForm) sends `PATCH /api/admin/<resource>/:id` for edits/toggles (POST for create, PUT only for settings). Therefore every mutable admin resource route must register **both** PUT and PATCH for `/:id`, or edits silently fail with 404.

**Why:** listings.ts originally defined only PUT, so listing edits (incl. new isNew/isUrgent flags) never persisted even though the UI appeared to save. reviews.ts and applications.ts already had both — listings.ts was the outlier.

**How to apply:** when adding/auditing an admin resource route in artifacts/api-server/src/routes/admin/, ensure PATCH is wired (point it at the same handler as PUT).

**Known pre-existing gap:** listing PUT/PATCH/DELETE only check `getAuthUser` (authenticated), not ownership/admin role — any logged-in seller can mutate others' listings (IDOR). Not fixed as part of the flags work; candidate follow-up.
