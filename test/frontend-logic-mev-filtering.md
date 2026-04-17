# Vigil Frontend Logic — MEV 필터링 & 데이터 처리

> 프론트엔드에서 사용하는 MEV 관련 로직, 필터링 알고리즘, 데이터 변환 규칙 정리

---

## 1. 트랜잭션 분류 (TX Classification)

### 1.1 MEV 유형 enum

```typescript
enum MevType {
  NONE = 'none',                    // MEV 없음 (정상 스왑)
  SANDWICH_SINGLE = 'sandwich_single',   // 싱글슬롯 샌드위치
  SANDWICH_WIDE = 'sandwich_wide',       // 와이드(크로스슬롯) 샌드위치
  SANDWICH_AUTH_HOP = 'sandwich_auth_hop', // Authority-hop 난독화 샌드위치
  BACKRUN = 'backrun',              // 백런 (아비트리지)
  LIQUIDATION = 'liquidation',      // 청산
  JIT_LIQUIDITY = 'jit_liquidity',  // JIT 유동성
}
```

### 1.2 심각도 등급 (Severity)

```typescript
enum Severity {
  INFO = 'info',       // 백런/JIT 등 사용자 피해 적음
  LOW = 'low',         // 손실 < $1
  MEDIUM = 'medium',   // 손실 $1 ~ $10
  HIGH = 'high',       // 손실 $10 ~ $100
  CRITICAL = 'critical' // 손실 > $100
}

function classifySeverity(lossUsd: number): Severity {
  if (lossUsd <= 0) return Severity.INFO;
  if (lossUsd < 1) return Severity.LOW;
  if (lossUsd < 10) return Severity.MEDIUM;
  if (lossUsd < 100) return Severity.HIGH;
  return Severity.CRITICAL;
}
```

### 1.3 필터 상태 인터페이스

```typescript
interface MevFilters {
  // MEV 유형 필터 (다중 선택)
  mevTypes: MevType[];

  // 심각도 필터
  minSeverity: Severity;

  // 기간 필터
  timeRange: {
    preset: '1h' | '6h' | '24h' | '7d' | '30d' | 'custom';
    start?: Date;
    end?: Date;
  };

  // DEX 필터
  dexes: ('jupiter' | 'raydium' | 'orca' | 'meteora' | 'lifinity')[];

  // 금액 필터
  minLossUsd: number;
  maxLossUsd: number | null;

  // 토큰 필터
  tokenMint: string | null;  // 특정 토큰 민트 주소

  // 밸리데이터 필터
  validatorIdentity: string | null;

  // 보호 도구 필터
  protectionTool: ('jito' | 'trojan' | 'bloom' | 'bloxroute' | 'jupiter' | 'none')[];

  // 정렬
  sortBy: 'loss_usd' | 'timestamp' | 'slot' | 'victim_amount';
  sortOrder: 'asc' | 'desc';

  // 페이지네이션
  page: number;
  pageSize: 25 | 50 | 100;
}
```

---

## 2. `expectedAmountOut` 산출 기준

> **핵심 원칙**: `expectedAmountOut`은 항상 백엔드 감지 엔진이 계산. 프론트는 절대 자체 계산하지 않음.

### 2.0.1 산출 방법: 풀 reserve 시뮬레이션

```
"frontrun TX가 없었던 세계"를 시뮬레이션:

  1. frontrun TX 직전의 풀 reserve 상태를 가져옴
     (Helius getTransaction의 preTokenBalances 또는 accountsDB 스냅샷)

  2. 그 reserve 상태에서 victim의 swap을 AMM 공식으로 실행
     → expectedAmountOut

  3. actualAmountOut과 비교
     → 차이 = MEV 손실
```

이 방식만이 "정상 슬리피지"와 "MEV로 인한 추가 슬리피지"를 정확히 분리합니다.

### 2.0.2 DEX별 시뮬레이션 전략

```
Raydium (constant product)  → preTokenBalances에서 reserve 추출 → x*y=k 적용
Orca Whirlpool (CLMM)       → accountsDB에서 tick array 상태 필요
Meteora DLMM                → accountsDB에서 bin 상태 필요
Jupiter (멀티홉)             → 경로상 개별 풀 시뮬레이션 체이닝
```

### 2.0.3 Confidence Level (프론트 표시)

```typescript
type SimulationConfidence = 'exact' | 'estimated';

// 각 영수증/공격 데이터에 포함
interface LossEstimate {
  expectedAmountOut: number;
  actualAmountOut: number;
  lossAmount: number;
  lossUsd: number;
  lossPercent: number;         // (expected - actual) / expected * 100
  confidence: SimulationConfidence;
  // exact     → 풀 reserve 시뮬레이션 완료 (Raydium 등)
  // estimated → 근사값 (CLMM 등 정확한 시뮬레이터 미구현)
}
```

