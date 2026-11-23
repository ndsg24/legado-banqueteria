FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
COPY apps/admin/package.json apps/admin/package.json
COPY libs/brand/package.json libs/brand/package.json
COPY apps/web/package.json apps/web/package.json
COPY apps/api/package.json apps/api/package.json
COPY libs/domain/package.json libs/domain/package.json
RUN npm ci --ignore-scripts
COPY libs/domain libs/domain
COPY apps/api apps/api
RUN npx --no-install tsc -p apps/api/tsconfig.json && node apps/api/build.mjs

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/apps/api/package.json apps/api/package.json
COPY --from=build /app/libs/domain/package.json libs/domain/package.json
RUN npm ci --workspace=@legado/api --omit=dev --ignore-scripts && npm cache clean --force
COPY --from=build --chown=node:node /app/dist/api ./dist/api
USER node
EXPOSE 3000
CMD ["node", "dist/api/main.cjs"]
