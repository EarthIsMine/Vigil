import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('timeseries')
  async getTimeSeries(@Query('range') range?: string) {
    return this.service.getTimeSeries(range || '7d');
  }

  @Get('protocols')
  async getProtocols(@Query('limit') limit?: string) {
    return this.service.getProtocols(Number(limit) || 6);
  }

  @Get('epochs')
  async getEpochs(@Query('limit') limit?: string) {
    return this.service.getEpochs(Number(limit) || 5);
  }
}
