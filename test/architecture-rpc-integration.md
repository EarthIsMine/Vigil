# Vigil Backend Architecture — RPC 연동 & MVP 구현 가이드

> Next.js API Routes + Helius RPC 기반 백엔드 아키텍처 및 MVP 스코프 정의

---

## 1. 아키텍처 결정

### 1.1 백엔드: Next.js API Routes (`src/app/api/`)

```
이유:
  - 프론트+백 단일 레포 → 소규모 팀에 압도적으로 유리
  - Vercel 배포 한방이면 프론트+백 동시에 올라감
  - 해커톤 심사에서 "배포된 데모"가 핵심 → 이게 가장 빠름
  - 나중에 분리 필요하면 API Routes → 별도 서버 마이그레이션 쉬움
```

### 1.2 RPC 프로바이더: Helius

```
이유:
  - getTransaction + Enhanced API (파싱된 트랜잭션 데이터)
  - DAS API (Digital Asset Standard)
  - 무료 티어 초당 10 RPC → 해커톤 MVP에 충분
  - gRPC 스트리밍 (Yellowstone) → 실시간 감지 확장 가능
  - 공개 RPC는 rate limit 때문에 MEV 분석급 데이터 풀링 불가
```

### 1.3 DB: 해커톤 MVP에서는 불필요

```
영수증 조회:
  TX 시그니처 → Helius API → 실시간 분석 → 응답
  → DB 없이 가능 (온디맨드 분석)

리더보드:
  사전 분석 데이터를 JSON/static으로 제공
  → DB 없이 가능

해커톤 이후 확장 시:
  Supabase (PostgreSQL) + Prisma 추천
  → 무료 티어 + 빠른 세팅
```

---

## 2. 프로젝트 구조

```
src/
├── app/                          # 프론트엔드 페이지
│   ├── dashboard/page.tsx
│   ├── validator/page.tsx
│   ├── receipt/page.tsx
│   ├── analytics/page.tsx
│   └── api/                      # API Routes (백엔드)
│       ├── receipt/
│       │   └── [signature]/route.ts    # GET /api/receipt/:signature
│       ├── validators/
│       │   ├── route.ts                # GET /api/validators (리더보드)
│       │   └── [identity]/route.ts     # GET /api/validators/:identity
│       └── dashboard/
│           └── stats/route.ts          # GET /api/dashboard/stats
│
├── lib/
│   ├── solana/                   # Helius RPC 클라이언트
│   │   ├── client.ts             # Helius 연결, 공통 설정
│   │   ├── transaction.ts        # TX 조회 + 파싱
│   │   └── pool.ts               # 풀 reserve 상태 조회
│   │
│   ├── detection/                # MEV 감지 엔진
│   │   ├── sandwich.ts           # 샌드위치 감지 로직
│   │   ├── simulator.ts          # AMM 시뮬레이션 (Raydium 우선)
│   │   └── classifier.ts         # MEV 유형 분류 + severity 판정
│   │
│   ├── services/                 # 기존 서비스 레이어
│   ├── types.ts                  # 기존 타입 정의
│   ├── logic.ts                  # 기존 로직 함수
│   └── mock.ts                   # 기존 mock 데이터
│
└── data/                         # 사전 분석된 정적 데이터
    ├── validators.json           # 밸리데이터 리스크 리더보드
    └── known-attackers.json      # 알려진 공격자 주소 DB
```

---

## 3. MVP 스코프 우선순위

### [MUST] 영수증 조회 — Vigil의 핵심 차별점

```
데모 시나리오:
  사용자가 TX 시그니처를 입력
  → 샌드위치 여부 실시간 분석
  → 영수증 렌더링
  → "실제 TX를 넣으면 실제 결과가 나온다" = 임팩트 최대

데이터 흐름:
  프론트 (TX 시그니처 입력)
    → GET /api/receipt/:signature
      → Helius getTransaction (victim TX 조회)
      → 같은 슬롯의 인접 TX 조회 (frontrun/backrun 후보)
      → 샌드위치 패턴 매칭
      → Raydium reserve 시뮬레이션 → expectedAmountOut
      → MevReceipt 응답
    ← 영수증 UI 렌더링
```

### [MUST] 밸리데이터 리스크 리더보드

```
전략: 사전 분석 데이터 (실시간 아님)

준비 작업 (오프라인):
  1. Helius로 최근 7일 샌드위치 TX 수집
  2. 밸리데이터별 메트릭 집계
  3. calculateRiskScore()로 스코어 산출
  4. data/validators.json에 저장

API Route:
  GET /api/validators → validators.json 반환
  GET /api/validators/:identity → 상세 데이터 반환

주기: 해커톤 기간 동안 수동으로 1-2회 업데이트
확장: 나중에 cron + DB로 자동화
```

### [NICE] 대시보드 통계

