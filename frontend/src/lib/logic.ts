// ============================================
// Vigil Frontend Logic — 함수 구현
// ============================================

import {
  MevType,
  Severity,
  RiskLevel,
  MevAttack,
  DashboardStats,
  TimeSeriesDataPoint,
  ValidatorMetricsRaw,
  ValidatorMetricsNormalized,
  NormalizationBounds,
  RISK_SCORE_CONFIG,
} from './types';

// --- 1.2 심각도 분류 ---

export function classifySeverity(lossUsd: number): Severity {
  if (lossUsd <= 0) return Severity.INFO;
  if (lossUsd < 1) return Severity.LOW;
  if (lossUsd < 10) return Severity.MEDIUM;
  if (lossUsd < 100) return Severity.HIGH;
  return Severity.CRITICAL;
}

// --- 3.1 대시보드 집계 ---

export function aggregateStats(
  attacks: MevAttack[],
  period: '1h' | '24h' | '7d'
): DashboardStats {
  const now = Date.now();
  const periodMs: Record<string, number> = {
    '1h': 3_600_000,
    '24h': 86_400_000,
    '7d': 604_800_000,
  };
  const ms = periodMs[period];

  const current = attacks.filter((a) => a.timestamp > now - ms);
  const previous = attacks.filter(
    (a) => a.timestamp > now - ms * 2 && a.timestamp <= now - ms
  );

  const totalCurrent = current.reduce((sum, a) => sum + (a.extractedUsd ?? 0), 0);
  const totalPrevious = previous.reduce((sum, a) => sum + (a.extractedUsd ?? 0), 0);

  const currentCount = current.length;
  const previousCount = previous.length;

  const attackers = new Set(current.map((a) => a.attacker));

  // changePercent: null when previous period has no data
  const calcChange = (cur: number, prev: number): number | null =>
    prev > 0 ? ((cur - prev) / prev) * 100 : null;

  const avgLossCurrent =
    currentCount > 0 ? totalCurrent / currentCount : 0;
  const avgLossPrevious =
    previousCount > 0 ? totalPrevious / previousCount : 0;

  // topAttacker: attacker with highest total extraction
  const attackerTotals = new Map<string, number>();
  current.forEach((a) => {
    attackerTotals.set(a.attacker, (attackerTotals.get(a.attacker) ?? 0) + (a.extractedUsd ?? 0));
  });
  let topAttacker = '';
  let topAmount = 0;
  attackerTotals.forEach((amount, addr) => {
    if (amount > topAmount) {
      topAttacker = addr;
      topAmount = amount;
    }
  });

  return {
    totalMevExtracted24h: {
      usd: totalCurrent,
      sol: current.reduce((sum, a) => sum + (a.extractedSol ?? 0), 0),
      changePercent: calcChange(totalCurrent, totalPrevious),
    },
    totalAttacks24h: {
      count: currentCount,
      changePercent: calcChange(currentCount, previousCount),
    },
    averageLossPerTx: {
      usd: avgLossCurrent,
      changePercent: calcChange(avgLossCurrent, avgLossPrevious),
    },
    activeAttackers24h: {
      count: attackers.size,
      topAttacker,
    },
  };
}

// --- 3.2 시계열 버킷 (빈 버킷 채우기 수정 포함) ---

export function formatTimestamp(
  ts: number,
  interval: '5m' | '1h' | '4h' | '1d'
): string {
  const d = new Date(ts);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');

  if (interval === '1d') return `${mm}/${dd}`;
  return `${mm}/${dd} ${hh}:${min}`;
}

export function bucketByTime(
  attacks: MevAttack[],
  interval: '5m' | '1h' | '4h' | '1d'
): TimeSeriesDataPoint[] {
  const intervalMs: Record<string, number> = {
    '5m': 300_000,
    '1h': 3_600_000,
    '4h': 14_400_000,
    '1d': 86_400_000,
  };
  const ms = intervalMs[interval];

  if (attacks.length === 0) return [];

  const buckets = new Map<number, MevAttack[]>();

  // 공격 데이터를 버킷에 분배
  attacks.forEach((attack) => {
    const bucketKey = Math.floor(attack.timestamp / ms) * ms;
    if (!buckets.has(bucketKey)) buckets.set(bucketKey, []);
    buckets.get(bucketKey)!.push(attack);
  });

  // 빈 버킷 채우기 (수정된 로직)
  const timestamps = attacks.map((a) => a.timestamp);
  const minTs = Math.min(...timestamps);
  const maxTs = Math.max(...timestamps);
  const startBucket = Math.floor(minTs / ms) * ms;
  const endBucket = Math.floor(maxTs / ms) * ms;

  for (let t = startBucket; t <= endBucket; t += ms) {
    if (!buckets.has(t)) buckets.set(t, []);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([ts, bucket]) => ({
      timestamp: ts,
      label: formatTimestamp(ts, interval),
      totalUsd: bucket.reduce((s, a) => s + (a.extractedUsd ?? 0), 0),
      sandwichSingleUsd: bucket
        .filter((a) => a.type === MevType.SANDWICH_SINGLE)
        .reduce((s, a) => s + (a.extractedUsd ?? 0), 0),
      sandwichWideUsd: bucket
        .filter((a) => a.type === MevType.SANDWICH_WIDE)
        .reduce((s, a) => s + (a.extractedUsd ?? 0), 0),
      backrunUsd: bucket
        .filter((a) => a.type === MevType.BACKRUN)
        .reduce((s, a) => s + (a.extractedUsd ?? 0), 0),
      otherUsd: bucket
        .filter(
          (a) =>
            ![MevType.SANDWICH_SINGLE, MevType.SANDWICH_WIDE, MevType.BACKRUN].includes(a.type)
        )
        .reduce((s, a) => s + (a.extractedUsd ?? 0), 0),
      attackCount: bucket.length,
    }));
}