> **UI 규칙**: `confidence === 'estimated'`이면 면책 문구 표시:
> "This loss estimate is approximate. Exact simulation for this pool type is coming soon."

### 2.0.4 해커톤 스코프

```
Phase 1 (MVP): Raydium constant product 정확 시뮬레이션
               + 나머지 DEX는 근사값 (frontrun price impact 역산)
Phase 2:       Orca Whirlpool CLMM / Meteora DLMM 시뮬레이터
Phase 3:       Lifinity 등 마이너 DEX + 커스텀 풀 자동 감지
```

---

## 3. 샌드위치 감지 판별 로직 (프론트 표시용)

### 3.1 싱글슬롯 샌드위치 판별

프론트에서 API 응답을 파싱해서 시각화할 때 사용하는 구조:

```typescript
interface SingleSlotSandwich {
  type: 'sandwich_single';
  slot: number;
  blockTime: number;

  frontrun: {
    signature: string;
    signer: string;          // 공격자 주소
    tokenIn: TokenInfo;
    tokenOut: TokenInfo;
    amountIn: number;
    amountOut: number;
    positionInBlock: number; // 블록 내 순서 (victim 바로 앞)
  };

  victim: {
    signature: string;
    signer: string;          // 피해자 주소
    tokenIn: TokenInfo;
    tokenOut: TokenInfo;
    amountIn: number;
    amountOut: number;         // 실제 받은 양
    expectedAmountOut: number; // MEV 없었으면 받았을 양
    positionInBlock: number;
  };

  backrun: {
    signature: string;
    signer: string;          // 공격자 주소 (frontrun과 동일하거나 연결)
    tokenIn: TokenInfo;
    tokenOut: TokenInfo;
    amountIn: number;
    amountOut: number;
    positionInBlock: number; // victim 바로 뒤
  };

  // 계산된 값
  extractedAmount: number;     // 공격자 순이익 (토큰 기준)
  extractedUsd: number;        // USD 환산
  victimLossPercent: number;   // (expected - actual) / expected * 100
  pool: PoolInfo;
  dex: string;
}
```

### 2.2 와이드 샌드위치 (Cross-Slot) 판별

핵심: frontrun과 backrun이 **다른 슬롯**에 위치

```typescript
interface WideSandwich {
  type: 'sandwich_wide';

  frontrunSlot: number;
  victimSlot: number;
  backrunSlot: number;
  slotSpan: number;            // backrunSlot - frontrunSlot

  // 리더 정보 (와이드 샌드위치의 핵심)
  leaderSchedule: {
    frontrunLeader: string;    // 밸리데이터 ID
    victimLeader: string;
    backrunLeader: string;
    sameLeader: boolean;       // 연속 리더슬롯 악용 여부
    leaderIdentity: string;    // 악성 밸리데이터
  };

  frontrun: SandwichLeg;
  victim: SandwichLeg;
  backrun: SandwichLeg;

  extractedUsd: number;
  victimLossPercent: number;
  pool: PoolInfo;
  dex: string;
}
```

### 2.3 Authority-Hop 패턴

공격자가 SPL 토큰 계정의 authority를 변경해서 추적을 어렵게 하는 패턴:

```typescript
interface AuthHopSandwich extends WideSandwich {
  type: 'sandwich_auth_hop';

  authorityHops: {
    originalAuthority: string;
    intermediateAuthorities: string[];  // 거쳐간 authority들
    finalAuthority: string;
    hopCount: number;
  };

  // 프론트에서 "실제 공격자" 표시에 사용
  resolvedAttacker: string;  // 난독화 해제된 최종 공격자
}
```

---

## 3. 대시보드 집계 로직

### 3.1 실시간 통계 카드 계산

```typescript
interface DashboardStats {
  // 상단 통계 카드 4개
  totalMevExtracted24h: {
    usd: number;
    sol: number;
    changePercent: number;  // 전일 대비 변화율
  };

  totalAttacks24h: {
    count: number;
    changePercent: number;
  };

  averageLossPerTx: {
    usd: number;
    changePercent: number;
  };

  activeAttackers24h: {
    count: number;            // 고유 공격자 수
    topAttacker: string;      // 가장 많이 추출한 공격자
  };
}

// 집계 함수
function aggregateStats(attacks: MevAttack[], period: '1h' | '24h' | '7d'): DashboardStats {
  const now = Date.now();
  const periodMs = {
    '1h': 3600_000,
    '24h': 86400_000,
    '7d': 604800_000,
  }[period];

  const current = attacks.filter(a => a.timestamp > now - periodMs);
  const previous = attacks.filter(a =>
    a.timestamp > now - periodMs * 2 &&
    a.timestamp <= now - periodMs
  );

  const totalCurrent = current.reduce((sum, a) => sum + a.extractedUsd, 0);
  const totalPrevious = previous.reduce((sum, a) => sum + a.extractedUsd, 0);

  return {
    totalMevExtracted24h: {
      usd: totalCurrent,
      sol: current.reduce((sum, a) => sum + a.extractedSol, 0),
      changePercent: totalPrevious > 0
        ? ((totalCurrent - totalPrevious) / totalPrevious) * 100
        : 0,
    },
    // ... 나머지 동일 패턴
  };
}
```