```
위 두 데이터의 집계:
  - 영수증 분석 결과 → 총 MEV 추출량, 공격 횟수
  - 리더보드 데이터 → 활성 공격자 수, top 공격자

API Route:
  GET /api/dashboard/stats → validators.json 기반 집계
```

### [SKIP] 실시간 MEV 스트리밍

```
이유:
  - gRPC 파이프라인 + 감지 엔진 = 시간 폭발
  - "최근 N시간 데이터" 배치로 해커톤엔 충분
  - 데모에서 실시간이 아니어도 영수증 조회가 실시간이면 OK
```

---

## 4. Helius RPC 클라이언트 설계

### 4.1 기본 설정

```typescript
// src/lib/solana/client.ts

const HELIUS_API_KEY = process.env.HELIUS_API_KEY!;
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const HELIUS_API_URL = `https://api.helius.xyz/v0`;

// 환경변수 체크
if (!HELIUS_API_KEY) {
  console.warn('[Vigil] HELIUS_API_KEY not set — API routes will fail');
}
```

### 4.2 TX 조회

```typescript
// src/lib/solana/transaction.ts

interface ParsedTransaction {
  signature: string;
  slot: number;
  blockTime: number;
  signer: string;
  instructions: ParsedInstruction[];
  preTokenBalances: TokenBalance[];
  postTokenBalances: TokenBalance[];
  // Helius Enhanced API가 파싱해주는 필드들
  tokenTransfers: TokenTransfer[];
  accountData: AccountData[];
}

