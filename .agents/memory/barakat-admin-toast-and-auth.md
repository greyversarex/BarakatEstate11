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

**HTTP method mismatch → "Unexpected token '<', <!DOCTYPE" in admin.** When a
frontend call uses a verb the API route doesn't define (e.g. PUT to a route
registered as POST), Express 404s and Caddy serves the SPA index.html; the
client's `res.json()` then throws the DOCTYPE parse error. **Rule:** that error
almost always means a routing/verb mismatch (or wrong path), NOT a JSON bug —
check the method/path against the api-server route. Note the two profile routes
differ: `POST /api/admin/auth/profile` (auth router, agent's own profile) vs
`PUT /api/admin/profile` (settings router, global site settings). Easy to swap.

**New listings default to draft → invisible on public site.** Public listing
GET only returns `status === "published"`; admin sees all. A freshly created
listing with the form's default status will save fine and show in admin but not
on the website, which reads as "save did nothing". Default the create form's
status to `published` so created listings appear immediately (selector still
lets the user choose draft).

**Admin auth response shape must stay `{ user }`.** `/auth/login` and `/auth/me`
return `{ user: safeUser }`; the profile-save handler once returned the user
object *bare*. The dashboard reads `payload.user` then `userToProfile(...)`, so a
bare object makes `userToProfile(undefined)` throw → blank white screen (React
crash), not a toast. **Rule:** every admin auth endpoint returns `{ user }`.

**Listing create must stamp the creator as seller.** POST /listings inserts the
body as-is; the admin form sends no seller fields. Result: `sellerId`/
`sellerName` empty → public card shows the "Продавец" fallback AND the
non-admin listings filter (`sellerId === user.id || employeeId === user.id`)
hides it from its own creator. **Rule:** default sellerId/employeeId/sellerName/
phone/whatsapp/avatar from the authenticated user when absent on create.
