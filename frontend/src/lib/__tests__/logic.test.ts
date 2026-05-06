import { describe, it, expect } from 'vitest';
import {
  MevType,
  Severity,
  MevAttack,
  ValidatorMetricsRaw,
  NormalizationBounds,
} from '../types';
import {
  classifySeverity,
  aggregateStats,
  bucketByTime,
  formatTimestamp,
  getRiskLevel,
  getGrade,
  shortenAddress,
  formatUsd,
  formatSol,
  slotToEstimatedTime,
  trendIcon,
  trendColor,
  calcLossPercent,
  normalizeMinMax,
  normalizeLog,
  calculateRiskScore,
} from '../logic';

function makeMockAttack(overrides: Partial<MevAttack> = {}): MevAttack {
  return {
    signature: 'sig_' + Math.random().toString(36).slice(2, 10),
    type: MevType.SANDWICH_SINGLE,
    timestamp: Date.now() - 3_600_000,
    slot: 300_000_000,
    extractedUsd: 50,
    extractedSol: 0.5,
    victim: {
      signer: 'VicT1m1234567890abcdefghijklmnopqrstuvwxyz',
      amountIn: 1000,
      amountOut: 950,
      expectedAmountOut: 1000,
    },
    attacker: 'ATK1234567890abcdefghijklmnopqrstuvwxyz1234',
    dex: 'jupiter',
    pool: 'pool_abc123',
    severity: Severity.HIGH,
    confidenceLevel: null,
    detectionMethod: null,
    bundleProvenance: null,
    lossSource: null,
    ...overrides,
  };
}

const BOUNDS: NormalizationBounds = {
  consecutiveLeaderAbuse: { min: 0, max: 50 },
  avgExtractionPerSlot: { min: 0, max: 1 },
  totalExtractedSol: { max: 10000 },
};

// --- classifySeverity ---
describe('classifySeverity', () => {
  it('returns INFO for negative', () => expect(classifySeverity(-5)).toBe(Severity.INFO));
  it('returns INFO for 0', () => expect(classifySeverity(0)).toBe(Severity.INFO));
  it('returns LOW for $0.5', () => expect(classifySeverity(0.5)).toBe(Severity.LOW));
  it('returns LOW for $0.99', () => expect(classifySeverity(0.99)).toBe(Severity.LOW));
  it('returns MEDIUM for $1', () => expect(classifySeverity(1)).toBe(Severity.MEDIUM));
  it('returns MEDIUM for $9.99', () => expect(classifySeverity(9.99)).toBe(Severity.MEDIUM));
  it('returns HIGH for $10', () => expect(classifySeverity(10)).toBe(Severity.HIGH));
  it('returns HIGH for $99.99', () => expect(classifySeverity(99.99)).toBe(Severity.HIGH));
  it('returns CRITICAL for $100', () => expect(classifySeverity(100)).toBe(Severity.CRITICAL));
  it('returns CRITICAL for $10000', () => expect(classifySeverity(10000)).toBe(Severity.CRITICAL));
});

// --- aggregateStats ---
describe('aggregateStats', () => {
  it('aggregates current period correctly', () => {
    const now = Date.now();
    const attacks = [
      makeMockAttack({ timestamp: now - 1_000, extractedUsd: 100, extractedSol: 1, attacker: 'A' }),
      makeMockAttack({ timestamp: now - 2_000, extractedUsd: 200, extractedSol: 2, attacker: 'B' }),
      makeMockAttack({ timestamp: now - 3_000, extractedUsd: 50, extractedSol: 0.5, attacker: 'A' }),
      makeMockAttack({ timestamp: now - 4_000_000, extractedUsd: 100, extractedSol: 1, attacker: 'C' }),
      makeMockAttack({ timestamp: now - 5_000_000, extractedUsd: 100, extractedSol: 1, attacker: 'C' }),
    ];
    const stats = aggregateStats(attacks, '1h');
    expect(stats.totalMevExtracted24h.usd).toBe(350);
    expect(stats.totalMevExtracted24h.sol).toBe(3.5);
    expect(stats.totalMevExtracted24h.changePercent).toBe(75);
    expect(stats.totalAttacks24h.count).toBe(3);
    expect(stats.activeAttackers24h.count).toBe(2);
    expect(stats.activeAttackers24h.topAttacker).toBe('B');
  });

  it('returns null changePercent when no previous data', () => {
    const now = Date.now();
    const attacks = [makeMockAttack({ timestamp: now - 1_000, extractedUsd: 100, extractedSol: 1 })];
    const stats = aggregateStats(attacks, '1h');
    expect(stats.totalMevExtracted24h.changePercent).toBeNull();
  });
});

