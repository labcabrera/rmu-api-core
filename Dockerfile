# syntax=docker/dockerfile:1.7
ARG NODE_IMAGE=node:24-bookworm-slim

# Build on the builder's platform (fast in multi-platform buildx builds)
FROM --platform=$BUILDPLATFORM ${NODE_IMAGE} AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --ignore-scripts
COPY tsconfig*.json ./
COPY src ./src
RUN npm run build

# Production dependencies, also on the builder's platform (no emulation needed): --os/--cpu make npm
# pick the optional platform binaries of the target. Install scripts are skipped, so nothing is compiled.
FROM --platform=$BUILDPLATFORM ${NODE_IMAGE} AS deps
ARG TARGETARCH
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
  npm ci --omit=dev --ignore-scripts --os=linux --cpu="$([ "$TARGETARCH" = amd64 ] && echo x64 || echo "$TARGETARCH")"

FROM ${NODE_IMAGE} AS production
ENV NODE_ENV=production PORT=3001
WORKDIR /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./
USER node
EXPOSE 3001
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=5 \
  CMD ["node", "-e", "fetch(`http://localhost:${process.env.PORT}/v1/health`).then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]
CMD ["node", "--enable-source-maps", "dist/main.js"]
