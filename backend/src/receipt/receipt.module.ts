import { Module } from '@nestjs/common';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { DetectorModule } from '../detector/detector.module';

@Module({
  imports: [DetectorModule],
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptModule {}
