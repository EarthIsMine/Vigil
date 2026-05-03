import { Controller, Get, Query } from '@nestjs/common';
import { PoolsService } from './pools.service';

@Controller('pools')
export class PoolsController {
  constructor(private readonly service: PoolsService) {}

  @Get('leaderboard')
  async getLeaderboard(@Query('limit') limit?: string) {
    return this.service.getLeaderboard(Number(limit) || 10);
  }
}
