import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type PoolLeaderboardRange = '1h' | '24h' | '7d' | 'all';

const WINDOW_MS: Record<Exclude<PoolLeaderboardRange, 'all'>, number> = {
  '1h': 3_600_000,
  '24h': 86_400_000,
  '7d': 604_800_000,
};

const HOT_TREND_MS = 3_600_000;

const fmtUsd = (n: number) =>
  `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

@Injectable()
export class PoolsService {
  constructor(private readonly prisma: PrismaService) {}

  async getLeaderboard(
    limit: number,
    range: PoolLeaderboardRange = '24h',
    leader?: string,
  ) {
    // Fast path: global all-time leaderboard uses the pre-aggregated PoolStats.
    // Any validator-scoped or time-windowed query must aggregate from MevAttack.
    if (range === 'all' && !leader) {
      const pools = await this.prisma.poolStats.findMany({
        orderBy: { attackCount: 'desc' },
        take: limit,
      });

      return pools.map((p) => ({
        pool: p.pool,
        dex: p.dex,
        attacks: p.attackCount,
        volumeLost: fmtUsd(p.totalLossUsd),
        trend:
          p.lastAttackAt && Date.now() - p.lastAttackAt.getTime() < HOT_TREND_MS
            ? '↑'
            : '→',
      }));
    }

    const where: Prisma.MevAttackWhereInput = {};
    if (range !== 'all') {
      where.timestampMs = { gte: BigInt(Date.now() - WINDOW_MS[range]) };
    }
    if (leader) {
      where.leaderIdentity = leader;
    }

    const grouped = await this.prisma.mevAttack.groupBy({
      by: ['pool', 'dex'],
      where,
      _count: true,
      _sum: { extractedUsd: true },
      _max: { timestampMs: true },
      orderBy: { _count: { pool: 'desc' } },
      take: limit,
    });

    const now = Date.now();
    return grouped.map((g) => {
      const lastMs = g._max.timestampMs;
      const isHot = lastMs != null && now - Number(lastMs) < HOT_TREND_MS;
      return {
        pool: g.pool,
        dex: g.dex,
        attacks: g._count,
        volumeLost: fmtUsd(g._sum.extractedUsd ?? 0),
        trend: isHot ? '↑' : '→',
      };
    });
  }
}
