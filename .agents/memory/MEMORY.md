# Memory Index

- [Barakat lead service strings](barakat-lead-services.md) — site lead forms and admin category filters are joined ONLY by an exact `service` string; mismatches silently drop leads into "Другие".
- [Admin dashboard tab-load races](barakat-admin-load-races.md) — async tab loaders must use a request-id guard or a late load overwrites the new tab's grid.
- [Admin collection draft visibility](barakat-admin-collection-visibility.md) — admin read routes (GET list & by-id) must enforce auth/role too, not just writes, or drafts leak.
