---
name: Barakat public listing id is the slug
description: The public site exposes slug (not the DB UUID) as a listing's `id`, so API endpoints called from it must match id-or-slug.
---

On the Barakat public web app, `mapAdminListing()` sets a property's `id` to `item.slug || documentId || dbId` — so for any listing that has a slug (the normal case), the public-facing `id` is the **slug**, not the DB UUID primary key.

**Why:** Any api-server endpoint that receives this `id` from the public site (e.g. the listing-view increment endpoint) and queries `where(eq(table.id, param))` against the UUID PK will silently 404 and do nothing for every slugged listing. This already broke view-count tracking once.

**How to apply:** Endpoints consuming an id originating from the public site must match by id OR slug, e.g. `or(eq(listingsTable.id, param), eq(listingsTable.slug, param))`. The `listings` table has a `slug` text column (notNull, default "").
