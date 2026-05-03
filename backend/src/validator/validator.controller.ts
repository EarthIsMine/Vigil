import { Controller, Get, Param, Query } from '@nestjs/common';
import { ValidatorService } from './validator.service';

@Controller('validators')
export class ValidatorController {
  constructor(private readonly service: ValidatorService) {}

  @Get('leaderboard')
  async getLeaderboard(@Query('limit') limit?: string) {
    return this.service.getLeaderboard(Number(limit) || 10);
  }

  @Get(':identity')
  async getDetail(@Param('identity') identity: string) {
    return this.service.getDetail(identity);
  }
}
