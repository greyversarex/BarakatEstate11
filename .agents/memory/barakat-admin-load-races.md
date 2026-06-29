---
name: Admin dashboard tab-load races
description: Guard async tab data loaders against stale completion overwriting the current tab.
---

The admin dashboard fetches list data per active tab. Loaders are async, so if a
user switches tabs quickly the earlier request can resolve after the new one and
overwrite the grid with the wrong collection's rows (e.g. applications shown under
"Listings").

**Why:** Late-resolving fetches called `setItems` unconditionally, so the last
network response to return won — not the last tab the user selected.

**How to apply:** Every loader increments a shared request-id ref at start,
captures it, and only commits state (`setItems`, `setLoading`) when the captured
id still equals the current ref. Apply the same guard to any auto-mark-seen /
reload helper that also writes the shared list state.
