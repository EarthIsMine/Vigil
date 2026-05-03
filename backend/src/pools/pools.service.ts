import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PoolsService {
  constructor(private readonly prisma: PrismaService) {}

  async getLeaderboard(limit: number) {
    const pools = await this.prisma.poolStats.findMany({
      orderBy: { attackCount: 'desc' },
      take: limit,
    });

    return pools.map((p) => ({
      pool: p.pool,
      dex: p.dex,
      attacks: p.attackCount,
      volumeLost: `$${p.totalLossUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      trend: p.lastAttackAt
        ? (Date.now() - p.lastAttackAt.getTime() < 3600_000 ? '↑' : '→')
        : '→',
    }));
  }
}
