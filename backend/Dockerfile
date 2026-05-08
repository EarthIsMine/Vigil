# syntax=docker/dockerfile:1.7
# Build context: /Users/Shared/srv/Vigil/  (so both Vigil/ and solana-sandwich-detector/ are accessible)

# ─── Stage 1: Rust detector binary ───────────────────────────────────
FROM rust:1.95-bookworm AS rust-builder
WORKDIR /detector
COPY solana-sandwich-detector/ ./
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/detector/target \
    cargo build --release --bin sandwich-detect && \
    cp target/release/sandwich-detect /usr/local/bin/sandwich-detect

# ─── Stage 2: Node deps + TS build ──────────────────────────────────
FROM node:22-bookworm-slim AS node-builder
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable
WORKDIR /app

# Workspace skeleton (lockfile-first for cache reuse)
COPY Vigil/pnpm-workspace.yaml Vigil/pnpm-lock.yaml Vigil/package.json ./
COPY Vigil/backend/package.json ./backend/
COPY Vigil/frontend/package.json ./frontend/

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Source
COPY Vigil/backend/ ./backend/

WORKDIR /app/backend
RUN pnpm exec prisma generate && pnpm build

# ─── Stage 3: Runtime ────────────────────────────────────────────────
FROM node:22-bookworm-slim AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates openssl dumb-init \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable

WORKDIR /app
COPY --from=rust-builder /usr/local/bin/sandwich-detect /usr/local/bin/sandwich-detect
COPY --from=node-builder /app /app

WORKDIR /app/backend
ENV NODE_ENV=production \
    DETECTOR_BIN=/usr/local/bin/sandwich-detect \
    PORT=3001

EXPOSE 3001
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node dist/main"]
