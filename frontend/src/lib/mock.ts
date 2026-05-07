/**
 * Test fixtures — used by component tests in __tests__/ directories.
 * Do NOT import from runtime application code (services, hooks, components).
 * Runtime fallback to mock data was removed when the backend stabilised; the
 * UI now surfaces explicit loading/error/empty states instead.
 *
 * All values are spec-aligned (test/frontend-logic-mev-filtering.md).
 */

import {
  MevType,
  Severity,
} from './types';

// Fixed reference timestamp so SSR and CSR produce identical mock data
// (otherwise Date.now() would diverge between server and client renders).
const REF_TIME = Date.UTC(2026, 4, 7, 12, 0, 0); // 2026-05-07T12:00:00Z
import type {
  DashboardStats,
  TimeSeriesDataPoint,
  ValidatorLeaderboardEntry,
  PoolLeaderboardEntry,
  MevAttack,
  ValidatorDetail,
  ReceiptSearchResult,
  ConfidenceLevel,
  DetectionMethod,
  BundleProvenance,
  LossSource,
} from './types';

// ─── Dashboard ────────────────────────────────────────────────────────────

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalMevExtracted24h: { usd: 4_820_000, sol: 35_400, changePercent: 12.4 },
  totalAttacks24h:      { count: 1247,             changePercent: 8.1 },
  averageLossPerTx:     { usd: 347.21,             changePercent: -5.3 },
  activeAttackers24h:   { count: 38,               topAttacker: 'StKH...7Qx4p' },
};

export const MOCK_TIMESERIES: TimeSeriesDataPoint[] = Array.from({ length: 24 }, (_, i) => {
  const ts = REF_TIME - (23 - i) * 3_600_000;
  const base = 150_000 + Math.sin(i / 3) * 60_000;
  return {
    timestamp: ts,
    label: new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    totalUsd:          Math.round(base + Math.random() * 40_000),
    sandwichSingleUsd: Math.round(base * 0.52),
    sandwichWideUsd:   Math.round(base * 0.18),
    backrunUsd:        Math.round(base * 0.30),
    otherUsd:          Math.round(base * 0.00),
    attackCount:       Math.floor(40 + Math.random() * 30),
  };
});

export const MOCK_VALIDATOR_LEADERBOARD: ValidatorLeaderboardEntry[] = [
  { rank: 1, identity: 'StKHse...7Qx4p', name: 'Stake House Capital', client: 'Jito-Agave', riskScore: 96, riskLevel: 'critical', extractedUsd: '$892K' },
  { rank: 2, identity: 'mariN4...vALi9', name: 'Marinade Finance',    client: 'Jito-Agave', riskScore: 81, riskLevel: 'high',     extractedUsd: '$743K' },
  { rank: 3, identity: 'J1to1a...bund1', name: 'Jito Labs',           client: 'Jito-Agave', riskScore: 74, riskLevel: 'high',     extractedUsd: '$621K' },
  { rank: 4, identity: 'C1oRu5...s1one', name: 'Chorus One',          client: 'Agave',      riskScore: 48, riskLevel: 'medium',   extractedUsd: '$558K' },
  { rank: 5, identity: 'Ev3Rs7...take5', name: 'Everstake',           client: 'Jito-Agave', riskScore: 35, riskLevel: 'medium',   extractedUsd: '$492K' },
];

export const MOCK_POOL_LEADERBOARD: PoolLeaderboardEntry[] = [
  { pool: 'SOL/USDC',    dex: 'Orca',    attacks: 342, volumeLost: '$1.2M', trend: '+15%' },
  { pool: 'RAY/SOL',     dex: 'Raydium', attacks: 289, volumeLost: '$987K', trend: '+8%'  },
  { pool: 'BONK/SOL',    dex: 'Orca',    attacks: 247, volumeLost: '$743K', trend: '+12%' },
  { pool: 'mSOL/SOL',    dex: 'Meteora', attacks: 198, volumeLost: '$621K', trend: '+5%'  },
  { pool: 'JitoSOL/SOL', dex: 'Orca',    attacks: 156, volumeLost: '$492K', trend: '+18%' },
];

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const rndAddr = () => Array.from({ length: 36 }, () => B58[Math.floor(Math.random() * B58.length)]).join('');