### 3.2 차트 데이터 변환

```typescript
// 시계열 차트 (MEV 추출량 추이)
interface TimeSeriesDataPoint {
  timestamp: number;
  label: string;               // "04/07 14:00"
  totalUsd: number;
  sandwichSingleUsd: number;
  sandwichWideUsd: number;
  backrunUsd: number;
  otherUsd: number;
  attackCount: number;
}

// 시간 버킷 생성
function bucketByTime(
  attacks: MevAttack[],
  interval: '5m' | '1h' | '4h' | '1d'
): TimeSeriesDataPoint[] {
  const intervalMs = {
    '5m': 300_000,
    '1h': 3600_000,
    '4h': 14400_000,
    '1d': 86400_000,
  }[interval];

  const buckets = new Map<number, MevAttack[]>();

  attacks.forEach(attack => {
    const bucketKey = Math.floor(attack.timestamp / intervalMs) * intervalMs;
    if (!buckets.has(bucketKey)) buckets.set(bucketKey, []);
    buckets.get(bucketKey)!.push(attack);
  });

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([ts, bucket]) => ({
      timestamp: ts,
      label: formatTimestamp(ts, interval),
      totalUsd: bucket.reduce((s, a) => s + a.extractedUsd, 0),
      sandwichSingleUsd: bucket
        .filter(a => a.type === MevType.SANDWICH_SINGLE)
        .reduce((s, a) => s + a.extractedUsd, 0),
      sandwichWideUsd: bucket
        .filter(a => a.type === MevType.SANDWICH_WIDE)
        .reduce((s, a) => s + a.extractedUsd, 0),
      backrunUsd: bucket
        .filter(a => a.type === MevType.BACKRUN)
        .reduce((s, a) => s + a.extractedUsd, 0),
      otherUsd: bucket
        .filter(a => ![MevType.SANDWICH_SINGLE, MevType.SANDWICH_WIDE, MevType.BACKRUN].includes(a.type))
        .reduce((s, a) => s + a.extractedUsd, 0),
      attackCount: bucket.length,
    }));
}
```

### 3.3 DEX별 파이 차트

```typescript
interface DexBreakdown {
  dex: string;
  label: string;        // "Jupiter", "Raydium", etc.
  totalUsd: number;
  percentage: number;
  attackCount: number;
  color: string;        // 차트 색상
}

const DEX_COLORS: Record<string, string> = {
  jupiter: '#4ae176',
  raydium: '#9945ff',
  orca: '#00d1ff',
  meteora: '#ff6b35',
  lifinity: '#ff69b4',
  other: '#8892ab',
};
```

---

## 4. 밸리데이터 리스크 스코어링 (프론트 표시)

> **스코어 2종 분리 설계**
> - `riskScore` (0-100) — 실시간 경고/라우팅 결정용. 최근 7일 가중. Protection RPC가 사용
> - `trustScore` (0-100) — 리더보드/레지스트리용. 30~90일 누적. (v2 구현 예정)

### 4.1 메트릭 타입

```typescript
type RiskLevel = 'low' | 'medium' | 'high' | 'critical' | 'unrated';
type RecentTrend = 'increasing' | 'stable' | 'decreasing';

// Raw 메트릭 (정규화 전)
interface ValidatorMetricsRaw {
  sandwichInvolvementRate: number;   // 0-1 비율
  wideSandwichRate: number;          // 0-1 비율
  consecutiveLeaderAbuse: number;    // 횟수 (raw)
  totalExtractedSol: number;         // SOL (raw)
  avgExtractionPerSlot: number;      // SOL (raw)
  recentTrend: RecentTrend;
  observedSlots: number;             // 관측된 슬롯 수 (cold start 판정용)
}

// 정규화된 메트릭 (0-100)
interface ValidatorMetricsNormalized {
  sandwichInvolvementRate: number;   // 0-100
  wideSandwichRate: number;          // 0-100
  consecutiveLeaderAbuse: number;    // 0-100 (min-max)
  totalExtractedSol: number;         // 0-100 (log10)
  avgExtractionPerSlot: number;      // 0-100 (min-max)
  recentTrend: RecentTrend;
}

interface ValidatorRiskScore {
  identity: string;
  name: string;
  voteAccount: string;
  metricsRaw: ValidatorMetricsRaw;
  metricsNormalized: ValidatorMetricsNormalized | null;  // unrated면 null
  riskScore: number | null;          // unrated면 null
  riskLevel: RiskLevel;
  lastUpdated: number;
}
```