// Helius Enhanced Transaction API 사용
async function getEnhancedTransaction(signature: string): Promise<ParsedTransaction> {
  const response = await fetch(
    `${HELIUS_API_URL}/transactions/?api-key=${HELIUS_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions: [signature] }),
    }
  );
  const [parsed] = await response.json();
  return parsed;
}

// 같은 슬롯의 TX 목록 조회 (샌드위치 후보 탐색)
async function getBlockTransactions(slot: number): Promise<ParsedTransaction[]> {
  // getBlock RPC 호출
  // → 해당 슬롯의 모든 TX 반환
  // → victim TX 앞뒤의 TX를 frontrun/backrun 후보로 식별
}
```

### 4.3 풀 Reserve 조회

```typescript
// src/lib/solana/pool.ts

interface PoolReserveState {
  tokenAReserve: bigint;
  tokenBReserve: bigint;
  feeRate: number;
  poolType: 'constant_product' | 'clmm' | 'dlmm';
}

// frontrun TX의 preTokenBalances에서 풀 reserve 추출
function extractReserveFromPreBalances(
  tx: ParsedTransaction,
  poolAddress: string
): PoolReserveState {
  // preTokenBalances에서 pool 계정의 잔액 추출
  // → frontrun 직전의 reserve 상태
}
```

---

## 5. 샌드위치 감지 로직

### 5.1 감지 알고리즘 (싱글 슬롯)

```typescript
// src/lib/detection/sandwich.ts

interface SandwichDetectionResult {
  detected: boolean;
  type: 'sandwich_single' | 'sandwich_wide' | null;
  confidence: 'exact' | 'estimated';
  frontrunTx: string | null;
  backrunTx: string | null;
  loss: LossEstimate | null;
}

async function detectSandwich(
  victimSignature: string
): Promise<SandwichDetectionResult> {
  // 1. victim TX 조회
  const victimTx = await getEnhancedTransaction(victimSignature);

  // 2. 같은 슬롯의 TX 목록 조회
  const blockTxs = await getBlockTransactions(victimTx.slot);

  // 3. victim TX의 위치(index) 확인
  const victimIndex = blockTxs.findIndex(
    tx => tx.signature === victimSignature
  );

  // 4. 앞뒤 TX에서 샌드위치 패턴 매칭
  //    조건:
  //    - 같은 풀(pool)에 대한 스왑
  //    - frontrun: victim 직전, 같은 방향 스왑
  //    - backrun: victim 직후, 반대 방향 스왑
  //    - frontrun.signer === backrun.signer (또는 연결된 주소)

  // 5. 매칭되면 reserve 시뮬레이션으로 expectedAmountOut 계산

  // 6. LossEstimate 생성 + MevReceipt 반환
}
```

### 5.2 패턴 매칭 조건

```
싱글슬롯 샌드위치:
  ┌─────────────────────────────────────────────────┐
  │ 같은 슬롯, 같은 풀                                │
  │                                                   │
  │ TX[i-1]  공격자가 tokenA → tokenB 스왑 (frontrun)  │
  │ TX[i]    피해자가 tokenA → tokenB 스왑 (victim)    │
  │ TX[i+1]  공격자가 tokenB → tokenA 스왑 (backrun)   │
  │                                                   │
  │ 검증:                                              │
  │   - TX[i-1].signer === TX[i+1].signer             │
  │     또는 known attacker DB에서 연결 확인            │
  │   - TX[i-1]과 TX[i+1]이 같은 풀 대상               │
  │   - TX[i-1]의 방향과 TX[i]의 방향이 같음            │
  │   - TX[i+1]의 방향은 반대                           │
  └─────────────────────────────────────────────────┘
```

### 5.3 Raydium Constant Product 시뮬레이션

```typescript
// src/lib/detection/simulator.ts

// Phase 1 (MVP): Raydium만 정확 시뮬레이션
function simulateRaydiumSwap(
  reserveA: bigint,
  reserveB: bigint,
  inputAmount: bigint,
  feeRate: number       // 보통 0.0025 (0.25%)
): bigint {
  const inputAfterFee = inputAmount * BigInt(Math.floor((1 - feeRate) * 10000)) / 10000n;
  const k = reserveA * reserveB;
  const newReserveA = reserveA + inputAfterFee;
  const newReserveB = k / newReserveA;
  return reserveB - newReserveB;
}

// expectedAmountOut 계산
function calculateExpectedAmountOut(
  victimTx: ParsedTransaction,
  frontrunTx: ParsedTransaction,
  poolState: PoolReserveState
): LossEstimate {
  // 1. frontrun 직전의 reserve (preTokenBalances)
  // 2. 그 reserve에서 victim의 inputAmount로 시뮬레이션
  //    → expectedAmountOut (MEV 없었을 때)
  // 3. actualAmountOut과 비교
  //    → loss = expected - actual

  return {
    expectedAmountOut,
    actualAmountOut,
    lossAmount: expectedAmountOut - actualAmountOut,
    lossUsd: /* USD 환산 */,
    lossPercent: calcLossPercent(expectedAmountOut, actualAmountOut),
    confidence: poolState.poolType === 'constant_product' ? 'exact' : 'estimated',
  };
}
```

---

## 6. API Routes 설계

### 6.1 영수증 조회

```
GET /api/receipt/:signature

응답: MevReceipt (types.ts 참고)

로직:
  1. Helius로 TX 조회
  2. 스왑 TX인지 확인 (아니면 404)
  3. 같은 슬롯 TX 조회
  4. 샌드위치 패턴 매칭
  5. 매칭되면 reserve 시뮬레이션
  6. MevReceipt 생성 + 응답

에러:
  400 — 유효하지 않은 시그니처
  404 — TX를 찾을 수 없거나 스왑 TX가 아님
  500 — RPC 에러
```

### 6.2 밸리데이터 리더보드

```
GET /api/validators
GET /api/validators/:identity

소스: data/validators.json (사전 분석)
응답: ValidatorRiskScore[] / ValidatorDetail
```

### 6.3 대시보드 통계

```
GET /api/dashboard/stats

소스: data/validators.json 기반 집계
응답: DashboardStats
```

---

## 7. 환경변수

```env
# .env.local
HELIUS_API_KEY=your_helius_api_key_here

# 선택 (해커톤 이후)
# DATABASE_URL=postgresql://...
# NEXT_PUBLIC_WS_URL=ws://...
```

---

## 8. 구현 순서

```
Phase 1 — Helius 연결 (Day 1)
  □ HELIUS_API_KEY 환경변수 세팅
  □ src/lib/solana/client.ts — 기본 RPC 클라이언트
  □ src/lib/solana/transaction.ts — TX 조회 + 파싱
  □ 테스트: 실제 TX 시그니처로 데이터 조회 확인

Phase 2 — 샌드위치 감지 (Day 2-3)
  □ src/lib/detection/sandwich.ts — 패턴 매칭 로직
  □ src/lib/detection/simulator.ts — Raydium 시뮬레이션
  □ src/lib/detection/classifier.ts — 유형 분류 + severity
  □ 테스트: 알려진 샌드위치 TX로 감지 검증

Phase 3 — API Routes (Day 3-4)
  □ src/app/api/receipt/[signature]/route.ts
  □ 프론트 receipt 페이지 연결 (mock → 실제 API)
  □ 에러 핸들링 + 로딩 상태

Phase 4 — 리더보드 + 대시보드 (Day 4-5)
  □ data/validators.json 생성 (오프라인 분석)
  □ src/app/api/validators/ routes
  □ src/app/api/dashboard/stats route
  □ 프론트 페이지 연결

Phase 5 — 배포 (Day 5)
  □ Vercel 배포
  □ 환경변수 설정
  □ 데모 시나리오 준비 (영수증 조회용 TX 시그니처 목록)
```

---

## 9. 알려진 샌드위치 TX (테스트용)

> 구현 검증에 사용할 실제 샌드위치 공격 TX 시그니처를 여기에 추가해야 함.
> Solana Explorer 또는 Jito Labs 데이터에서 수집 필요.

```
TODO: 테스트용 TX 시그니처 목록 추가
  - Raydium 풀 싱글슬롯 샌드위치 예시
  - Orca Whirlpool 샌드위치 예시 (estimated confidence 테스트)
  - 정상 스왑 TX (false positive 테스트)
```
