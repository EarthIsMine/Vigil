// ============================================
// Vigil Frontend Types — MEV 필터링 & 데이터 처리
// ============================================

// --- 누락 타입 보완 ---

export interface TokenInfo {
  mint: string;
  symbol: string;
  decimals: number;
  logoUrl?: string;
}

export interface PoolInfo {
  address: string;
  tokenA: TokenInfo;
  tokenB: TokenInfo;
  dex: string;
}

export interface SandwichLeg {
  signature: string;
  signer: string;
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  amountIn: number;
  amountOut: number;
  positionInBlock: number;
}

// MevAttack — store/집계에서 사용하는 핵심 타입
export interface MevAttack {
  signature: string;
  type: MevType;
  timestamp: number;
  slot: number;
  // null when SOL/USD price is unavailable (boot window, CoinGecko outage)
  // or when victim_loss_lamports could not be enriched (e.g. Phoenix CLOB).
  extractedUsd: number | null;
  extractedSol: number | null;
  victim: {
    signer: string;
    amountIn: number;
    amountOut: number;
    expectedAmountOut: number;
  };
  attacker: string;
  dex: string;
  pool: string;
  severity: Severity;
  confidenceLevel: ConfidenceLevel | null;
  detectionMethod: DetectionMethod | null;
  bundleProvenance: BundleProvenance | null;
  // BE always emits a value (`determineLossSource` falls through to
  // 'pool_amount_out' or 'unenriched'), so this is non-nullable for the
  // attack stream. The receipt-level type below is nullable because a
  // receipt without a parent attack falls back to null.
  lossSource: LossSource;
}

export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type DetectionMethod = 'header' | 'cross_slot_window' | 'jito_bundle';
export type BundleProvenance = 'atomic' | 'spanning' | 'tip_race' | 'organic';
export type LossSource =
  | 'amm_replay'
  | 'whirlpool_replay'
  | 'dlmm_replay'
  | 'pool_amount_out'
  | 'unenriched';

export interface AmmReplayData {
  reservesPre: [number, number];
  reservesPostFront: [number, number];
  reservesPostVictim: [number, number];
  reservesPostBack: [number, number];
  spotPricePre: number;
  spotPricePostFront: number;
  counterfactualVictimOut: number;
  actualVictimOut: number;
  feeNum: number;
  feeDen: number;
}

export interface WhirlpoolReplayData {
  sqrtPricePre: string;
  sqrtPricePostFront: string;
  sqrtPricePostVictim: string;
  sqrtPricePostBack: string;
  liquidityPre: string;
  liquidityPostFront: string;
  liquidityPostVictim: string;
  liquidityPostBack: string;
  tickCurrentPre: number;
  tickCurrentPostFront: number;
  tickCurrentPostVictim: number;
  tickCurrentPostBack: number;
  counterfactualVictimOut: number;
  actualVictimOut: number;
  feeNum: number;
  feeDen: number;
}

export interface DlmmReplayData {
  activeIdPre: number;
  activeIdPostFront: number;
  activeIdPostVictim: number;
  activeIdPostBack: number;
  binPricePre: string;
  counterfactualVictimOut: number;
  actualVictimOut: number;
  binStep: number;
  feeNum: number;
  feeDen: number;
  volatilityAccumulatorPre: number;
  volatilityAccumulatorPostFront: number;
  variableFeeRatePre: number;
  variableFeeRatePostFront: number;
  tokenXTransferFeeBps: number | null;
  tokenYTransferFeeBps: number | null;
}

export type ReplayTrace =
  | { kind: 'amm'; data: AmmReplayData }
  | { kind: 'whirlpool'; data: WhirlpoolReplayData }
  | { kind: 'dlmm'; data: DlmmReplayData };

// --- 1. 트랜잭션 분류 ---

export enum MevType {
  NONE = 'none',
  SANDWICH_SINGLE = 'sandwich_single',
  SANDWICH_WIDE = 'sandwich_wide',
  SANDWICH_AUTH_HOP = 'sandwich_auth_hop',
  BACKRUN = 'backrun',
  LIQUIDATION = 'liquidation',
  JIT_LIQUIDITY = 'jit_liquidity',
}

