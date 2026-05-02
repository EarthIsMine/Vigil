import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { DetectorModule } from './detector/detector.module';
import { PriceModule } from './price/price.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AttacksModule } from './attacks/attacks.module';
import { ReceiptModule } from './receipt/receipt.module';
import { ValidatorModule } from './validator/validator.module';
import { PoolsModule } from './pools/pools.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { EventsModule } from './gateway/events.module';

@Module({
  imports: [
    PrismaModule,
    PriceModule,
    DetectorModule,
    DashboardModule,
    AttacksModule,
    ReceiptModule,
    ValidatorModule,
    PoolsModule,
    AnalyticsModule,
    EventsModule,
  ],
})
export class AppModule {}