### 4.2 가중치 & 스코어 계산

```
가중치 배분 (합계 0.90, 10%는 향후 지표 여유분):

  Tier 1 — 핵심 (60%)
    wideSandwichRate:          0.30   ← 밸리데이터 레벨 공모의 직접 증거
    consecutiveLeaderAbuse:    0.15   ← 의도성 증명 (연속 리더슬롯 악용)
    sandwichInvolvementRate:   0.15   ← 기본 빈도

  Tier 2 — 정규화된 규모 (30%)
    avgExtractionPerSlot:      0.20   ← 스테이크 크기 무관 공정 비교
    totalExtractedSol:         0.10   ← log scale 적용 (극단값 방지)

  Tier 3 — 보정
    recentTrend:               승수   ← 최종 스코어에 곱셈
```

```typescript
const RISK_SCORE_CONFIG = {
  weights: {
    wideSandwichRate: 0.30,
    avgExtractionPerSlot: 0.20,
    consecutiveLeaderAbuse: 0.15,
    sandwichInvolvementRate: 0.15,
    totalExtractedSol: 0.10,
  },
  trendMultiplier: {
    increasing: 1.15,   // 악화 중 → 15% 부스트
    stable:     1.00,
    decreasing: 0.85,   // 개선 중 → 15% 감쇠
  },
  minObservedSlots: 100,  // cold start threshold
} as const;
```

### 4.3 정규화 방법

```typescript
// min-max 정규화 (consecutiveLeaderAbuse, avgExtractionPerSlot)
function normalizeMinMax(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

// log10 정규화 (totalExtractedSol — 극단값 방지)
function normalizeLog(value: number, max: number): number {
  if (max <= 0 || value <= 0) return 0;
  return Math.min(100, (Math.log10(1 + value) / Math.log10(1 + max)) * 100);
}

// 비율 지표는 단순 * 100 (sandwichInvolvementRate, wideSandwichRate)
```

> **초기 전략**: min-max + 클램핑으로 시작, 데이터 쌓이면 percentile rank로 전환

### 4.4 최종 스코어 계산

```typescript
function calculateRiskScore(
  raw: ValidatorMetricsRaw,
  bounds: NormalizationBounds
): { score: number | null; level: RiskLevel; normalized: ValidatorMetricsNormalized | null } {
  // Cold start 체크
  if (raw.observedSlots < RISK_SCORE_CONFIG.minObservedSlots) {
    return { score: null, level: 'unrated', normalized: null };
  }

  const norm = normalizeMetrics(raw, bounds);
  const w = RISK_SCORE_CONFIG.weights;

  // 기본 점수 (가중합)
  const base =
    norm.wideSandwichRate          * w.wideSandwichRate +
    norm.avgExtractionPerSlot      * w.avgExtractionPerSlot +
    norm.consecutiveLeaderAbuse    * w.consecutiveLeaderAbuse +
    norm.sandwichInvolvementRate   * w.sandwichInvolvementRate +
    norm.totalExtractedSol         * w.totalExtractedSol;

  // 트렌드 승수 적용
  const multiplier = RISK_SCORE_CONFIG.trendMultiplier[norm.recentTrend];
  const score = Math.min(100, Math.max(0, Math.round(base * multiplier)));

  return { score, level: getRiskLevel(score), normalized: norm };
}
```

> **테스트 검증 결과**:
> | 시나리오 | score | level |
> |---------|-------|-------|
> | 악성 (wide 90%, increasing) | 88 | critical |
> | 선량 (wide 1%, decreasing) | 2 | low |
> | 중간 (stable) | 42 | medium |
> | 중간 + increasing | 48 | medium |
> | 중간 + decreasing | 35 | medium |
> | 관측 부족 (<100슬롯) | null | unrated |

### 4.5 Cold Start 처리

- `observedSlots < 100` → `riskLevel: 'unrated'`, `riskScore: null`
- UI에서 "Insufficient data" 뱃지 표시
- v2에서 베이지안 사전분포(전체 평균에서 시작 → 데이터 쌓이면 수렴) 고려

### 4.6 리스크 레벨 판정 & UI 색상

```typescript
function getRiskLevel(score: number | null): RiskLevel {
  if (score === null) return 'unrated';
  if (score < 25) return 'low';
  if (score < 50) return 'medium';
  if (score < 75) return 'high';
  return 'critical';
}

const RISK_COLORS = {
  low:      { bg: '#1a5c30', text: '#4ae176', border: '#2d8b4e' },
  medium:   { bg: '#5c4a1a', text: '#ffb74d', border: '#8b7a2d' },
  high:     { bg: '#5c2d1a', text: '#ff8a65', border: '#8b4e2d' },
  critical: { bg: '#5c1a1a', text: '#ff5252', border: '#8b2d2d' },
  unrated:  { bg: '#2a2a3a', text: '#8892ab', border: '#3a3a4a' },
};
```