export enum Severity {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// --- 1.3 필터 상태 (timeRange discriminated union 수정) ---

export interface MevFilters {
  mevTypes: MevType[];
  minSeverity: Severity;
  timeRange:
    | { preset: '1h' | '6h' | '24h' | '7d' | '30d' }
    | { preset: 'custom'; start: Date; end: Date };
  dexes: ('jupiter' | 'raydium' | 'orca' | 'meteora' | 'lifinity')[];
  minLossUsd: number;
  maxLossUsd: number | null;
  tokenMint: string | null;
  validatorIdentity: string | null;
  protectionTool: ('jito' | 'trojan' | 'bloom' | 'bloxroute' | 'jupiter' | 'none')[];
  sortBy: 'loss_usd' | 'timestamp' | 'slot' | 'victim_amount';
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: 25 | 50 | 100;
}

// --- 3.1 대시보드 통계 ---

export interface DashboardStats {
  totalMevExtracted24h: {
    usd: number | null; // null = SOL/USD price unavailable
    sol: number;
    changePercent: number | null; // null = 비교 불가
  };
  totalAttacks24h: {
    count: number;
    changePercent: number | null;
  };
  averageLossPerTx: {
    usd: number | null;
    changePercent: number | null;
  };
  activeAttackers24h: {
    count: number;
    topAttacker: string;
  };
}

// --- 3.2 시계열 차트 ---

export interface TimeSeriesDataPoint {
  timestamp: number;
  label: string;
  totalUsd: number;
  sandwichSingleUsd: number;
  sandwichWideUsd: number;
  backrunUsd: number;
  otherUsd: number;
  attackCount: number;
}

// --- 4.1 밸리데이터 리스크 ---

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical' | 'unrated';
export type RecentTrend = 'increasing' | 'stable' | 'decreasing';

// 밸리데이터 메트릭 (raw — 정규화 전)
export interface ValidatorMetricsRaw {
  sandwichInvolvementRate: number;   // 0-1 비율
  wideSandwichRate: number;          // 0-1 비율
  consecutiveLeaderAbuse: number;    // 횟수 (raw)
  totalExtractedSol: number;         // SOL (raw)
  avgExtractionPerSlot: number;      // SOL (raw)
  recentTrend: RecentTrend;
  observedSlots: number;             // 관측된 슬롯 수 (cold start 판정용)
}

// 정규화된 메트릭 (0-100)
export interface ValidatorMetricsNormalized {
  sandwichInvolvementRate: number;   // 0-100
  wideSandwichRate: number;          // 0-100
  consecutiveLeaderAbuse: number;    // 0-100 (min-max 정규화)
  totalExtractedSol: number;         // 0-100 (log10 정규화)
  avgExtractionPerSlot: number;      // 0-100 (min-max 정규화)
  recentTrend: RecentTrend;
}

export interface ValidatorRiskScore {
  identity: string;
  name: string;
  voteAccount: string;
  metricsRaw: ValidatorMetricsRaw;
  metricsNormalized: ValidatorMetricsNormalized | null;  // unrated면 null
  riskScore: number | null;          // unrated면 null
  riskLevel: RiskLevel;
  lastUpdated: number;
}

// 정규화에 필요한 전체 분포 범위
export interface NormalizationBounds {
  consecutiveLeaderAbuse: { min: number; max: number };
  avgExtractionPerSlot: { min: number; max: number };
  totalExtractedSol: { max: number };  // log scale이라 min 불필요
}

// 리스크 스코어링 설정
export const RISK_SCORE_CONFIG = {
  weights: {
    wideSandwichRate: 0.30,
    avgExtractionPerSlot: 0.20,
    consecutiveLeaderAbuse: 0.15,
    sandwichInvolvementRate: 0.15,
    totalExtractedSol: 0.10,
  },
  trendMultiplier: {
    increasing: 1.15,
    stable: 1.00,
    decreasing: 0.85,
  },
  // 남은 10%는 향후 추가 지표 여유분
  minObservedSlots: 100,  // cold start threshold
} as const;

// --- expectedAmountOut 신뢰도 ---

export type SimulationConfidence = 'exact' | 'estimated';

export interface LossEstimate {
  expectedAmountOut: number;
  actualAmountOut: number;
  lossAmount: number;
  lossUsd: number | null;        // null = SOL/USD price unavailable
  lossPercent: number;           // (expected - actual) / expected * 100
  confidence: SimulationConfidence;
}

// --- 5.1 영수증 (attackDetail을 MEV 타입별 discriminated union으로 수정) ---

export interface MevReceiptBase {
  receiptId: string;
  txSignature: string;
  timestamp: number;
  victim: {
    wallet: string;
    action: 'swap';
    dex: string;
    tokenIn: TokenInfo;
    tokenOut: TokenInfo;
    amountIn: number;
    expectedAmountOut: number;
    actualAmountOut: number;
    slippage: number;
  };
  mevAnalysis: {
    detected: boolean;
    type: MevType;
    severity: Severity;
    loss: LossEstimate;          // expectedAmountOut 포함, confidence 표시
  };
  validator: {
    identity: string;
    name: string;
    riskLevel: RiskLevel;
    riskScore: number;
  };
  protection: {
    toolUsed: string | null;
    wasProtected: boolean;
    protectionFailed: boolean;
  };
  shareUrl: string;
  shareImageUrl: string;
  // Surfaced from the parent MevAttack — confidence in the detection itself
  // (orthogonal to mevAnalysis.loss.confidence which is the loss estimate's precision).
  confidenceLevel: ConfidenceLevel | null;
  detectionMethod: DetectionMethod | null;
  bundleProvenance: BundleProvenance | null;
  lossSource: LossSource | null;
  replayTrace: ReplayTrace | null;
}

export interface SandwichAttackDetail {
  kind: 'sandwich';
  attackerAddress: string;
  frontrunTx: string;
  backrunTx: string;
  attackerProfit: number | null;
  attackerProfitUsd: number | null;
  pool: string;
  frontrunSlot: number;
  backrunSlot: number;
  isWideSandwich: boolean;
}

export interface NonSandwichAttackDetail {
  kind: 'other';
  attackerAddress: string;
  attackerProfit: number | null;
  attackerProfitUsd: number | null;
  pool: string;
  slot: number;
}

export interface MevReceipt extends MevReceiptBase {
  attackDetail: SandwichAttackDetail | NonSandwichAttackDetail;
}

// --- 6. 벤치마크 ---

export type ToolConfidence = 'verified' | 'estimated';

export interface ProtectionBenchmark {
  tool: string;
  label: string;
  period: '24h' | '7d' | '30d';
  confidence: ToolConfidence;

