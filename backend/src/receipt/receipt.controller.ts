import { Controller, Get, Query } from '@nestjs/common';
import { ReceiptService } from './receipt.service';

@Controller('receipts')
export class ReceiptController {
  constructor(private readonly service: ReceiptService) {}

  @Get('search')
  async search(
    @Query('wallet') wallet: string,
    @Query('range') range?: string,
  ) {
    if (!wallet) return { totalTxScanned: 0, totalAttacked: 0, totalLossUsd: 0, totalLossSol: 0, avgLossPerTx: 0, worstAttack: null, receipts: [] };
    return this.service.search(wallet, range || '30d');
  }
}
