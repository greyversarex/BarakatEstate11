---
name: Barakat public application photos & untrusted-input rendering
description: How public website application forms (Сдать/Продать/Оценить) store photos, and the security rule for rendering any public-submitted content in admin.
---

# Public application forms: photos & untrusted-input rule

The homepage search-tab buttons «Сдать»/«Продать»/«Оценить» open modal lead forms that POST to the **public, unauthenticated** `POST /api/service-request`, which inserts into `applicationsTable`. The request type goes in `service` ("Сдать в аренду" / "Объявление для продажи" / "Оценка стоимости"); structured fields (площадь, комнаты, этажность, этаж, комментарий) are formatted into `message`; photos go in the `photos` column as newline-separated base64 data URLs.

**Why base64-in-DB instead of object storage:** this app is self-hosted on the user's own Timeweb Docker server, where Replit object storage does NOT exist in production. Base64 data URLs in a text column are the portable choice that works identically in dev and prod. Photos are downscaled client-side (canvas → JPEG ~1280px / q0.7) and capped (≤8 photos, client size guard + Express 10mb body limit) to keep payloads sane.

**Security rule (do not regress):** any endpoint reachable by the public that stores content later rendered in the admin is an XSS vector. For the photos field specifically:
- Server (`service-request.ts`) allowlists each entry against `^data:image/(jpeg|jpg|png|webp);base64,...` and drops anything else (so a `javascript:` or `data:text/html` URL never reaches the DB).
- Admin (`UserDashboard.tsx`) ALSO filters each src to a safe-scheme allowlist before putting it in `href`/`src`. Defense in depth — never rely on the client form alone, and never render a public-submitted URI scheme without validating it.

**How to apply:** when adding any new public-submission field that the admin displays (or new public forms), validate/allowlist server-side AND sanitize at render time. Mirror the photo allowlist pattern.
