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
# The server bundle (dist/index.mjs) is fully self-contained. Object storage
# uses the local filesystem (UPLOAD_DIR, default ./data/uploads), which is
# backed by a persistent volume in docker-compose.yml, so no extra runtime
# dependencies are required here.
COPY --from=builder /app/artifacts/api-server/dist ./dist
EXPOSE 8080
CMD ["node", "--enable-source-maps", "./dist/index.mjs"]

# ---- Web runtime: Caddy serves static sites + reverse-proxies /api ----
FROM caddy:2-alpine AS web
COPY --from=builder /app/artifacts/barakat/dist/public /srv/barakat
COPY --from=builder /app/artifacts/barakat-admin/dist /srv/barakat-admin