// --- bucketByTime ---
describe('bucketByTime', () => {
  it('creates correct buckets including empty ones', () => {
    const baseTime = 1_712_500_800_000;
    const attacks = [
      makeMockAttack({ timestamp: baseTime, extractedUsd: 100, type: MevType.SANDWICH_SINGLE }),
      makeMockAttack({ timestamp: baseTime + 100_000, extractedUsd: 50, type: MevType.BACKRUN }),
      makeMockAttack({ timestamp: baseTime + 7_200_000, extractedUsd: 200, type: MevType.SANDWICH_WIDE }),
    ];
    const buckets = bucketByTime(attacks, '1h');
    expect(buckets).toHaveLength(3);
    expect(buckets[0].attackCount).toBe(2);
    expect(buckets[0].sandwichSingleUsd).toBe(100);
    expect(buckets[0].backrunUsd).toBe(50);
    expect(buckets[1].attackCount).toBe(0);
    expect(buckets[1].totalUsd).toBe(0);
    expect(buckets[2].sandwichWideUsd).toBe(200);
  });

  it('returns empty array for empty input', () => {
    expect(bucketByTime([], '1h')).toHaveLength(0);
  });
});

// --- getRiskLevel ---
describe('getRiskLevel', () => {
  it.each([
    [0, 'low'], [24, 'low'],
    [25, 'medium'], [49, 'medium'],
    [50, 'high'], [74, 'high'],
    [75, 'critical'], [100, 'critical'],
    [null, 'unrated'],
  ] as const)('getRiskLevel(%s) = %s', (score, expected) => {
    expect(getRiskLevel(score)).toBe(expected);
  });
});

// --- getGrade ---
describe('getGrade', () => {
  it.each([
    [95, 'A'], [100, 'A'],
    [85, 'B'], [94, 'B'],
    [70, 'C'], [50, 'D'],
    [49, 'F'], [0, 'F'],
  ] as const)('getGrade(%d) = %s', (rate, expected) => {
    expect(getGrade(rate)).toBe(expected);
  });
});

// --- shortenAddress ---
describe('shortenAddress', () => {
  it('shortens long addresses', () => {
    expect(shortenAddress('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU')).toBe('7xKX...gAsU');
  });

  it('supports custom char count', () => {
    expect(shortenAddress('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', 6)).toBe('7xKXtg...osgAsU');
  });

  it('returns short addresses unchanged', () => {
    expect(shortenAddress('abc', 4)).toBe('abc');
  });
});

// --- formatUsd ---
describe('formatUsd', () => {
  it.each([
    [0.5, '$0.50'],
    [999, '$999.00'],
    [1000, '$1.00K'],
    [1500, '$1.50K'],
    [1_000_000, '$1.00M'],
    [2_500_000, '$2.50M'],
  ] as const)('formatUsd(%d) = %s', (amount, expected) => {
    expect(formatUsd(amount)).toBe(expected);
  });
});

// --- formatSol ---
describe('formatSol', () => {
  it.each([
    [1_000_000_000, '1.0000 SOL'],
    [500_000_000, '0.5000 SOL'],
    [100_000, '0.0001 SOL'],
  ] as const)('formatSol(%d) = %s', (lamports, expected) => {
    expect(formatSol(lamports)).toBe(expected);
  });
});

// --- slotToEstimatedTime ---
describe('slotToEstimatedTime', () => {
  it('converts slots to ms', () => {
    expect(slotToEstimatedTime(1)).toBe(400);
    expect(slotToEstimatedTime(10)).toBe(4000);
    expect(slotToEstimatedTime(0)).toBe(0);
  });
});

// --- trendIcon ---
describe('trendIcon', () => {
  it.each([
    [10, '↑'], [5.01, '↑'],
    [-10, '↓'],
    [3, '→'], [0, '→'], [5, '→'],
  ] as const)('trendIcon(%s) = %s', (pct, expected) => {
    expect(trendIcon(pct)).toBe(expected);
  });
});

// --- trendColor ---
describe('trendColor', () => {
  it('returns green for negative (invertGood default)', () => {
    expect(trendColor(-10)).toBe('#4ae176');
  });
  it('returns red for positive (invertGood default)', () => {
    expect(trendColor(10)).toBe('#ff5252');
  });
  it('returns green for positive when invertGood=false', () => {
    expect(trendColor(10, false)).toBe('#4ae176');
  });
  it('returns red for zero', () => {
    expect(trendColor(0)).toBe('#ff5252');
  });
});

// --- calcLossPercent ---
describe('calcLossPercent', () => {
  it('calculates percentage correctly', () => {
    expect(calcLossPercent(100, 90)).toBe(10);
    expect(calcLossPercent(1000, 950)).toBe(5);
  });
  it('returns 0 for no loss', () => {
    expect(calcLossPercent(100, 100)).toBe(0);
  });
  it('returns 0 when expected is 0', () => {
    expect(calcLossPercent(0, 50)).toBe(0);
  });
});

// --- formatTimestamp ---
describe('formatTimestamp', () => {
  it('formats 1d as MM/DD', () => {
    const ts = new Date('2024-04-07T14:00:00Z').getTime();
    expect(formatTimestamp(ts, '1d')).toContain('/');
  });
  it('formats 1h as MM/DD HH:MM', () => {
    const ts = new Date('2024-04-07T14:00:00Z').getTime();
    expect(formatTimestamp(ts, '1h')).toContain(':');
  });
});

