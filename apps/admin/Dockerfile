FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY apps/api/package.json apps/api/package.json
COPY libs/domain/package.json libs/domain/package.json
COPY libs/brand/package.json libs/brand/package.json
RUN npm ci --ignore-scripts
COPY libs libs
COPY apps/admin apps/admin
COPY apps/web/public/images/hero-place-settings/dorada-*.avif apps/web/public/images/hero-place-settings/
RUN cd apps/admin && npx --no-install tsc -p tsconfig.json && npx --no-install vite build

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production BIND_HOST=0.0.0.0
COPY --from=build /app/package*.json ./
COPY --from=build /app/apps/admin/package.json apps/admin/package.json
COPY --from=build /app/libs/domain/package.json libs/domain/package.json
COPY --from=build /app/libs/brand/package.json libs/brand/package.json
RUN npm ci --workspace=@legado/admin --omit=dev --ignore-scripts && npm cache clean --force
COPY --from=build --chown=node:node /app/dist/admin dist/admin
COPY --from=build --chown=node:node /app/apps/admin/*.mjs apps/admin/
USER node
EXPOSE 5186
CMD ["node", "apps/admin/server.mjs"]
