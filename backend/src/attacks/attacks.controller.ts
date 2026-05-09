import { Controller, Get, Query } from '@nestjs/common';
import { AttacksService } from './attacks.service';

@Controller('attacks')
export class AttacksController {
  constructor(private readonly service: AttacksService) {}

  @Get('recent')
  async getRecent(
    @Query('limit') limit?: string,
    @Query('leader') leader?: string,
  ) {
    return this.service.getRecent(Number(limit) || 20, leader || undefined);
  }
}
