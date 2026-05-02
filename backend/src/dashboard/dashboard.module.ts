import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DetectorModule } from '../detector/detector.module';

@Module({
  imports: [DetectorModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