### 4.2 밸리데이터 상세 페이지 데이터

```typescript
interface ValidatorDetail extends ValidatorRiskScore {
  // 슬롯 타임라인
  recentSlots: {
    slot: number;
    hadSandwich: boolean;
    sandwichType: MevType | null;
    extractedUsd: number;
    victimCount: number;
  }[];

  // 연속 리더슬롯 패턴
  leaderStreaks: {
    startSlot: number;
    endSlot: number;
    slotCount: number;
    sandwichCount: number;
    totalExtracted: number;
  }[];

  // 히스토리컬 스코어
  scoreHistory: {
    date: string;
    score: number;
  }[];

  // 관련 공격자 지갑
  associatedAttackers: {
    address: string;
    cooccurrenceRate: number; // 이 밸리데이터 슬롯에서 활동한 비율
    totalExtracted: number;
  }[];
}
```

---

## 5. MEV 영수증 생성 로직

### 5.1 영수증 데이터 구조

```typescript
interface MevReceipt {
  // 식별
  receiptId: string;             // "VGL-2026-04-07-XXXX"
  txSignature: string;
  timestamp: number;

  // 피해 내역
  victim: {
    wallet: string;
    action: 'swap';
    dex: string;
    tokenIn: TokenInfo;
    tokenOut: TokenInfo;
    amountIn: number;
    expectedAmountOut: number;   // MEV 없었을 때 예상치
    actualAmountOut: number;
    slippage: number;            // 설정한 슬리피지
  };

  // MEV 분석 결과
  mevAnalysis: {
    detected: boolean;
    type: MevType;
    severity: Severity;
    loss: LossEstimate;          // expectedAmountOut + confidence 포함
  };

  // 공격 상세
  attackDetail: {
    attackerAddress: string;
    frontrunTx: string;
    backrunTx: string;
    attackerProfit: number;
    attackerProfitUsd: number;
    pool: string;
    frontrunSlot: number;
    backrunSlot: number;
    isWideSandwich: boolean;
  };

  // 밸리데이터 정보
  validator: {
    identity: string;
    name: string;
    riskLevel: string;
    riskScore: number;
  };

  // 보호 도구 사용 여부
  protection: {
    toolUsed: string | null;     // 'jito', 'trojan', 'bloom', null
    wasProtected: boolean;
    protectionFailed: boolean;   // 보호 도구 썼는데도 당한 경우
  };

  // 공유용
  shareUrl: string;              // vigil.so/receipt/VGL-2026-04-07-XXXX
  shareImageUrl: string;         // OG 이미지 URL
}
```

### 5.2 영수증 검색 (내 지갑 조회)

```typescript
interface ReceiptSearchParams {
  wallet: string;                // 내 지갑 주소
  timeRange: '24h' | '7d' | '30d' | 'all';
  onlyAttacked: boolean;         // 피해 받은 TX만
  minLossUsd: number;
}

// 결과 요약
interface ReceiptSearchResult {
  totalTxScanned: number;
  totalAttacked: number;
  totalLossUsd: number;
  totalLossSol: number;
  avgLossPerTx: number;
  worstAttack: MevReceipt;
  receipts: MevReceipt[];
}
```

---

## 6. 보호 도구 벤치마크 로직

> **지표 설계 원칙**
> - `protectionRate` = **(A) 도구별 방어 성공률** (메인 지표) — "이 도구 쓰면 얼마나 안전한가"
> - `coverage` = **(B) 시장 점유율** (보조 지표) — 표본 크기 신뢰도 근거
> - `"none"` 행을 반드시 포함 — 보호 도구 미사용 베이스라인 제공

### 6.1 도구 식별 가능성 (해커톤 스코프)

```
Tier 1 (해커톤 — 정확 식별):
  Jito 번들    → tip account transfer + bundle landing 패턴 (★★☆)
  Jupiter      → program ID 필터 (★★★)
  None (bare)  → 위 패턴에 해당하지 않는 일반 스왑 TX

Tier 2 (해커톤 이후 — 추정 식별):
  Trojan/Bloom → 알려진 fee account 패턴 + 커뮤니티 제보 DB

Tier 3 (장기):
  bloXroute    → 프라이빗 채널이라 외부 식별 거의 불가
               → 협력 관계 또는 사용자 자발적 태깅
```

### 6.2 벤치마크 데이터