const ATTACK_TYPES: MevType[] = [
  MevType.SANDWICH_SINGLE,
  MevType.BACKRUN,
  MevType.SANDWICH_SINGLE,
  MevType.SANDWICH_WIDE,
];
const SEVERITIES: Severity[] = [
  Severity.HIGH,
  Severity.INFO,
  Severity.CRITICAL,
  Severity.MEDIUM,
];
const CONFIDENCE_LEVELS: ConfidenceLevel[] = ['high', 'medium', 'low', 'high'];
const DETECTION_METHODS: DetectionMethod[] = [
  'header',
  'cross_slot_window',
  'jito_bundle',
  'header',
];
const BUNDLE_PROVENANCES: BundleProvenance[] = [
  'atomic',
  'organic',
  'tip_race',
  'spanning',
];
const LOSS_SOURCES: LossSource[] = [
  'amm_replay',
  'whirlpool_replay',
  'dlmm_replay',
  'pool_amount_out',
];

export const MOCK_LIVE_FEED: MevAttack[] = Array.from({ length: 8 }, (_, i) => ({
  signature: `mock-sig-${i}-${REF_TIME}`,
  type: ATTACK_TYPES[i % 4],
  severity: SEVERITIES[i % 4],
  slot: 281_493_000 + i * 4,
  timestamp: REF_TIME - i * 12_000,
  victim: {
    signer: rndAddr(),
    amountIn: parseFloat((Math.random() * 5 + 0.1).toFixed(3)),
    amountOut: parseFloat((Math.random() * 200 + 10).toFixed(2)),
    expectedAmountOut: parseFloat((Math.random() * 220 + 15).toFixed(2)),
  },
  attacker: rndAddr(),
  pool: ['SOL/USDC', 'RAY/SOL', 'BONK/SOL'][i % 3],
  dex:  ['Orca', 'Raydium', 'Meteora'][i % 3],
  extractedUsd: parseFloat((Math.random() * 800 + 20).toFixed(2)),
  extractedSol: parseFloat((Math.random() * 6 + 0.1).toFixed(3)),
  confidenceLevel: CONFIDENCE_LEVELS[i % 4],
  detectionMethod: DETECTION_METHODS[i % 4],
  bundleProvenance: BUNDLE_PROVENANCES[i % 4],
  lossSource: LOSS_SOURCES[i % 4],
}));

// ─── Validator Detail ─────────────────────────────────────────────────────

export const MOCK_VALIDATOR_DETAIL: ValidatorDetail = {
  identity:          'StKHse...7Qx4p',
  voteAccount:       'StKHseVote...7Qx4p',
  name:              'Stake House Capital',
  client:            'Jito-Agave',
  stake:             '2.1M SOL',
  commission:        7,
  activeSinceEpoch:  412,
  riskScore:         96,
  riskLevel:         'critical',
  metricsRaw: {
    sandwichInvolvementRate: 0.87,
    wideSandwichRate: 0.34,
    consecutiveLeaderAbuse: 12,
    totalExtractedSol: 28500,
    avgExtractionPerSlot: 0.42,
    recentTrend: 'increasing',
    observedSlots: 5400,
  },
  metricsNormalized: {
    sandwichInvolvementRate: 87,
    wideSandwichRate: 68,
    consecutiveLeaderAbuse: 75,
    totalExtractedSol: 92,
    avgExtractionPerSlot: 84,
    recentTrend: 'increasing',
  },
  lastUpdated: REF_TIME,
};

// ─── Receipt ──────────────────────────────────────────────────────────────

