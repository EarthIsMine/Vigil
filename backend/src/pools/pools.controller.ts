import { Controller, Get, Query } from '@nestjs/common';
import { PoolsService, type PoolLeaderboardRange } from './pools.service';

const ALLOWED_RANGES: readonly PoolLeaderboardRange[] = ['1h', '24h', '7d', 'all'];

@Controller('pools')
export class PoolsController {
  constructor(private readonly service: PoolsService) {}

  @Get('leaderboard')
  async getLeaderboard(
    @Query('limit') limit?: string,
    @Query('range') range?: string,
    @Query('leader') leader?: string,
  ) {
    const r: PoolLeaderboardRange =
      range && (ALLOWED_RANGES as readonly string[]).includes(range)
        ? (range as PoolLeaderboardRange)
        : '24h';
    return this.service.getLeaderboard(
      Number(limit) || 10,
      r,
      leader || undefined,
    );
  }
}
