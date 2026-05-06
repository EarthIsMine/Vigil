<p align="center">
  <h1 align="center">Vigil</h1>
  <p align="center">
    A Solana MEV transparency platform — sandwich detection, validator scoring, per-victim receipts.<br/>
    Real-time live feed, counterfactual replay, and validator risk leaderboards across the Solana DEX surface.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Solana-9945FF?style=for-the-badge&logo=solana&logoColor=white" alt="Solana" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> &middot;
  <a href="#what-vigil-shows">What Vigil Shows</a> &middot;
  <a href="#architecture">Architecture</a> &middot;
  <a href="#detector-integration">Detector Integration</a> &middot;
  <a href="#development">Development</a>
</p>

---

Solana MEV — sandwich attacks, frontruns, backruns — extracts hundreds of millions per year from victim swaps. **Vigil** turns that detection stream into something a user can read: a live feed of attacks pushed in real time, per-victim receipts that show the **counterfactual** ("what would your swap have returned if no attacker had been present?"), validator risk leaderboards, and protocol-level breakdowns.

> Powered by [solana-sandwich-detector](https://github.com/SangHyeonKwon/solana-sandwich-detector). The detector is the upstream stream-in / stream-out primitive (Rust). Vigil is the persistence, scoring, and presentation layer downstream — Nest.js BE, Next.js FE, PostgreSQL.

### What Vigil Shows

| Surface | What you see |
|---------|--------------|
| **Dashboard** (`/dashboard`) | Live attack feed pushed via WebSocket, 24h MEV extraction stats, validator + pool leaderboards, 24h timeseries |
| **MEV Receipt** (`/receipt`) | Per-wallet history of MEV damage. Each attack: confidence badge (`Verified` / `Likely` / `Unverified`), evidence chain (detection method, bundle provenance, loss source), and **counterfactual replay** of the pool state across AMM / Whirlpool / DLMM |
| **Validator** (`/validator/[identity]`) | Normalised + trend-adjusted risk score, attack heatmap, attack distribution, telemetry table |
| **Analytics** (`/analytics`) | Protocol-level leaderboards, attack-type breakdown, epoch-by-epoch summaries |

---

## Quick Start

```bash
# Install workspace deps
pnpm install

# Backend (needs DATABASE_URL + Solana RPC + a built sandwich-detect binary)
pnpm --filter backend dev          # listens on :3001

# Frontend
pnpm --filter vigil-frontend dev   # opens on :3000
```

The frontend requires `NEXT_PUBLIC_API_URL` to point at the backend. Without it, every page surfaces an explicit error state — there is no runtime mock fallback.

### Common scripts

```bash
# Type-check + bundle
pnpm --filter backend build
pnpm --filter vigil-frontend build

# Lint + tests
pnpm --filter vigil-frontend lint
pnpm --filter vigil-frontend test
pnpm --filter backend test

# Prisma
cd backend && npx prisma generate
cd backend && npx prisma migrate dev
```

---

## Architecture

```
[Solana RPC / Helius]
        ↓
[solana-sandwich-detector]   ← spawned as a child process; emits JSONL on stdout
        ↓
[Nest.js Backend]            ← parse → DB write (Prisma) → broadcast
        ↓ REST + WebSocket
[Next.js Frontend]           ← dashboard, receipt, validator, analytics
```

| Layer | Path | Stack |
|-------|------|-------|
| Frontend | `frontend/` | Next.js 16, React 19, TypeScript strict, Tailwind 4, Chart.js, socket.io-client |
| Backend | `backend/` | NestJS 11, TypeScript strict, Prisma + PostgreSQL, socket.io |
| Detector | external | Rust — see [solana-sandwich-detector](https://github.com/SangHyeonKwon/solana-sandwich-detector) |

### Real-time path

The backend's `EventsGateway` exposes the `/events` namespace and emits `new_attack` to all subscribed clients on every detection. The frontend's `useLiveAttacks` hook does a REST seed + WS subscription, so the first paint isn't blocked on the WS handshake; subsequent attacks arrive instantly. CORS for both REST and WS is gated by `ALLOWED_ORIGINS`.

### Confidence + counterfactual surface

Each receipt carries the detector's reasoning end-to-end:

- `confidenceLevel` (`high` / `medium` / `low`) — composite score from the detector's signal ensemble
- `detectionMethod` — `header` (same-block) / `cross_slot_window` / `jito_bundle`
- `bundleProvenance` — `atomic` / `spanning` / `tip_race` / `organic`
- `lossSource` — which replay branch produced the loss number (`amm_replay` / `whirlpool_replay` / `dlmm_replay` / `pool_amount_out` / `unenriched`)
- `replayTrace` — for AMM / Whirlpool / DLMM pools: pre / post-frontrun / post-victim / post-backrun pool snapshots so the receipt UI can render the counterfactual ("if no attack" vs actual)

CLOB venues (Phoenix) emit detections without loss enrichment; the UI surfaces these as `Loss not estimated` instead of synthetic zeros.

---

## Detector Integration

`backend/src/detector/detector.service.ts` consumes the detector's JSONL stream:

1. Spawn `sandwich-detect --follow` as a child process — path via `DETECTOR_BIN`
2. Read newline-delimited JSON from stdout: `_header`, `_heartbeat`, or attack payloads
3. `transform.service.ts` normalises detector snake_case → frontend camelCase, derives `lossSource` from which replay branch fired, and builds the FE `replayTrace`
4. Persist via Prisma (`MevAttack`, `MevReceipt`, `SandwichDetail`, `ValidatorStats`)
5. `EventsGateway.broadcastAttack` pushes the FE-shaped payload to live clients

The detector schema is pinned at `vigil-v1`. Schema breakage requires an explicit version bump on the detector side; `transform.service.ts`'s normalizers absorb minor key drift defensively.

---

## Development

### Backend env vars

| Var | Purpose |
|-----|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `HELIUS_API_KEY` | Helius RPC API key |
| `HELIUS_WS_URL` | Helius WebSocket URL |
| `PORT` | Backend port (default `3001`) |
| `ALLOWED_ORIGINS` | Comma-separated CORS allow-list (REST + WS). Unset → `'*'` in dev with a prod warning. |
| `DETECTOR_BIN` | Path to `sandwich-detect` binary (built from the detector repo) |

### Frontend env vars

| Var | Purpose |
|-----|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base, e.g. `http://localhost:3001/api/v1`. **Required at runtime** — there is no mock fallback. |

### Contributor docs

Internal architecture / convention notes live in:

- [`CLAUDE.md`](CLAUDE.md) — root: architecture overview, FE↔BE protocol
- [`backend/CLAUDE.md`](backend/CLAUDE.md) — module map, env vars, conventions
- [`frontend/CLAUDE.fe.md`](frontend/CLAUDE.fe.md) — folder structure, page-state guidance

---

## License

MIT