// --- normalizeMinMax ---
describe('normalizeMinMax', () => {
  it('normalizes middle value', () => expect(normalizeMinMax(50, 0, 100)).toBe(50));
  it('normalizes min to 0', () => expect(normalizeMinMax(0, 0, 100)).toBe(0));
  it('normalizes max to 100', () => expect(normalizeMinMax(100, 0, 100)).toBe(100));
  it('clamps overflow to 100', () => expect(normalizeMinMax(150, 0, 100)).toBe(100));
  it('clamps underflow to 0', () => expect(normalizeMinMax(-10, 0, 100)).toBe(0));
  it('returns 0 when min===max', () => expect(normalizeMinMax(5, 5, 5)).toBe(0));
});

// --- normalizeLog ---
describe('normalizeLog', () => {
  it('returns 0 for 0', () => expect(normalizeLog(0, 1000)).toBe(0));
  it('returns 0 for negative', () => expect(normalizeLog(-5, 1000)).toBe(0));
  it('is monotonically increasing', () => {
    expect(normalizeLog(10, 1000)).toBeLessThan(normalizeLog(100, 1000));
  });
  it('max value is <= 100', () => {
    expect(normalizeLog(1000, 1000)).toBeLessThanOrEqual(100);
  });
  it('log(500) > 50 (log scale property)', () => {
    expect(normalizeLog(500, 1000)).toBeGreaterThan(50);
  });
});

// --- calculateRiskScore ---
describe('calculateRiskScore', () => {
  it('returns unrated for cold start (< minObservedSlots)', () => {
    const raw: ValidatorMetricsRaw = {
      sandwichInvolvementRate: 0.5, wideSandwichRate: 0.3,
      consecutiveLeaderAbuse: 10, totalExtractedSol: 100,
      avgExtractionPerSlot: 0.5, recentTrend: 'increasing', observedSlots: 50,
    };
    const result = calculateRiskScore(raw, BOUNDS);
    expect(result.score).toBeNull();
    expect(result.level).toBe('unrated');
    expect(result.normalized).toBeNull();
  });

  it('scores malicious validator as critical', () => {
    const raw: ValidatorMetricsRaw = {
      sandwichInvolvementRate: 0.8, wideSandwichRate: 0.9,
      consecutiveLeaderAbuse: 40, totalExtractedSol: 5000,
      avgExtractionPerSlot: 0.8, recentTrend: 'increasing', observedSlots: 500,
    };
    const result = calculateRiskScore(raw, BOUNDS);
    expect(result.score).not.toBeNull();
    expect(result.score!).toBeGreaterThanOrEqual(75);
    expect(result.level).toBe('critical');
  });

  it('scores good validator as low', () => {
    const raw: ValidatorMetricsRaw = {
      sandwichInvolvementRate: 0.02, wideSandwichRate: 0.01,
      consecutiveLeaderAbuse: 0, totalExtractedSol: 5,
      avgExtractionPerSlot: 0.01, recentTrend: 'decreasing', observedSlots: 1000,
    };
    const result = calculateRiskScore(raw, BOUNDS);
    expect(result.score).not.toBeNull();
    expect(result.score!).toBeLessThan(25);
    expect(result.level).toBe('low');
  });

  it('increasing trend scores higher than stable', () => {
    const base: ValidatorMetricsRaw = {
      sandwichInvolvementRate: 0.4, wideSandwichRate: 0.5,
      consecutiveLeaderAbuse: 20, totalExtractedSol: 500,
      avgExtractionPerSlot: 0.4, recentTrend: 'stable', observedSlots: 300,
    };
    const stable = calculateRiskScore(base, BOUNDS);
    const increasing = calculateRiskScore({ ...base, recentTrend: 'increasing' }, BOUNDS);
    const decreasing = calculateRiskScore({ ...base, recentTrend: 'decreasing' }, BOUNDS);
    expect(increasing.score!).toBeGreaterThan(stable.score!);
    expect(stable.score!).toBeGreaterThan(decreasing.score!);
  });

  it('wideSandwichRate weight > sandwichInvolvementRate weight', () => {
    const base: ValidatorMetricsRaw = {
      sandwichInvolvementRate: 0, wideSandwichRate: 0,
      consecutiveLeaderAbuse: 0, totalExtractedSol: 0,
      avgExtractionPerSlot: 0, recentTrend: 'stable', observedSlots: 500,
    };
    const wideOnly = calculateRiskScore({ ...base, wideSandwichRate: 1.0 }, BOUNDS);
    const invOnly = calculateRiskScore({ ...base, sandwichInvolvementRate: 1.0 }, BOUNDS);
    expect(wideOnly.score!).toBeGreaterThan(invOnly.score!);
  });
});
