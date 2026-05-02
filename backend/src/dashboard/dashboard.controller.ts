import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('stats')
  async getStats() {
    return this.service.getStats();
  }

  @Get('timeseries')
  async getTimeSeries(@Query('range') range?: string) {
    return this.service.getTimeSeries(range || '24h');
  }
}