export const MOCK_RECEIPT_RESULT: ReceiptSearchResult = {
  totalTxScanned: 47,
  totalAttacked:  14,
  totalLossUsd:   58.22,
  totalLossSol:   0.428,
  avgLossPerTx:   4.16,
  worstAttack: {
    receiptId:   'VGL-2026-04-07-0001',
    txSignature: '4nR8xK2j...',
    timestamp:   REF_TIME - 3_600_000,
    victim: {
      wallet:            '7xKp...mN4q',
      action:            'swap',
      dex:               'Orca',
      tokenIn:  { mint: 'So111...', symbol: 'SOL',  decimals: 9 },
      tokenOut: { mint: 'EPjFW...', symbol: 'USDC', decimals: 6 },
      amountIn:           1.5,
      expectedAmountOut:  204.82,
      actualAmountOut:    192.40,
      slippage:           0.5,
    },
    mevAnalysis: {
      detected: true,
      type:     MevType.SANDWICH_SINGLE,
      severity: Severity.HIGH,
      loss: {
        expectedAmountOut: 204.82,
        actualAmountOut:   192.40,
        lossAmount:        12.42,
        lossUsd:           12.42,
        lossPercent:       6.06,
        confidence:        'exact',
      },
    },
    validator: {
      identity:  'StKHse...7Qx4p',
      name:      'Stake House Capital',
      riskLevel: 'critical',
      riskScore: 96,
    },
    protection: {
      toolUsed:        null,
      wasProtected:    false,
      protectionFailed: false,
    },
    shareUrl:      '/receipt/VGL-2026-04-07-0001',
    shareImageUrl: '/receipt/VGL-2026-04-07-0001/image',
    confidenceLevel:   'high',
    detectionMethod:   'jito_bundle',
    bundleProvenance:  'atomic',
    lossSource:        'whirlpool_replay',
    replayTrace:       null,
    attackDetail: {
      kind:               'sandwich',
      attackerAddress:    'Atk...xyz',
      frontrunTx:         '5Kx...9pR',
      backrunTx:          '7mN...2kP',
      attackerProfit:     0.082,
      attackerProfitUsd:  11.20,
      pool:               'SOL/USDC',
      frontrunSlot:       281_493_000,
      backrunSlot:        281_493_002,
      isWideSandwich:     false,
    },
  },
  receipts: [
    {
      receiptId:   'VGL-2026-04-07-0001',
      txSignature: '4nR8xK2j...',
      timestamp:   REF_TIME - 3_600_000,
      victim: {
        wallet:            '7xKp...mN4q',
        action:            'swap',
        dex:               'Orca',
        tokenIn:  { mint: 'So111...', symbol: 'SOL',  decimals: 9 },
        tokenOut: { mint: 'EPjFW...', symbol: 'USDC', decimals: 6 },
        amountIn:           1.5,
        expectedAmountOut:  204.82,
        actualAmountOut:    192.40,
        slippage:           0.5,
      },
      mevAnalysis: {
        detected: true,
        type:     MevType.SANDWICH_SINGLE,
        severity: Severity.HIGH,
        loss: {
          expectedAmountOut: 204.82,
          actualAmountOut:   192.40,
          lossAmount:        12.42,
          lossUsd:           12.42,
          lossPercent:       6.06,
          confidence:        'exact',
        },
      },
      validator: {
        identity:  'StKHse...7Qx4p',
        name:      'Stake House Capital',
        riskLevel: 'critical',
        riskScore: 96,
      },
      protection: {
        toolUsed:        null,
        wasProtected:    false,
        protectionFailed: false,
      },
      shareUrl:      '/receipt/VGL-2026-04-07-0001',
      shareImageUrl: '/receipt/VGL-2026-04-07-0001/image',
      confidenceLevel:   'high',
      detectionMethod:   'jito_bundle',
      bundleProvenance:  'atomic',
      lossSource:        'whirlpool_replay',
      replayTrace:       null,
      attackDetail: {
        kind:               'sandwich',
        attackerAddress:    'Atk...xyz',
        frontrunTx:         '5Kx...9pR',
        backrunTx:          '7mN...2kP',
        attackerProfit:     0.082,
        attackerProfitUsd:  11.20,
        pool:               'SOL/USDC',
        frontrunSlot:       281_493_000,
        backrunSlot:        281_493_002,
        isWideSandwich:     false,
      },
    },
    {
      receiptId:   'VGL-2026-04-07-0002',
      txSignature: '9mWz...pL5v',
      timestamp:   REF_TIME - 7_200_000,
      victim: {
        wallet:            '7xKp...mN4q',
        action:            'swap',
        dex:               'Raydium',
        tokenIn:  { mint: 'EPjFW...', symbol: 'USDC', decimals: 6 },
        tokenOut: { mint: '4k3Dg...', symbol: 'RAY',  decimals: 6 },
        amountIn:           50,
        expectedAmountOut:  12.84,
        actualAmountOut:    12.84,
        slippage:           0.5,
      },
      mevAnalysis: {
        detected:  false,
        type:      MevType.NONE,
        severity:  Severity.INFO,
        loss: { expectedAmountOut: 12.84, actualAmountOut: 12.84, lossAmount: 0, lossUsd: 0, lossPercent: 0, confidence: 'exact' },
      },
      validator: {
        identity:  'C1oRu5...s1one',
        name:      'Chorus One',
        riskLevel: 'medium',
        riskScore: 48,
      },
      protection: {
        toolUsed:        'jito',
        wasProtected:    true,
        protectionFailed: false,
      },
      shareUrl:      '/receipt/VGL-2026-04-07-0002',
      shareImageUrl: '/receipt/VGL-2026-04-07-0002/image',
      confidenceLevel:   null,
      detectionMethod:   null,
      bundleProvenance:  null,
      lossSource:        null,
      replayTrace:       null,
      attackDetail: {
        kind:               'other',
        attackerAddress:    '',
        attackerProfit:     0,
        attackerProfitUsd:  0,
        pool:               'RAY/USDC',
        slot:               281_490_000,
      },
    },
    {
      receiptId:   'VGL-2026-04-07-0003',
      txSignature: '2bTf...hQ8n',
      timestamp:   REF_TIME - 10_800_000,
      victim: {
        wallet:            '7xKp...mN4q',
        action:            'swap',
        dex:               'Raydium',
        tokenIn:  { mint: '4k3Dg...', symbol: 'RAY',  decimals: 6 },
        tokenOut: { mint: 'So111...', symbol: 'SOL',  decimals: 9 },
        amountIn:           40,
        expectedAmountOut:  0.498,
        actualAmountOut:    0.460,
        slippage:           0.5,
      },
      mevAnalysis: {
        detected: true,
        type:     MevType.SANDWICH_SINGLE,
        severity: Severity.MEDIUM,
        loss: {
          expectedAmountOut: 0.498,
          actualAmountOut:   0.460,
          lossAmount:        0.038,
          lossUsd:           5.18,
          lossPercent:       7.63,
          confidence:        'estimated',
        },
      },
      validator: {
        identity:  'J1to1a...bund1',
        name:      'Jito Labs',
        riskLevel: 'high',
        riskScore: 74,
      },
      protection: {
        toolUsed:        null,
        wasProtected:    false,
        protectionFailed: false,
      },
      shareUrl:      '/receipt/VGL-2026-04-07-0003',
      shareImageUrl: '/receipt/VGL-2026-04-07-0003/image',
      confidenceLevel:   'medium',
      detectionMethod:   'cross_slot_window',
      bundleProvenance:  'tip_race',
      lossSource:        'amm_replay',
      replayTrace:       null,
      attackDetail: {
        kind:               'sandwich',
        attackerAddress:    'Atk...abc',
        frontrunTx:         '3Qw...8vL',
        backrunTx:          '9Rt...4jK',
        attackerProfit:     0.031,
        attackerProfitUsd:  4.23,
        pool:               'RAY/SOL',
        frontrunSlot:       281_488_000,
        backrunSlot:        281_488_002,
        isWideSandwich:     false,
      },
    },
  ],
};
