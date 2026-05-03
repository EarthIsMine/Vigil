import { Module } from '@nestjs/common';
import { AttacksController } from './attacks.controller';
import { AttacksService } from './attacks.service';
import { DetectorModule } from '../detector/detector.module';

@Module({
  imports: [DetectorModule],
  controllers: [AttacksController],
  providers: [AttacksService],
})
export class AttacksModule {}
