# Vigil BE × solana-sandwich-detector 통합 인계서

> **작성일:** 2026-05-03
> **Detector repo:** [`SangHyeonKwon/solana-sandwich-detector`](https://github.com/SangHyeonKwon/solana-sandwich-detector)
> **Detector 상태:** v1 production-ready (Phase 1-4 완성). 마지막 머지 PR #28 (`1a4d2b9`).

이 문서는 Vigil 백엔드가 **Rust detector 엔진과 정합되어 운영 시작하기 위한 작업 목록**입니다. 한 번 읽고 P0/P1을 먼저 처리하면 detector → Vigil 파이프라인이 살아납니다.

---

## ⚠️ 0. 아키텍처 정정 — 이 문서가 의미하는 것

`backend/CLAUDE.md`에 적힌 옛 데이터 흐름:
```
Helius WS 구독 (슬롯)
  → rpc.service: raw tx 수신 + 파싱
  → detection.service: sandwich 패턴 매칭   ← ❌ 폐기
  → simulation.service: expectedAmountOut 계산  ← ❌ 폐기
  → Prisma → PostgreSQL 저장
```

→ **새 흐름:**
```
Rust detector 프로세스 (sandwich-detect --follow)
  ↓ stdout JSONL
NestJS subprocess supervisor (rpc 모듈 또는 신규 detector 모듈)
  ↓ parseDetectorLine()
Prisma upsert → PostgreSQL
  ↓
WebSocket gateway → 실시간 피드
```

즉 BE는 **detection을 직접 안 짠다**. Rust 바이너리를 spawn해서 stdout을 라인 단위로 ingest. 옛 계획이던 `detection/sandwich.detector.ts`, `detection/simulation.service.ts`는 작성 안 함. 대신 `detection/` 자리에 **subprocess supervisor + JSONL ingest 로직**이 들어갑니다.

이렇게 하는 이유:
- Detector는 이미 4 DEX (Raydium V4, Raydium CPMM, Orca Whirlpool, Meteora DLMM) replay까지 끝나 있고 Tier 3 signals (3.1 ReservesMatchPostState, 3.2 InvariantResidual, 3.3 CI loss bound, 3.5 CounterfactualAttackerProfit) 모두 emit. NestJS에서 다시 짜면 6개월 걸림.
- Rust 측은 schema-drift CI guard (`vigil-v1.json`)로 보호되어 BE가 안전하게 의존 가능.
- 운영 supervision만 BE가 책임.

---

## 1. 🚨 P0 — Heartbeat wire-format break (PR #28)

Detector가 emit하는 heartbeat 메트릭의 shape이 최근 변경되었습니다. flat counter → per-`DexType` bucket.

```jsonc
// BEFORE (이미 문서/머릿속에 있을 수 있는 옛 shape):
{ "_heartbeat": 1730000030000, "metrics": {
    "enriched": 142, "unsupported_dex": 18, "config_unavailable": 3,
    "reserves_missing": 1, "replay_failed": 0, "cross_boundary_unsupported": 4 } }

// AFTER (현재 detector main):
{ "_heartbeat": 1730000030000, "metrics": {
    "raydium_v4":     { "enriched": 90, "unsupported_dex": 0, "config_unavailable": 1,
                        "reserves_missing": 0, "replay_failed": 0, "cross_boundary_unsupported": 0 },
    "raydium_clmm":   { ... 6 counters ... },
    "raydium_cpmm":   { ... },
    "orca_whirlpool": { ... },
    "jupiter_v6":     { ... },
    "meteora_dlmm":   { ... },
    "pump_fun":       { ... },
    "phoenix":        { ... } } }
```

**작업:**
1. Detector repo의 `contrib/vigil-types.ts` 최신본을 BE의 `types/` (또는 어디든 적절한 곳)에 복사. 변경된 부분: `EnrichmentMetricsSnapshot`이 `Record<DexType, EnrichmentMetricsBucket>` alias로 바뀜.
2. dashboard / ops 메트릭 collect 코드에서:
   - 옛 `metrics.cross_boundary_unsupported` → 새 `metrics[dex].cross_boundary_unsupported`
   - 8개 `DexType` 키 항상 존재 (pre-populated, zero-filled). missing-key 핸들링 불필요
3. Per-DEX 가시화 — 특히 **`orca_whirlpool` / `meteora_dlmm`의 `cross_boundary_unsupported`**는 5-array TickArray/BinArray fetch window가 좁아져 enrichment 누락 중이라는 leading signal. 분리 모니터링하면 어떤 DEX bracket을 늘려야 할지 판단 가능.
4. Backward-compat 필요하면: `Object.values(metrics).reduce((a, b) => a + b.cross_boundary_unsupported, 0)`로 옛 합산 복원.

per-attack `SandwichAttack` 스키마는 영향 없음. heartbeat parsing 코드만 영향.

---

## 2. P1 — `vigil-types.ts` 위치 결정 + import

Detector repo의 `contrib/vigil-types.ts`는 hand-tuned TypeScript 미러 — **BE가 직접 import할 표준 타입 정의**입니다.

추천:
- 옵션 A: `backend/src/types/detector.ts`로 직접 복사. 단순, BE 자체 완결성. detector PR마다 수동 sync 필요.
- 옵션 B: detector repo를 git submodule로 추가 → `submodule/contrib/vigil-types.ts` 직접 import. drift 자동 방지, 단 submodule 운영 부담.
- 옵션 C: detector를 npm package로 publish (옵션) → `@earth-is-mine/sandwich-detector-types` 의존. 가장 깔끔, 단 publish 인프라 필요.

**v1은 옵션 A 권장.** 단순하고 빠름. 추후 빈번한 sync 부담이 커지면 B/C로 진화.

---

## 3. JSONL stream 계약

Detector binary `sandwich-detect`는 stdout에 newline-delimited JSON을 emit. 라인 종류 3개:

```typescript
// vigil-types.ts에서 import
import { parseDetectorLine, type DetectorLine, type SandwichAttack, type JsonlHeartbeat } from './types/detector';
```

판별:
- `_header === true` → 시작 시 1회 (schema_version, tool_version 검증용)
- `typeof _heartbeat === "number"` → liveness ping (--heartbeat-secs 간격, 기본 30s)
- 그 외 → SandwichAttack (탐지 1건)

### NestJS subprocess supervisor 패턴 (개략)

```typescript
// detector/detector.service.ts (신규)
import { spawn, ChildProcess } from 'node:child_process';
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { createInterface } from 'node:readline';
import { parseDetectorLine } from '../types/detector';

@Injectable()
export class DetectorService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DetectorService.name);
  private child?: ChildProcess;

  async onModuleInit() {
    this.spawn();
  }

  private spawn() {
    const rpc = process.env.HELIUS_RPC_URL!;     // 별도 env로 관리 추천
    const args = ['--rpc', rpc, '--follow', '--window', '5', '--concurrency', '32', '--heartbeat-secs', '30'];
    this.child = spawn('sandwich-detect', args, { stdio: ['ignore', 'pipe', 'pipe'] });

    const rl = createInterface({ input: this.child.stdout! });
    rl.on('line', async (raw) => {
      try {
        const line = parseDetectorLine(raw);
        if ('_header' in line) {
          this.logger.log(`detector started: schema=${line.schema_version}, version=${line.tool_version}`);
        } else if ('_heartbeat' in line) {
          // metrics ingest (per-DEX bucket §1)
          this.handleHeartbeat(line);
        } else {
          await this.ingestAttack(line);  // §4 참조
        }
      } catch (e) {
        this.logger.error(`bad line: ${raw}`, e);
      }
    });

    this.child.stderr?.on('data', (chunk) => this.logger.warn(`detector stderr: ${chunk}`));
    this.child.on('exit', (code, signal) => {
      this.logger.warn(`detector exited code=${code} signal=${signal}; respawning in 5s`);
      setTimeout(() => this.spawn(), 5000);   // 단순 재시작; §9도 참조
    });
  }

  async onModuleDestroy() {
    this.child?.kill('SIGTERM');
  }
}
```

> binary location: detector repo를 `cargo install --path crates/cli`로 PATH에 설치하거나, prebuilt를 docker image에 동봉. v1 운영 안정화 전엔 docker container 안에서 detector + Vigil BE를 같이 띄우는 게 단순.

---

## 4. `SandwichAttack` → Prisma schema 매핑

ERD의 `MEV_ATTACK` / `SANDWICH_DETAIL` / `MEV_RECEIPT` 테이블은 detector의 SandwichAttack과 거의 1:1 대응되지만 **현재 ERD에 빠진 컬럼들이 있어 추가 필요**합니다.

### 직접 매핑 (이미 ERD에 있음)

| Prisma 컬럼 | SandwichAttack 필드 | 비고 |
|---|---|---|
| `mev_attack.signature` (PK) | `attack_signature` | 오늘은 `victim.signature`. detector가 `finalize_for_vigil()` 호출 후 set. UNIQUE 제약 → dedup 자연 처리 |
| `mev_attack.type` | `attack_type` | `"sandwich"` / `"wide_sandwich"` / `"backrun"` / `"authority_hop"` |
| `mev_attack.slot` | `slot` | bigint |
| `mev_attack.timestamp_ms` | `timestamp_ms` | bigint, null 가능 (synthetic fixture만) |
| `mev_attack.victim_signer` | `victim_signer` | string |
| `mev_attack.victim_amount_in` | `victim_amount_in` | number (lamports/smallest unit) |
| `mev_attack.victim_amount_out` | `victim_amount_out` | number |
| `mev_attack.victim_expected_amount_out` | `victim_amount_out_expected` | number, null 가능 |
| `mev_attack.attacker` | `attacker` | string (frontrun signer) |
| `mev_attack.dex` | `dex` | snake_case enum string |
| `mev_attack.pool` | `pool` | string (FK to POOL) |
| `mev_attack.leader_identity` | `slot_leader` | string, null 가능 (Tier 2 enrichment 실패 시) |
| `mev_attack.severity` | `severity` | `"low"` / `"medium"` / `"high"` / `"critical"` |
| `sandwich_detail.attack_signature` (PK FK) | `attack_signature` | |
| `sandwich_detail.frontrun_tx` | `frontrun.signature` | |
| `sandwich_detail.backrun_tx` | `backrun.signature` | |
| `sandwich_detail.attacker_profit` | `attacker_profit` | number, null 가능 |
| `sandwich_detail.frontrun_slot` | `frontrun_slot` | bigint |
| `sandwich_detail.backrun_slot` | `backrun_slot` | bigint |
| `sandwich_detail.is_wide_sandwich` | `is_wide_sandwich` | boolean |

### 🆕 추가 필요한 컬럼 (현 ERD엔 없음)

`mev_attack`에:
- `victim_loss_lamports` (number, nullable) — Tier 3.3 핵심 수치
- `victim_loss_lamports_lower` (number, nullable) — CI 하한
- `victim_loss_lamports_upper` (number, nullable) — CI 상한
- `price_impact_bps` (number, nullable)
- `bundle_provenance` (string enum, nullable) — `"atomic_bundle"` / `"spanning_bundle"` / `"tip_race"` / `"organic"`
- `confidence` (number, nullable) — [0.0, 1.0]
- `confidence_level` (string enum, nullable) — `"low"` / `"medium"` / `"high"`
- `detection_method` (jsonb, nullable) — `same_block` 또는 `{cross_slot_window: {...}}` 또는 `{jito_bundle_confirmed: {...}}`
- `evidence` (jsonb, nullable) — Tier 3 signals 구조체 (§7 참조). 통째로 jsonb로 저장 권장 (필드 분해 노력 대비 가치 낮음)
- `amm_replay` (jsonb, nullable) — constant-product trace
- `whirlpool_replay` (jsonb, nullable) — Whirlpool 전용 trace
- `dlmm_replay` (jsonb, nullable) — DLMM 전용 trace

`sandwich_detail`에:
- `attacker_profit_real` (number, nullable) — `evidence.passing` 안 `amm_profit` signal에서 추출 가능, 또는 `attacker_profit`과 동일 경우 별도 컬럼 불필요. ERD 검토 필요.

`mev_receipt`에 (기본 매핑은 ok이지만 추가):
- `loss_amount_lower` (number, nullable) — CI 하한
- `loss_amount_upper` (number, nullable) — CI 상한

### 매핑 코드 스케치

```typescript
async ingestAttack(a: SandwichAttack) {
  await this.prisma.mevAttack.upsert({
    where: { signature: a.attack_signature! },
    create: {
      signature: a.attack_signature!,
      type: a.attack_type ?? 'sandwich',
      slot: BigInt(a.slot),
      timestampMs: a.timestamp_ms ? BigInt(a.timestamp_ms) : null,
      victimSigner: a.victim_signer,
      victimAmountIn: a.victim_amount_in,
      victimAmountOut: a.victim_amount_out,
      victimExpectedAmountOut: a.victim_amount_out_expected,
      attacker: a.attacker,
      dex: a.dex,
      pool: a.pool,
      leaderIdentity: a.slot_leader,
      severity: a.severity,
      victimLossLamports: a.victim_loss_lamports,
      victimLossLamportsLower: a.victim_loss_lamports_lower,
      victimLossLamportsUpper: a.victim_loss_lamports_upper,
      priceImpactBps: a.price_impact_bps,
      bundleProvenance: a.bundle_provenance,
      confidence: a.confidence,
      confidenceLevel: a.confidence_level,
      detectionMethod: a.detection_method as any,    // jsonb
      evidence: a.evidence as any,                   // jsonb
      ammReplay: a.amm_replay as any,
      whirlpoolReplay: a.whirlpool_replay as any,
      dlmmReplay: a.dlmm_replay as any,
      sandwichDetail: {
        create: {
          frontrunTx: a.frontrun.signature,
          backrunTx: a.backrun.signature,
          attackerProfit: a.attacker_profit,
          frontrunSlot: a.frontrun_slot ? BigInt(a.frontrun_slot) : null,
          backrunSlot: a.backrun_slot ? BigInt(a.backrun_slot) : null,
          isWideSandwich: a.is_wide_sandwich,
        },
      },
      receipts: {
        create: a.receipts.map((r) => ({
          victimTxSignature: r.victim_tx_signature,
          // ... ERD 그대로 매핑
        })),
      },
    },
    update: {/* upsert로 dedup; 보통 동일 데이터라 update body 비워둬도 ok */},
  });
}
```

`signature` UNIQUE 제약이 있으므로 detector가 같은 attack 재emit해도 DB에 중복 row 안 생김.

---

## 5. Enrichment 매트릭스 — 4 DEX 지원

8개 DEX detection됨. 하지만 enrichment (= AMM replay → loss/profit)은 **4개만 지원**:

| DEX | Detection | Enrichment | replay trace 필드 |
|---|---|---|---|
| `raydium_v4` | ✅ | ✅ | `amm_replay` |
| `raydium_cpmm` | ✅ | ✅ | `amm_replay` |
| `orca_whirlpool` | ✅ | ✅ | `whirlpool_replay` |
| `meteora_dlmm` | ✅ | ✅ | `dlmm_replay` |
| `raydium_clmm` | ✅ | ❌ | — |
| `jupiter_v6` | ✅ | ❌ | — |
| `pump_fun` | ✅ | ❌ | — |
| `phoenix` | ✅ | ❌ | — |

unsupported 4종은 SandwichAttack record는 emit되지만 **enrichment-derived 필드 전부 null**: `victim_loss_lamports`, `attacker_profit`, `price_impact_bps`, replay traces, `severity`, `evidence`.

**BE 정책 결정 필요:**
- (A) 그대로 ingest, UI에서 "enrichment unavailable" 표시 — 가장 자연스러움. 추천.
- (B) `dex in [raydium_clmm, jupiter_v6, pump_fun, phoenix]` 라인은 ingest 단계에서 drop
- (C) 별도 테이블 (`raw_detection_logs` 등)에 보관

(A)면 dashboard query에서 `WHERE victim_loss_lamports IS NOT NULL` 같은 필터로 enriched 만 집계 가능.

---

## 6. Replay trace 3종 mutual exclusion

`SandwichAttack`에는 replay trace 3개 필드가 있고 **셋 중 하나만 non-null**:

```typescript
function getReplayTrace(a: SandwichAttack) {
  switch (a.dex) {
    case 'raydium_v4':
    case 'raydium_cpmm':
      return { kind: 'amm', trace: a.amm_replay };
    case 'orca_whirlpool':
      return { kind: 'whirlpool', trace: a.whirlpool_replay };
    case 'meteora_dlmm':
      return { kind: 'dlmm', trace: a.dlmm_replay };
    default:
      return { kind: 'unsupported', trace: null };
  }
}
```

### u128 base-10 string 필드 (BigInt 처리)

다음 필드들은 u128을 base-10 decimal string으로 직렬화:
- `WhirlpoolReplayTrace.sqrt_price_pre/post_front/post_victim/post_back`
- `WhirlpoolReplayTrace.liquidity_pre/post_front/post_victim/post_back`
- `MeteoraDlmmReplayTrace.bin_price_pre`

JS `number`로 파싱하면 2^53 넘는 값에서 정밀도 손실. **BigInt로 처리**:

```typescript
const sqrtPrice = BigInt(trace.sqrt_price_pre);
```

Prisma는 BigInt 컬럼 또는 jsonb로 저장. jsonb로 통째 저장하면 string 그대로 보존되어 안전.

---

## 7. Tier 3 signals — `evidence.passing` 활용

`evidence: DetectionEvidence`에 구조화된 reasoning trace 들어있음. `passing` array는 detector가 검증한 signals.

검토 가치 있는 signals:

### `reserves_match_post_state` (Tier 3.1)
```typescript
{ kind: "reserves_match_post_state"; divergence_bps: number; passed: boolean }
```
backrun tx의 실제 vault balance vs model 예측. **passed=true** ⇒ replay 수치 (`victim_loss_lamports`, `attacker_profit`) 신뢰. Vigil UI에서 "verified" 배지 띄우기 좋음.

### `invariant_residual` (Tier 3.2)
```typescript
{ kind: "invariant_residual"; step: "frontrun" | "victim" | "backrun"; residual_bps: number }
```
Per-step model fidelity. residual 0 근처 ⇒ AMM math가 chain log와 일치. |residual| ≥ 100 ⇒ 신뢰 X.

### `counterfactual_attacker_profit` (Tier 3.5)
```typescript
{ kind: "counterfactual_attacker_profit"; with_victim: number; without_victim: number }
```
attacker가 victim 없었으면 얻었을 profit. 순수 sandwich ⇒ `with_victim > 0`, `without_victim ≤ 0`. `without_victim` 강하게 양수면 → 단순 arbitrage (분류 가치 낮음 — Vigil이 이런 케이스를 따로 표시할지 결정).

### `victim_loss` / `amm_profit`
```typescript
{ kind: "victim_loss"; lamports: number; impact_bps: number }
{ kind: "amm_profit"; attacker_profit_real: number }
```
이미 top-level 필드와 중복이지만 evidence 안에서도 접근 가능 (감사 추적 용도).

dashboard에서 활용 가능한 `evidence.ensemble_agreement` (passing categories 비율, [0.0, 1.0])도 좋은 confidence 지표.

---

## 8. 운영 — supervisor / restart / dedup / RPC

### Supervisor

§3의 NestJS spawn 코드는 단순 재시작 (`exit` → `setTimeout(5s)` → respawn). 운영 강화 옵션:
- **Exponential backoff**: 연속 crash 시 5s → 30s → 60s → cap 5min
- **Crash counter alerting**: 1시간에 N회 이상 crash면 Slack 알림 (Sentry 또는 직접)
- **Health check endpoint**: `/health/detector`에서 last heartbeat timestamp 기반 liveness 판단

### ⚠️ Restart state loss

Detector 재시작 시 in-memory tx cache 초기화. crash boundary 걸친 cross-slot sandwich (attack의 frontrun과 backrun이 다른 슬롯에 있고 그 사이에 detector가 죽으면) 미감지 가능.

대응:
- **수용 가능**: detector가 panic 거의 안 나는 코드 (검증된 retry/backoff). 단순 ignore.
- **gap re-scan**: detector 재시작 시각 ±N 슬롯을 `--range A-B` 모드로 별도 backfill. NestJS가 ts 기록 → 재spawn 후 backfill 호출. v1 이후 검토.

### Dedup

⚠️ **Detector는 dedup 안 함.** 슬롯 두 번 스캔하면 같은 attack 두 번 emit 가능 (e.g. supervisor crash → re-spawn 후 backfill 중복).

→ **BE가 dedup authority.** `mev_attack.signature` UNIQUE 제약 + `prisma.upsert` 패턴 (§4 코드 참조). 자연스럽게 처리됨.

### RPC tier

- `--follow` 24/7은 **paid Helius tier 권장** (또는 동등). free tier는 rate-limit 빠르게 hit.
- `--rpc` (env `RPC_URL`) — 메인 (블록 수신용)
- `--pool-state` (env `POOL_STATE_RPC`) — enrichment용 별도 분리 가능 (archival 노드 추천)
- `--concurrency` 튜닝: paid Helius standard ~32-64, free ~4

### 로그 레벨

Detector stderr는 `tracing` 출력. `RUST_LOG=info,sandwich_detector=debug` 같은 env로 조정. NestJS Logger로 forward.

### Backpressure

⚠️ Detector stdout이 PIPE. Vigil BE가 ingest 못 따라가면 PIPE buffer 차고 detector blocking. 주의:
- BE의 ingest 로직이 빠르게 처리하도록 (Prisma upsert는 비동기 큐로 패턴 분리 추천)
- `readline` stream에서 line별 처리는 sequential — 큰 batch 들어오면 backlog
- 운영 중 PIPE block 의심되면: detector stderr에 "blocked on stdout" 같은 메시지 없는지 확인

---

## 9. 검증 도구 — `balance-diff` CLI

Detector repo에 `balance-diff` 신규 binary (PR #24). detector emit한 `victim_amount_out`을 RPC에서 직접 가져온 actual balance change와 cross-check.

```bash
sandwich-detect --rpc $RPC_URL --range 285000000-285001000 \
  | cargo run -p sandwich-cli --bin balance-diff -- --rpc $RPC_URL
```

출력: per-attack `BalanceDiffReport` (parser 추정 vs RPC 관측, `diff_bps`, skip reason).

활용:
- **Vigil deploy 전 smoke**: 작은 slot range로 돌려서 `diff_bps == 0` 비율 확인. 이전 mainnet 샘플: 260/260 perfect, 0 skipped.
- **회귀 검증**: detector 업그레이드 시 BE 측에서 미리 확인
- skip reasons: `bad_signature` / `rpc_fetch_failed` / `unobservable` (Token-2022 transfer fee 등)

---

## 10. Sources of truth

| 파일 | 역할 |
|---|---|
| Detector repo: `crates/swap-events/schema/vigil-v1.json` | per-attack JSON Schema (canonical) |
| Detector repo: `contrib/vigil-types.ts` | TS 미러 — BE가 import할 표준 |
| Detector repo: `swap_events::SCHEMA_VERSION` | 상수 `"vigil-v1"`. breaking change 시 bump |
| Detector repo CI | schema-drift guard (`.github/workflows/ci.yml`) |
| 이 문서 | 통합 가이드 |
| `backend/CLAUDE.md` | (옛 detection 모듈 계획은 §0대로 폐기) |

---

## 11. Known limitations / blind spots

### Token-2022 transfer fee
- Whirlpool / 일부 RaydiumV4 풀에서 Token-2022 사용 시: parser와 observation 모두 net-of-fee로 추출 → diff 0. balance-diff `unobservable`로 마크.
- DLMM에서는 fee가 trace에 surface (`token_x_transfer_fee_bps` / `token_y_transfer_fee_bps` 필드).

### Cross-slot window mid-restart loss
§8 참조. 운영 정책 결정 필요.

### Unsupported DEX (4종)
RaydiumClmm / JupiterV6 / PumpFun / Phoenix는 detection만. enrichment 필드 전부 null. §5 정책 결정 필요.

### Same-block 윈도우 외 attack
window detector의 cross-slot 매칭 윈도우는 `--window N` (기본 1, same-block만). N>1 늘려야 cross-slot 감지. trade-off: 윈도우 클수록 false positive ↑ + 메모리 ↑. 운영 시작 시 1로 시작 → 데이터 보고 늘릴지 결정.

### Helius archival 한계
historical slot의 `getAccountInfo` 안 됨 (Helius 포함 모든 메이저 provider). 그래서 attack의 정확한 pre-state 재구성은 in-block 정보에서만 가능. 이미 detector가 그렇게 동작.

---

## 12. 추천 deploy sequence

```
1. ✅ DETECTOR_INTEGRATION.md 읽고 §0의 architecture pivot 이해
2. P0: vigil-types.ts BE에 import + heartbeat consumer 새 shape 처리 (§1)
3. P0: ERD 업데이트 — §4 추가 컬럼 (victim_loss_lamports / lower / upper, evidence jsonb 등) Prisma migration
4. detector 모듈 신설 (§3 spawn 패턴) + receipts/sandwich_detail upsert 로직 작성 (§4)
5. NestJS 환경에서 detector binary 사용 가능하게 (cargo install or docker)
6. local end-to-end smoke: --range 작은 slot로 detector 띄우고 → ingest → DB row 확인
7. canary 24-48h: --follow 작은 window로 mainnet 1-2일, 메모리/error 관찰
8. full deploy: supervisor 강화 (exponential backoff + alerting) + paid Helius
9. 운영 중 weekly balance-diff smoke (선택)
```

---

## 13. 부록

### `detection_method` serde quirk
```typescript
type DetectionMethod = 'same_block' | { cross_slot_window: { window_size: number } } | { jito_bundle_confirmed: { bundle_id: string } };
```
Rust unit variant (`SameBlock`)는 string `"same_block"`으로 직렬화, tagged variants는 object. discriminator:
```typescript
typeof dm === 'string' ? dm === 'same_block' : 'cross_slot_window' in dm
```

### `Option<u16>` serde
Rust Option은 None을 `null`로 직렬화 (omit 아님). TS에서 `field?: number | null`로 모델링하지만 실제로 `field: number | null` (키 항상 존재).

### `fee_num` / `fee_den` 풀별 차이
- Whirlpool: `fee_den = 1_000_000` (3000 ⇒ 30bps)
- DLMM: `fee_den = 1e9` (DLMM_FEE_PRECISION). `variable_fee_rate_*` 더한 후 10% cap
- RaydiumV4 / Cpmm: `fee_den = 10_000` (25 ⇒ 0.25%)

dashboard에서 fee 비교 시 항상 `fee_num / fee_den` ratio로 정규화.

### Schema version policy
- Per-attack schema에 breaking change (필드 제거 / 타입 변경 / 의미 변경) ⇒ `vigil-v1` → `vigil-v2`로 bump
- 필드 추가는 non-breaking (consumer가 unknown 필드 무시 권장)
- heartbeat shape 변경은 schema_version과 무관 (별도 framing line)
- header line의 `schema_version` 검증 후 unknown 버전이면 ingest 거부 권장

---

질문 / 모호한 부분 있으면 detector repo에 issue 작성. proof engine 쪽 변경 필요 (e.g. 추가 필드, severity 정책, 새 DEX 지원)도 issue로 들어와도 됩니다.
