import { Module } from '@nestjs/common';
import { ValidatorController } from './validator.controller';
import { ValidatorService } from './validator.service';
import { ValidatorMetaService } from './validator-meta.service';

@Module({
  controllers: [ValidatorController],
  providers: [ValidatorService, ValidatorMetaService],
})
export class ValidatorModule {}
