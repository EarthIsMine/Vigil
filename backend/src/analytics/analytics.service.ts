import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransformService } from '../detector/transform.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transform: TransformService,
  ) {}

  async getTimeSeries(range: string) {
    const now = Date.now();
    let sinceMs: number;
    let intervalMs: number;

    switch (range) {
      case '24h':
        sinceMs = now - 24 * 3600_000;
        intervalMs = 3600_000;
        break;
      case '30d':
        sinceMs = now - 30 * 24 * 3600_000;
        intervalMs = 24 * 3600_000;
        break;
      default: // '7d'
        sinceMs = now - 7 * 24 * 3600_000;
        intervalMs = 4 * 3600_000;
        break;
    }

    const attacks = await this.prisma.mevAttack.findMany({
      where: { timestampMs: { gte: BigInt(sinceMs) } },
      select: { timestampMs: true, extractedUsd: true, type: true },
      orderBy: { timestampMs: 'asc' },
    });

    const buckets = new Map<number, {
      totalUsd: number;
      sandwichSingleUsd: number;
      sandwichWideUsd: number;
      backrunUsd: number;
      otherUsd: number;
      attackCount: number;
    }>();

    for (let t = sinceMs; t <= now; t += intervalMs) {
      buckets.set(t, { totalUsd: 0, sandwichSingleUsd: 0, sandwichWideUsd: 0, backrunUsd: 0, otherUsd: 0, attackCount: 0 });
    }

    for (const attack of attacks) {
      const ts = Number(attack.timestampMs ?? 0);
      const bucketKey = sinceMs + Math.floor((ts - sinceMs) / intervalMs) * intervalMs;
      const bucket = buckets.get(bucketKey);
      if (!bucket) continue;

      const usd = attack.extractedUsd ?? 0;
      bucket.totalUsd += usd;
      bucket.attackCount++;

      const feType = this.transform.toFrontendType(attack.type);
      if (feType === 'sandwich_single') bucket.sandwichSingleUsd += usd;
      else if (feType === 'sandwich_wide') bucket.sandwichWideUsd += usd;
      else if (feType === 'backrun') bucket.backrunUsd += usd;
      else bucket.otherUsd += usd;
    }

    return Array.from(buckets.entries()).map(([ts, b]) => ({
      timestamp: ts,
      label: new Date(ts).toISOString(),
      ...b,
    }));
  }

  async getProtocols(limit: number) {
    const pools = await this.prisma.poolStats.findMany({
      orderBy: { attackCount: 'desc' },
      take: limit,
    });

    return pools.map((p) => ({
      pool: p.pool,
      dex: p.dex,
      attacks: p.attackCount,
      volumeLost: `$${p.totalLossUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      trend: '→',
    }));
  }

  async getEpochs(limit: number) {
    const recentAttacks = await this.prisma.mevAttack.findMany({
      orderBy: { slot: 'desc' },
      take: 1000,
      select: { slot: true, type: true, extractedUsd: true },
    });

    if (recentAttacks.length === 0) return [];

    const epochSize = 432_000n; // BigInt for slot comparison
    const epochMap = new Map<number, { extracted: number; sandwich: number; backrun: number }>();

    for (const a of recentAttacks) {
      const epoch = Number(a.slot / epochSize);
      const entry = epochMap.get(epoch) ?? { extracted: 0, sandwich: 0, backrun: 0 };
      entry.extracted += a.extractedUsd ?? 0;
      if (a.type === 'sandwich' || a.type === 'wide_sandwich') {
        entry.sandwich++;
      } else if (a.type === 'backrun') {
        entry.backrun++;
      }
      epochMap.set(epoch, entry);
    }

    return Array.from(epochMap.entries())
      .sort(([a], [b]) => b - a)
      .slice(0, limit)
      .map(([epoch, data]) => ({
        epoch,
        extracted: `$${data.extracted.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
        sandwich: data.sandwich,
        frontrun: 0,
        backrun: data.backrun,
        dominantClient: 'unknown',
      }));
  }
}
