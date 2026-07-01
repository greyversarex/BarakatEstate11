---
name: Barakat object storage is local filesystem, not Replit GCS
description: Why api-server uploads use the local filesystem + the SVG-rejection security constraint; read before touching objectStorage/upload/storage.
---

# Barakat object storage

Barakat production is **self-hosted Docker on a Timeweb VPS** (caddy → api:8080 → postgres:16), NOT Replit. So object storage must NOT use Replit's GCS sidecar / App Storage / `@google-cloud/storage`.

`api-server` stores uploads on the **local filesystem** under `UPLOAD_DIR` (default `<cwd>/data/uploads`), backed by a persistent named volume (`uploads:/data/uploads`) in `deploy/docker-compose.yml`.

**Why:** The original scaffold shipped Replit-sidecar/GCS object storage, which is dead on the VPS — image upload was fully broken in production. Do not "helpfully" reintroduce Replit object storage / GCS here; it will break prod again.

**How to apply:** When touching uploads, keep it filesystem-based. Any new upload target must have a matching persistent volume in docker-compose, or files vanish on container rebuild.

## Security constraint: no SVG uploads
Uploaded images are served publicly from our own origin. The real image type is detected from **magic bytes** (client MIME is ignored/spoofable); non-raster content is rejected. **SVG is intentionally excluded** from the allowlist because it can carry inline `<script>` → stored-XSS → admin session theft (admin bearer token lives in localStorage). Storage responses set `X-Content-Type-Options: nosniff`.

**Why:** An authenticated seller/admin could otherwise upload a malicious SVG and compromise an admin who opens it.

**How to apply:** Do not add `image/svg+xml` (or any non-raster/HTML type) back to the allowed formats. Keep magic-byte detection + nosniff.