```typescript
type ToolConfidence = 'verified' | 'estimated';

interface ProtectionBenchmark {
  tool: string;                  // 'jito', 'jupiter', 'none', 'trojan', 'bloom', 'bloxroute'
  label: string;
  period: '24h' | '7d' | '30d';
  confidence: ToolConfidence;    // 식별 신뢰도

  metrics: {
    // 메인 지표 (A): 도구별 방어 성공률
    totalProtectedTx: number;    // 이 도구를 경유한 TX 수
    attackedTx: number;          // 그 중 샌드위치 감지된 TX 수
    protectionRate: number;      // (1 - attackedTx/totalProtectedTx) * 100

    // 와이드 샌드위치 방어율 (Vigil 차별화 지표)
    wideSandwichProtectionRate: number;

    // 보조 지표 (B): 시장 점유율
    coverage: number;            // totalProtectedTx / totalSwapTx * 100

    // 실패 심각도
    avgLossWhenFailed: number;   // 보호 실패 TX의 평균 손실 USD

    // 비용 대비 효과 (Jito 등 유료 도구)
    avgTipCost: number;          // 평균 팁 (lamports)
    costEffectivenessRatio: number; // 보호 금액 / 팁 비용
  };

  // DEX별 보호율
  byDex: {
    dex: string;
    protectionRate: number;
  }[];

  // 시간대별 보호율
  byHour: {
    hour: number;
    protectionRate: number;
    attackVolume: number;
  }[];
}
```

> **Low confidence 규칙**: `totalProtectedTx < 1000`이면 UI에 ⚠ 표시
> + "Low sample size — interpret with caution" 문구

### 6.3 벤치마크 테이블 레이아웃

```
┌──────────┬────────────┬───────────────┬──────────┬──────────────┬────────────┐
│ Tool     │ Protection │ Wide Sandwich │ Coverage │ Sample Size  │ Fail Loss  │
│          │ Rate (A)   │ Defense Rate  │ (B)      │              │ (avg USD)  │
├──────────┼────────────┼───────────────┼──────────┼──────────────┼────────────┤
│ Jito     │ 94.2%  B   │ 71.3%  C      │ 34.5%   │ 482,391  ✓   │ $3.82      │
│ Jupiter  │ 89.7%  B   │ 62.1%  D      │ 28.1%   │ 291,042  ✓   │ $5.14      │
│ None     │ 68.4%  D   │ 41.2%  F      │ 37.4%   │ 387,219  ✓   │ $8.91      │
│ Trojan*  │ 91.5%  B   │ --            │ --       │ < 1,000  ⚠   │ --         │
└──────────┴────────────┴───────────────┴──────────┴──────────────┴────────────┘
                                                    * estimated, low confidence
```

### 6.4 벤치마크 비교 뷰 & 등급 함수

```typescript
interface BenchmarkView {
  sortBy: 'protectionRate' | 'wideSandwichProtectionRate' | 'costEffectiveness' | 'totalTx';
  period: '24h' | '7d' | '30d';
  dexFilter: string | null;
}

// 등급 판정 (별도 함수 — interface 안에 구현 불가)
function getGrade(rate: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (rate >= 95) return 'A';
  if (rate >= 85) return 'B';
  if (rate >= 70) return 'C';
  if (rate >= 50) return 'D';
  return 'F';
}
```

---

## 7. Protection RPC 상태 표시 로직

### 7.1 현재 리더 스케줄 표시

```typescript
interface LeaderScheduleView {
  currentSlot: number;
  currentLeader: string;
  currentLeaderRisk: ValidatorRiskScore;

  // 앞으로 N개 슬롯 예측
  upcoming: {
    slot: number;
    leader: string;
    riskLevel: string;
    riskScore: number;
    isSafe: boolean;             // riskScore < 50
  }[];

  // 전송 권장 여부
  recommendation: {
    shouldWait: boolean;         // 현재 리더가 위험하면 true
    safeSlotEta: number;         // 안전한 슬롯까지 예상 시간(ms)
    safeSlotsInNext100: number;  // 다음 100슬롯 중 안전한 슬롯 수
  };
}
```

### 7.2 TX 전송 상태 추적

```typescript
interface TxSubmissionStatus {
  txSignature: string;
  status: 'preparing' | 'routing' | 'submitted' | 'confirmed' | 'failed';

  routing: {
    method: 'jito_bundle' | 'direct' | 'multipath';
    avoidedValidators: string[];
    selectedPath: string;
    jitoTip: number;             // lamports
  };

  protection: {
    isProtected: boolean;
    protectionMethod: string;
    estimatedSavings: number;    // 보호로 절약한 예상 금액
  };

  timeline: {
    createdAt: number;
    routedAt: number;
    submittedAt: number;
    confirmedAt: number;
    totalLatencyMs: number;
  };
}
```

---

## 8. 실시간 피드 (WebSocket) 데이터 구조 & 동기화 규칙