// --- 4.1 리스크 레벨 (반환 타입 수정) ---

export function getRiskLevel(score: number | null): RiskLevel {
  if (score === null) return 'unrated';
  if (score < 25) return 'low';
  if (score < 50) return 'medium';
  if (score < 75) return 'high';
  return 'critical';
}

// --- 4.2 밸리데이터 리스크 스코어링 ---

// min-max 정규화 (0-100)
export function normalizeMinMax(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

// log10 정규화 (0-100) — 극단값 방지
export function normalizeLog(value: number, max: number): number {
  if (max <= 0 || value <= 0) return 0;
  const logVal = Math.log10(1 + value);
  const logMax = Math.log10(1 + max);
  return Math.min(100, (logVal / logMax) * 100);
}

// raw → normalized 변환
export function normalizeMetrics(
  raw: ValidatorMetricsRaw,
  bounds: NormalizationBounds
): ValidatorMetricsNormalized {
  return {
    sandwichInvolvementRate: raw.sandwichInvolvementRate * 100,    // 0-1 → 0-100
    wideSandwichRate: raw.wideSandwichRate * 100,                   // 0-1 → 0-100
    consecutiveLeaderAbuse: normalizeMinMax(
      raw.consecutiveLeaderAbuse,
      bounds.consecutiveLeaderAbuse.min,
      bounds.consecutiveLeaderAbuse.max
    ),
    avgExtractionPerSlot: normalizeMinMax(
      raw.avgExtractionPerSlot,
      bounds.avgExtractionPerSlot.min,
      bounds.avgExtractionPerSlot.max
    ),
    totalExtractedSol: normalizeLog(raw.totalExtractedSol, bounds.totalExtractedSol.max),
    recentTrend: raw.recentTrend,
  };
}

// 최종 리스크 스코어 계산
export function calculateRiskScore(
  raw: ValidatorMetricsRaw,
  bounds: NormalizationBounds
): { score: number | null; level: RiskLevel; normalized: ValidatorMetricsNormalized | null } {
  // Cold start 체크
  if (raw.observedSlots < RISK_SCORE_CONFIG.minObservedSlots) {
    return { score: null, level: 'unrated', normalized: null };
  }

  const norm = normalizeMetrics(raw, bounds);
  const w = RISK_SCORE_CONFIG.weights;

  // 기본 점수 (가중합, 0-90 범위 — 가중치 합이 0.90)
  const base =
    norm.wideSandwichRate          * w.wideSandwichRate +
    norm.avgExtractionPerSlot      * w.avgExtractionPerSlot +
    norm.consecutiveLeaderAbuse    * w.consecutiveLeaderAbuse +
    norm.sandwichInvolvementRate   * w.sandwichInvolvementRate +
    norm.totalExtractedSol         * w.totalExtractedSol;

  // 트렌드 승수 적용
  const multiplier = RISK_SCORE_CONFIG.trendMultiplier[norm.recentTrend];
  const score = Math.min(100, Math.max(0, Math.round(base * multiplier)));

  return {
    score,
    level: getRiskLevel(score),
    normalized: norm,
  };
}

// --- 6.2 벤치마크 등급 (interface에서 분리) ---

export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

export function getGrade(rate: number): Grade {
  if (rate >= 95) return 'A';
  if (rate >= 85) return 'B';
  if (rate >= 70) return 'C';
  if (rate >= 50) return 'D';
  return 'F';
}

// --- 9. 유틸리티 ---

export function shortenAddress(addr: string, chars = 4): string {
  if (addr.length <= chars * 2 + 3) return addr;
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}

export function formatUsd(amount: number | null | undefined): string {
  if (amount == null) return '—';
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(2)}K`;
  return `$${amount.toFixed(2)}`;
}

export function formatSol(lamports: number): string {
  return `${(lamports / 1e9).toFixed(4)} SOL`;
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export function slotToEstimatedTime(slotDiff: number): number {
  return slotDiff * 400;
}

export function trendIcon(changePercent: number): string {
  if (changePercent > 5) return '↑';
  if (changePercent < -5) return '↓';
  return '→';
}

export function trendColor(changePercent: number, invertGood = true): string {
  const isGood = invertGood ? changePercent < 0 : changePercent > 0;
  return isGood ? '#4ae176' : '#ff5252';
}

// --- 영수증 loss percent 계산 (공통 유틸) ---

export function calcLossPercent(expected: number, actual: number): number {
  if (expected <= 0) return 0;
  return ((expected - actual) / expected) * 100;
}
