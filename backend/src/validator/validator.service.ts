import { Injectable } from '@nestjs/common';
import { ValidatorStats } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PriceService } from '../price/price.service';

type RecentTrend = 'increasing' | 'stable' | 'decreasing';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical' | 'unrated';

export interface MetricsRaw {
  sandwichInvolvementRate: number;
  wideSandwichRate: number;
  consecutiveLeaderAbuse: number;
  totalExtractedSol: number;
  avgExtractionPerSlot: number;
  recentTrend: RecentTrend;
  observedSlots: number;
}

export interface MetricsNormalized {
  sandwichInvolvementRate: number;
  wideSandwichRate: number;
  consecutiveLeaderAbuse: number;
  totalExtractedSol: number;
  avgExtractionPerSlot: number;
  recentTrend: RecentTrend;
}

interface NormalizationBounds {
  consecutiveLeaderAbuse: { min: number; max: number };
  avgExtractionPerSlot: { min: number; max: number };
  totalExtractedSol: { max: number };
}

interface EnrichedValidator {
  v: ValidatorStats;
  raw: MetricsRaw;
}

const RISK_SCORE_CONFIG = {
  weights: {
    wideSandwichRate: 0.30,
    avgExtractionPerSlot: 0.20,
    consecutiveLeaderAbuse: 0.15,
    sandwichInvolvementRate: 0.15,
    totalExtractedSol: 0.10,
  },
  trendMultiplier: {
    increasing: 1.15,
    stable: 1.0,
    decreasing: 0.85,
  },
  minObservedSlots: 100,
} as const;

