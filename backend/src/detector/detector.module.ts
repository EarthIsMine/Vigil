import { Module } from '@nestjs/common';
import { DetectorService } from './detector.service';
import { TransformService } from './transform.service';
import { EventsModule } from '../gateway/events.module';

@Module({
  imports: [EventsModule],
  providers: [DetectorService, TransformService],
  exports: [TransformService],
})
export class DetectorModule {}
