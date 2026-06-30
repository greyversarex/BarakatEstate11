---
name: Barakat admin toast & write-auth pitfalls
description: Two recurring traps in the admin dashboard save flow (toast overflow, inconsistent auth)
---

# Admin dashboard save-flow traps

**Toast can receive raw values, not just messages.** Image fields are stored as
base64 data URLs; when a save error surfaces a data URL into the toast, an
unbounded toast (`fixed bottom-6 right-6`, no max-width/break) stretches into a
full-width bar across the bottom of the screen and looks like a broken UI.
**Rule:** any toast/snackbar must bound width + wrap + clamp length.
**Why:** user reported "create doesn't work" seeing a giant base64 bar; the real
issue was display, masking the underlying save error.

**Write requests must use the Bearer helper, not plain fetch.** Auth accepts a
cookie OR `Authorization: Bearer` (token in localStorage). Most writes use the
auth helper, but the main create/update path used plain `fetch` and relied only
on the cookie. On self-hosted prod the cookie path is fragile; prefer the Bearer
helper for every write for consistent auth.
