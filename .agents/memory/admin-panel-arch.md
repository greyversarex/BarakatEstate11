---
name: Admin panel architecture
description: How the Barakat Estate admin panel is structured — frontend, backend, auth, DB.
---

Admin panel at /barakat-admin:
- Frontend: React+Vite at artifacts/barakat-admin/ (port 24430, artifact ID: artifacts/barakat-admin)
- Vite proxies /api to api-server at localhost:8080
- All admin API routes at /api/admin/* in artifacts/api-server/src/routes/admin/
- Auth: JWT via httpOnly cookie (jose + bcryptjs), cookie name: admin_token. In production JWT_SECRET is required (server hard-fails without it); dev has a fallback.
- A default admin user is auto-created on first login if none exists (credentials live in code/seed, not here).
- DB: Drizzle schema in lib/db/src/schema/admin.ts (admin_users, listings, applications, reviews, site_settings)
- Public-facing routes (no auth) at /api/listings, /api/reviews, /api/profile, /api/users

Web app (artifacts/barakat) uses window.BARAKAT_API_URL='' (set in index.html) to call local /api/* routes.
Mobile app (artifacts/barakat-mobile) uses EXPO_PUBLIC_API_URL env var or EXPO_PUBLIC_DOMAIN fallback.