const TREND_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class ValidatorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly price: PriceService,
  ) {}

  async getLeaderboard(limit: number) {
    const all = await this.prisma.validatorStats.findMany();
    if (all.length === 0) return [];

    const enriched = await this.enrichAll(all);
    const bounds = this.computeBounds(enriched);
    const solPrice = this.price.getSolUsd();

    const scored = enriched.map((e) => {
      const { score, level } = this.calculateRiskScore(e.raw, bounds);
      return { e, score, level };
    });

    scored.sort((a, b) => {
      const aS = a.score ?? -1;
      const bS = b.score ?? -1;
      if (aS !== bS) return bS - aS;
      return b.e.v.totalAttacksInSlots - a.e.v.totalAttacksInSlots;
    });

    return scored.slice(0, limit).map((s, i) => ({
      rank: i + 1,
      identity: s.e.v.identity,
      name: s.e.v.name || s.e.v.identity.slice(0, 8) + '...',
      client: s.e.v.client || 'unknown',
      riskScore: s.score ?? 0,
      riskLevel: s.level,
      extractedUsd:
        solPrice != null
          ? `$${(s.e.raw.totalExtractedSol * solPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
          : null,
    }));
  }

  async getDetail(identity: string) {
    const v = await this.prisma.validatorStats.findUnique({ where: { identity } });
    if (!v) return null;

    const all = await this.prisma.validatorStats.findMany();
    const enriched = await this.enrichAll(all);
    const bounds = this.computeBounds(enriched);
    const me = enriched.find((e) => e.v.identity === identity);
    if (!me) return null;

    const { score, level, normalized } = this.calculateRiskScore(me.raw, bounds);

    return {
      identity: v.identity,
      name: v.name || v.identity.slice(0, 8) + '...',
      voteAccount: v.voteAccount || '',
      client: v.client || 'unknown',
      stake:
        (Number(v.stake) / 1e9).toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' SOL',
      commission: v.commission,
      activeSinceEpoch: v.activeSinceEpoch,
      metricsRaw: me.raw,
      metricsNormalized: normalized,
      riskScore: score,
      riskLevel: level,
      lastUpdated: v.lastUpdated.getTime(),
    };
  }

  private async enrichAll(validators: ValidatorStats[]): Promise<EnrichedValidator[]> {
    const identities = validators.map((v) => v.identity);
    const [abuseMap, trendMap] = await Promise.all([
      this.computeConsecutiveAbuseMap(identities),
      this.computeTrendMap(identities),
    ]);

    return validators.map((v) => {
      const totalSlots = v.totalSlotsSeen;
      const sandwichRate = totalSlots > 0 ? v.slotsWithSandwich / totalSlots : 0;
      const wideRate = totalSlots > 0 ? v.slotsWithWideSandwich / totalSlots : 0;
      const extractedSol = Number(v.totalExtractedLamports) / 1e9;
      const avgExtraction = totalSlots > 0 ? extractedSol / totalSlots : 0;

      const raw: MetricsRaw = {
        sandwichInvolvementRate: sandwichRate,
        wideSandwichRate: wideRate,
        consecutiveLeaderAbuse: abuseMap.get(v.identity) ?? 0,
        totalExtractedSol: extractedSol,
        avgExtractionPerSlot: avgExtraction,
        recentTrend: trendMap.get(v.identity) ?? 'stable',
        observedSlots: totalSlots,
      };

      return { v, raw };
    });
  }

  private async computeConsecutiveAbuseMap(
    identities: string[],
  ): Promise<Map<string, number>> {
    const map = new Map<string, number>();
    if (identities.length === 0) return map;

    const attacks = await this.prisma.mevAttack.findMany({
      where: { leaderIdentity: { in: identities } },
      select: { leaderIdentity: true, slot: true },
    });

    const slotsByLeader = new Map<string, Set<bigint>>();
    for (const a of attacks) {
      if (!a.leaderIdentity) continue;
      let set = slotsByLeader.get(a.leaderIdentity);
      if (!set) {
        set = new Set();
        slotsByLeader.set(a.leaderIdentity, set);
      }
      set.add(a.slot);
    }

    for (const [identity, slots] of slotsByLeader) {
      const sorted = [...slots].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      let consecutive = 0;
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] - sorted[i - 1] === 1n) consecutive++;
      }
      map.set(identity, consecutive);
    }
    return map;
  }

  private async computeTrendMap(
    identities: string[],
  ): Promise<Map<string, RecentTrend>> {
    const map = new Map<string, RecentTrend>();
    if (identities.length === 0) return map;

    const now = Date.now();
    const startCurr = BigInt(now - TREND_WINDOW_MS);
    const startPrev = BigInt(now - TREND_WINDOW_MS * 2);

    const attacks = await this.prisma.mevAttack.findMany({
      where: {
        leaderIdentity: { in: identities },
        timestampMs: { gte: startPrev },
      },
      select: { leaderIdentity: true, timestampMs: true },
    });

    const counts = new Map<string, { curr: number; prev: number }>();
    for (const a of attacks) {
      if (!a.leaderIdentity || a.timestampMs == null) continue;
      let c = counts.get(a.leaderIdentity);
      if (!c) {
        c = { curr: 0, prev: 0 };
        counts.set(a.leaderIdentity, c);
      }
      if (a.timestampMs >= startCurr) c.curr++;
      else c.prev++;
    }

    for (const [identity, c] of counts) {
      if (c.prev === 0) {
        map.set(identity, c.curr > 0 ? 'increasing' : 'stable');
        continue;
      }
      const ratio = c.curr / c.prev;
      if (ratio > 1.2) map.set(identity, 'increasing');
      else if (ratio < 0.8) map.set(identity, 'decreasing');
      else map.set(identity, 'stable');
    }
    return map;
  }

  private computeBounds(enriched: EnrichedValidator[]): NormalizationBounds {
    const rated = enriched.filter(
      (e) => e.raw.observedSlots >= RISK_SCORE_CONFIG.minObservedSlots,
    );
    const pool = rated.length > 0 ? rated : enriched;

    const abuseVals = pool.map((e) => e.raw.consecutiveLeaderAbuse);
    const avgVals = pool.map((e) => e.raw.avgExtractionPerSlot);
    const totalVals = pool.map((e) => e.raw.totalExtractedSol);

    const safeMin = (arr: number[]) => (arr.length ? Math.min(...arr) : 0);
    const safeMax = (arr: number[]) => (arr.length ? Math.max(...arr) : 0);

    return {
      consecutiveLeaderAbuse: {
        min: safeMin(abuseVals),
        max: Math.max(safeMax(abuseVals), 1),
      },
      avgExtractionPerSlot: {
        min: safeMin(avgVals),
        max: Math.max(safeMax(avgVals), 1e-9),
      },
      totalExtractedSol: { max: Math.max(safeMax(totalVals), 1) },
    };
  }

  private normalizeMinMax(value: number, min: number, max: number): number {
    if (max <= min) return 0;
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  }

  private normalizeLog(value: number, max: number): number {
    if (max <= 0 || value <= 0) return 0;
    const logVal = Math.log10(1 + value);
    const logMax = Math.log10(1 + max);
    return Math.min(100, (logVal / logMax) * 100);
  }

  private normalizeMetrics(
    raw: MetricsRaw,
    bounds: NormalizationBounds,
  ): MetricsNormalized {
    return {
      sandwichInvolvementRate: Math.min(100, raw.sandwichInvolvementRate * 100),
      wideSandwichRate: Math.min(100, raw.wideSandwichRate * 100),
      consecutiveLeaderAbuse: this.normalizeMinMax(
        raw.consecutiveLeaderAbuse,
        bounds.consecutiveLeaderAbuse.min,
        bounds.consecutiveLeaderAbuse.max,
      ),
      avgExtractionPerSlot: this.normalizeMinMax(
        raw.avgExtractionPerSlot,
        bounds.avgExtractionPerSlot.min,
        bounds.avgExtractionPerSlot.max,
      ),
      totalExtractedSol: this.normalizeLog(
        raw.totalExtractedSol,
        bounds.totalExtractedSol.max,
      ),
      recentTrend: raw.recentTrend,
    };
  }

  private calculateRiskScore(
    raw: MetricsRaw,
    bounds: NormalizationBounds,
  ): { score: number | null; level: RiskLevel; normalized: MetricsNormalized | null } {
    if (raw.observedSlots < RISK_SCORE_CONFIG.minObservedSlots) {
      return { score: null, level: 'unrated', normalized: null };
    }

    const norm = this.normalizeMetrics(raw, bounds);
    const w = RISK_SCORE_CONFIG.weights;

    const base =
      norm.wideSandwichRate * w.wideSandwichRate +
      norm.avgExtractionPerSlot * w.avgExtractionPerSlot +
      norm.consecutiveLeaderAbuse * w.consecutiveLeaderAbuse +
      norm.sandwichInvolvementRate * w.sandwichInvolvementRate +
      norm.totalExtractedSol * w.totalExtractedSol;

    const multiplier = RISK_SCORE_CONFIG.trendMultiplier[norm.recentTrend];
    const score = Math.min(100, Math.max(0, Math.round(base * multiplier)));

    return { score, level: this.getRiskLevel(score), normalized: norm };
  }

  private getRiskLevel(score: number | null): RiskLevel {
    if (score === null) return 'unrated';
    if (score < 25) return 'low';
    if (score < 50) return 'medium';
    if (score < 75) return 'high';
    return 'critical';
  }
}