### 8.1 실시간 공격 피드

```typescript
// WebSocket 이벤트 타입
type WsEvent =
  | { type: 'new_attack'; data: MevAttack }
  | { type: 'stats_update'; data: DashboardStats }  // 10초 간격, 전체 교체
  | { type: 'leader_update'; data: LeaderScheduleView }
  | { type: 'validator_alert'; data: ValidatorAlert };

interface ValidatorAlert {
  validatorIdentity: string;
  validatorName: string;
  alertType: 'consecutive_abuse' | 'spike' | 'new_attacker';
  message: string;
  severity: Severity;
  timestamp: number;
}
```

### 8.2 WS ↔ REST 동기화 규칙

#### Pending Buffer 패턴

WS `new_attack`을 목록에 바로 끼워넣지 않음. "N new attacks detected [Load new]" 배너만 표시.

```typescript
interface AttackListState {
  // REST로 로드한 "확정" 목록 — 화면에 보이는 것
  attacks: MevAttack[];

  // WS로 들어온 "대기" 목록 — 아직 화면에 안 보임
  pendingAttacks: MevAttack[];

  // 중복 방지
  knownIds: Set<string>;
}

function onNewAttack(attack: MevAttack) {
  if (state.knownIds.has(attack.signature)) return;  // 중복 제거
  state.knownIds.add(attack.signature);
  state.pendingAttacks.unshift(attack);
  // 화면 목록은 건드리지 않음. 배너만 업데이트.
}
```

#### 자동 / 수동 Flush 조건

```
자동 flush:
  - 스크롤 위치 = 맨 위 (페이지 1)
  - 정렬 = timestamp DESC
  - 필터 = 없음

수동 flush ([Load new] 클릭):
  - 스크롤을 내린 상태
  - 정렬이 timestamp가 아닐 때
  - 필터가 걸려 있을 때
  - 페이지 2+ 를 보고 있을 때
```

```typescript
function flushPending() {
  state.attacks = applySort(
    applyFilters([...state.pendingAttacks, ...state.attacks], currentFilters),
    currentSort
  );
  state.pendingAttacks = [];
  currentPage = 1;  // 선택적
}
```

#### Cursor 기반 페이지네이션 (offset 사용 금지)

```typescript
// API 요청
interface AttackListRequest {
  after?: string;     // 이 ID 이후 (다음 페이지)
  before?: string;    // 이 ID 이전 (이전 페이지)
  limit: number;
  filters: MevFilters;
  sort: SortConfig;
}

// API 응답
interface AttackListResponse {
  attacks: MevAttack[];
  cursor: {
    hasNext: boolean;
    hasPrev: boolean;
    nextCursor: string;
    prevCursor: string;
  };
  totalCount: number;  // 근사값 허용, "~1,250 attacks" 표시
}
```

> offset 기반이면 새 데이터 삽입 시 페이지가 밀림. cursor 기반은 기준점이 고정이라 안전.

#### Stats 업데이트: 전체 교체 (replace)

```typescript
function onStatsUpdate(event: WsStatsUpdate) {
  const prev = { ...store.stats };
  store.stats = event.data;  // 통째로 교체. merge 안 함.

  // 큰 변화 시 하이라이트
  if (prev && store.stats) {
    const change = Math.abs(
      store.stats.totalMevExtracted24h.usd - prev.totalMevExtracted24h.usd
    );
    if (change > 1000) triggerHighlight('totalMevExtracted24h');
  }
}
```

> `stats_update` 주기: 서버에서 10초 간격 push. 프론트는 count-up 애니메이션으로 부드럽게 전환.

### 8.3 엣지 케이스 처리

```
pending > 100건 쌓임
  → pending 버리고 REST 재호출 (사용자가 한참 안 본 것)

WS와 REST 데이터 충돌 (같은 attack)
  → attack signature로 Set 중복 제거

WS 연결 끊김
  → 자동 재연결 (exponential backoff)
  → 재연결 시 REST stats + attacks 다시 fetch
  → gap 동안 놓친 데이터 보정

탭 비활성 → 활성 복귀
  → REST stats 1회 다시 fetch
  → pending > 100이면 pending 버리고 REST 재호출

실시간 피드 탭 vs 공격 목록 탭
  → 피드 탭: WS 바로 표시 (pending 없이 append)
  → 목록 탭: pending buffer 패턴
  → 같은 WS 이벤트를 두 곳에서 다르게 처리
```

### 8.4 전체 데이터 흐름

```
초기 로드:
  REST /stats           → store.stats
  REST /attacks?limit=50 → store.attacks
  WS connect            → 실시간 수신 시작

WS new_attack:
  → pendingAttacks에 push (화면 목록 불변)
  → "N new attacks" 배너
  → totalCount 낙관적 +1

WS stats_update (10초):
  → store.stats 전체 교체

필터/정렬 변경:
  → pending 버림
  → REST 다시 호출, cursor 리셋
```

