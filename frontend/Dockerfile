# syntax=docker/dockerfile:1.7
# Build context: /Users/Shared/srv/Vigil/

# ─── Stage 1: deps ───────────────────────────────────────────────────
FROM node:22-bookworm-slim AS deps
RUN corepack enable
WORKDIR /app

COPY Vigil/pnpm-workspace.yaml Vigil/pnpm-lock.yaml Vigil/package.json ./
COPY Vigil/backend/package.json ./backend/
COPY Vigil/frontend/package.json ./frontend/

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ─── Stage 2: build ─────────────────────────────────────────────────
FROM node:22-bookworm-slim AS builder
RUN corepack enable
WORKDIR /app

COPY --from=deps /app /app
COPY Vigil/frontend/ ./frontend/

ARG NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app/frontend
RUN pnpm build

# ─── Stage 3: runner ────────────────────────────────────────────────
FROM node:22-bookworm-slim AS runner
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates dumb-init \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1

# Standalone bundle (workspace root layout: /app/frontend/server.js)
COPY --from=builder /app/frontend/.next/standalone/ ./
COPY --from=builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=builder /app/frontend/public ./frontend/public

EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "frontend/server.js"]
