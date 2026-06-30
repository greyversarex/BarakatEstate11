# syntax=docker/dockerfile:1

# ---- Builder: install deps and build api + both web apps ----
FROM node:24-slim AS builder
RUN corepack enable
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @workspace/api-server run build \
 && PORT=3000 BASE_PATH=/ pnpm --filter @workspace/barakat run build \
 && PORT=3001 pnpm --filter @workspace/barakat-admin run build

# ---- API runtime: lightweight Node image with the bundled server ----
FROM node:24-slim AS api
WORKDIR /app
ENV NODE_ENV=production
# esbuild bundles everything EXCEPT the externalized packages in build.mjs.
# @google-cloud/storage is externalized but imported at startup (object storage),
# so it must be present in the runtime image or the API crashes on boot with
# ERR_MODULE_NOT_FOUND. Install just that runtime external here.
COPY --from=builder /app/artifacts/api-server/dist ./dist
RUN npm install --omit=dev --no-package-lock --no-fund --no-audit @google-cloud/storage@^7.21.0
EXPOSE 8080
CMD ["node", "--enable-source-maps", "./dist/index.mjs"]

# ---- Web runtime: Caddy serves static sites + reverse-proxies /api ----
FROM caddy:2-alpine AS web
COPY --from=builder /app/artifacts/barakat/dist/public /srv/barakat
COPY --from=builder /app/artifacts/barakat-admin/dist /srv/barakat-admin