  metrics: {
    // 메인 (A): 도구별 방어 성공률
    totalProtectedTx: number;
    attackedTx: number;
    protectionRate: number;        // (1 - attackedTx/totalProtectedTx) * 100

    // Vigil 차별화 지표
    wideSandwichProtectionRate: number;

    // 보조 (B): 시장 점유율
    coverage: number;              // totalProtectedTx / totalSwapTx * 100

    // 실패 심각도
    avgLossWhenFailed: number;

    // 비용 대비 효과
    avgTipCost: number;
    costEffectivenessRatio: number;
  };

  byDex: { dex: string; protectionRate: number }[];
  byHour: { hour: number; protectionRate: number; attackVolume: number }[];
}

export const BENCHMARK_CONFIG = {
  minSampleSize: 1000,  // 이하이면 "Low confidence" 표시
} as const;

export interface BenchmarkView {
  sortBy: 'protectionRate' | 'wideSandwichProtectionRate' | 'costEffectiveness' | 'totalTx';
  period: '24h' | '7d' | '30d';
  dexFilter: string | null;
}

// --- 8. WS ↔ REST 동기화 ---

export interface AttackListState {
  attacks: MevAttack[];
  pendingAttacks: MevAttack[];
  knownIds: Set<string>;
}

export interface AttackListRequest {
  after?: string;
  before?: string;
  limit: number;
  filters: MevFilters;
  sort: { sortBy: string; sortOrder: 'asc' | 'desc' };
}

export interface AttackListResponse {
  attacks: MevAttack[];
  cursor: {
    hasNext: boolean;
    hasPrev: boolean;
    nextCursor: string;
    prevCursor: string;
  };
  totalCount: number;
}

export const SYNC_CONFIG = {
  maxPendingBeforeReset: 100,  // pending 초과 시 REST 재호출
  statsUpdateIntervalMs: 10_000,  // stats_update 주기
  highlightThresholdUsd: 1_000,   // 이 이상 변화 시 하이라이트
} as const;

// --- UI 전용 타입 (리더보드·상세·검색 결과) ---

export interface ValidatorLeaderboardEntry {
  rank: number;
  identity: string;
  name: string;
  client: string;
  riskScore: number;
  riskLevel: RiskLevel;
  extractedUsd: string | null; // null = SOL/USD price unavailable
}

export interface PoolLeaderboardEntry {
  pool: string;
  dex: string;
  attacks: number;
  volumeLost: string;
  trend: string;
}

export interface ValidatorDetail extends ValidatorRiskScore {
  client: string;
  stake: string;
  commission: number;
  activeSinceEpoch: number;
}

export interface ReceiptSearchResult {
  totalTxScanned: number;
  totalAttacked: number;
  totalLossUsd: number | null;
  totalLossSol: number;
  avgLossPerTx: number | null;
  worstAttack: MevReceipt | null;  // BE가 전체 기준 loss DESC로 제공
  receipts: MevReceipt[];
}

// --- Analytics ---

export interface EpochSummary {
  epoch: number;
  extracted: string;
  sandwich: number;
  frontrun: number;
  backrun: number;
  dominantClient: string;
}
