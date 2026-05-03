import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransformService } from '../detector/transform.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transform: TransformService,
  ) {}

  async getStats() {
    const now = Date.now();
    const h24ago = BigInt(now - 24 * 3600_000);
    const h48ago = BigInt(now - 48 * 3600_000);

    const [current, previous, topAttacker] = await Promise.all([
      this.prisma.mevAttack.aggregate({
        where: { timestampMs: { gte: h24ago } },
        _sum: { extractedUsd: true, extractedSol: true },
        _count: true,
        _avg: { extractedUsd: true },
      }),
      this.prisma.mevAttack.aggregate({
        where: { timestampMs: { gte: h48ago, lt: h24ago } },
        _sum: { extractedUsd: true },
        _count: true,
        _avg: { extractedUsd: true },
      }),
      this.prisma.mevAttack.groupBy({
        by: ['attacker'],
        where: { timestampMs: { gte: h24ago } },
        _count: true,
        orderBy: { _count: { attacker: 'desc' } },
        take: 1,
      }),
    ]);

    const currentUsd = current._sum.extractedUsd ?? 0;
    const previousUsd = previous._sum.extractedUsd ?? 0;
    const currentCount = current._count;
    const previousCount = previous._count;

    const pctChange = (cur: number, prev: number) =>
      prev === 0 ? null : Math.round(((cur - prev) / prev) * 1000) / 10;

    const distinctAttackers = await this.prisma.mevAttack.groupBy({
      by: ['attacker'],
      where: { timestampMs: { gte: h24ago } },
    });

    return {
      totalMevExtracted24h: {
        usd: currentUsd,
        sol: current._sum.extractedSol ?? 0,
        changePercent: pctChange(currentUsd, previousUsd),
      },
      totalAttacks24h: {
        count: currentCount,
        changePercent: pctChange(currentCount, previousCount),
      },
      averageLossPerTx: {
        usd: current._avg.extractedUsd ?? 0,
        changePercent: pctChange(
          current._avg.extractedUsd ?? 0,
          previous._avg.extractedUsd ?? 0,
        ),
      },
      activeAttackers24h: {
        count: distinctAttackers.length,
        topAttacker: topAttacker[0]?.attacker ?? '',
      },
    };
  }

  async getTimeSeries(range: string) {
    const now = Date.now();
    let sinceMs: number;
    let intervalMs: number;

    switch (range) {
      case '1h':
        sinceMs = now - 3600_000;
        intervalMs = 5 * 60_000;
        break;
      case '7d':
        sinceMs = now - 7 * 24 * 3600_000;
        intervalMs = 4 * 3600_000;
        break;
      default:
        sinceMs = now - 24 * 3600_000;
        intervalMs = 3600_000;
        break;
    }

    const attacks = await this.prisma.mevAttack.findMany({
      where: { timestampMs: { gte: BigInt(sinceMs) } },
      select: { timestampMs: true, extractedUsd: true, type: true },
      orderBy: { timestampMs: 'asc' },
    });

    // Create time buckets
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

    for (const a of attacks) {
      const ts = Number(a.timestampMs ?? 0);
      const bucketKey = sinceMs + Math.floor((ts - sinceMs) / intervalMs) * intervalMs;
      const bucket = buckets.get(bucketKey);
      if (!bucket) continue;

      const usd = a.extractedUsd ?? 0;
      bucket.totalUsd += usd;
      bucket.attackCount++;

      const feType = this.transform.toFrontendType(a.type);
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
}