### 8.5 피드 필터링 (프론트에서)

```typescript
interface FeedFilter {
  minLossUsd: number;
  mevTypes: MevType[];
  showAlerts: boolean;
  autoScroll: boolean;
  maxItems: number;              // 피드에 유지할 최대 아이템 수 (성능)
}

function formatFeedItem(attack: MevAttack): string {
  const emoji = attack.type === MevType.SANDWICH_WIDE ? '🥪🔴' : '🥪';
  const loss = formatUsd(attack.extractedUsd);
  const victim = shortenAddress(attack.victim.signer);
  const dex = attack.dex.toUpperCase();
  return `${emoji} ${victim} lost ${loss} on ${dex} (${attack.type})`;
}
```

---

## 9. 유틸리티 함수

```typescript
// 주소 축약
function shortenAddress(addr: string, chars = 4): string {
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}

// USD 포맷
function formatUsd(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(2)}K`;
  return `$${amount.toFixed(2)}`;
}

// SOL 포맷
function formatSol(lamports: number): string {
  return `${(lamports / 1e9).toFixed(4)} SOL`;
}

// 상대 시간
function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}h ago`;
  return `${Math.floor(diff / 86400_000)}d ago`;
}

// 슬롯 → 예상 시간 (솔라나 ~400ms/slot)
function slotToEstimatedTime(slotDiff: number): number {
  return slotDiff * 400; // ms
}

// 변화율 화살표
function trendIcon(changePercent: number): string {
  if (changePercent > 5) return '↑';
  if (changePercent < -5) return '↓';
  return '→';
}

// 변화율 색상 (MEV에서는 감소가 좋은 것)
function trendColor(changePercent: number, invertGood = true): string {
  const isGood = invertGood ? changePercent < 0 : changePercent > 0;
  return isGood ? '#4ae176' : '#ff5252';
}
```

---

## 10. API 엔드포인트 매핑

> **규칙**: BE는 `app.setGlobalPrefix('api/v1')` 적용. FE는 `NEXT_PUBLIC_API_URL`에 `/api/v1` 포함 (예: `https://api.vigil.xxx/api/v1`). 아래 경로는 prefix 이후 상대 경로.

| 프론트 페이지 | API 엔드포인트 | 메서드 | 용도 |
|-------------|--------------|--------|------|
| 대시보드 | `/dashboard/stats` | GET | 상단 통계 카드 |
| 대시보드 | `/attacks/recent?limit=` | GET | 공격 목록 (필터/페이지네이션) |
| 대시보드 | `/dashboard/timeseries?range=` | GET | 시계열 차트 데이터 |
| 대시보드 | `/pools/leaderboard?limit=` | GET | DEX/풀별 리더보드 |
| 밸리데이터 | `/validators/leaderboard?limit=` | GET | 밸리데이터 리스크 목록 |
| 밸리데이터 | `/validators/:identity` | GET | 밸리데이터 상세 |
| 밸리데이터 | `/validators/:identity/slots` | GET | 슬롯 타임라인 |
| 영수증 | `/receipts/search?wallet=&range=` | GET | 지갑별 영수증 검색 |
| 분석 | `/analytics/timeseries?range=` | GET | 분석 시계열 |
| 분석 | `/analytics/protocols?limit=` | GET | 프로토콜별 리더보드 |
| 분석 | `/analytics/epochs?limit=` | GET | 에포크별 요약 |
| 실시간 | `ws://.../feed` | WS | 실시간 공격 피드 |

---

## 11. 상태 관리 (Zustand / React Context)

```typescript
interface VigilStore {
  // 필터 상태
  filters: MevFilters;
  setFilters: (f: Partial<MevFilters>) => void;

  // 대시보드 데이터
  stats: DashboardStats | null;
  attacks: MevAttack[];
  timeseries: TimeSeriesDataPoint[];
  isLoading: boolean;

  // 밸리데이터
  validators: ValidatorRiskScore[];
  selectedValidator: ValidatorDetail | null;

  // 영수증
  receiptSearch: ReceiptSearchResult | null;
  currentReceipt: MevReceipt | null;

  // 벤치마크
  benchmarks: ProtectionBenchmark[];

  // 실시간 피드
  feed: MevAttack[];
  feedFilter: FeedFilter;
  wsConnected: boolean;

  // 리더 스케줄
  leaderSchedule: LeaderScheduleView | null;

  // 액션
  fetchStats: (period: string) => Promise<void>;
  fetchAttacks: (filters: MevFilters) => Promise<void>;
  searchReceipts: (params: ReceiptSearchParams) => Promise<void>;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
}
```
