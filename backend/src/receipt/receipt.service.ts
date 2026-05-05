import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PriceService } from '../price/price.service';

@Injectable()
export class ReceiptService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly price: PriceService,
  ) {}

  async search(wallet: string, range: string) {
    const now = Date.now();
    let sinceMs: number;
    switch (range) {
      case '24h':
        sinceMs = now - 24 * 3600_000;
        break;
      case '7d':
        sinceMs = now - 7 * 24 * 3600_000;
        break;
      case 'all':
        sinceMs = 0;
        break;
      default: // '30d'
        sinceMs = now - 30 * 24 * 3600_000;
        break;
    }

    const receipts = await this.prisma.mevReceipt.findMany({
      where: {
        victimWallet: wallet,
        ...(range !== 'all' ? { timestampMs: { gte: BigInt(sinceMs) } } : {}),
      },
      include: { attack: { include: { sandwichDetail: true } } },
      orderBy: { timestampMs: 'desc' },
    });

    const solPrice = this.price.getSolUsd();
    const totalLossLamports = receipts.reduce(
      (sum, r) => sum + (r.lossAmount ?? 0),
      0,
    );
    const totalLossSol = totalLossLamports / 1e9;
    const totalLossUsd = solPrice != null ? totalLossSol * solPrice : null;

    const formattedReceipts = receipts.map((r) => this.formatReceipt(r, solPrice));

    // Rank by SOL loss when USD isn't available — same ordering since rate is uniform.
    const worstReceipt = formattedReceipts.length > 0
      ? formattedReceipts.reduce((worst, curr) =>
          curr.mevAnalysis.loss.lossAmount > worst.mevAnalysis.loss.lossAmount ? curr : worst,
        )
      : null;

    return {
      totalTxScanned: receipts.length,
      totalAttacked: receipts.filter((r) => r.mevDetected).length,
      totalLossUsd,
      totalLossSol,
      avgLossPerTx:
        receipts.length > 0 && totalLossUsd != null ? totalLossUsd / receipts.length : null,
      worstAttack: worstReceipt ?? formattedReceipts[0] ?? null,
      receipts: formattedReceipts,
    };
  }

  private formatReceipt(r: any, solPrice: number | null) {
    const lossLamports = r.lossAmount ?? 0;
    const lossSol = lossLamports / 1e9;
    const lossUsd = solPrice != null ? lossSol * solPrice : null;
    const expectedOut = r.expectedAmountOut ?? r.actualAmountOut;
    const lossPercent = expectedOut > 0
      ? ((expectedOut - r.actualAmountOut) / expectedOut) * 100
      : 0;

    const detail = r.attack?.sandwichDetail;

    return {
      receiptId: r.victimTxSignature,
      txSignature: r.victimTxSignature,
      timestamp: Number(r.timestampMs ?? 0),
      victim: {
        wallet: r.victimWallet,
        action: 'swap',
        dex: r.victimDex,
        tokenIn: { mint: r.tokenInMint ?? '', symbol: '', decimals: 0 },
        tokenOut: { mint: r.tokenOutMint ?? '', symbol: '', decimals: 0 },
        amountIn: r.amountIn,
        expectedAmountOut: expectedOut,
        actualAmountOut: r.actualAmountOut,
        slippage: r.slippage ?? 0,
      },
      mevAnalysis: {
        detected: r.mevDetected,
        type: this.mapMevType(r.mevType),
        severity: r.severity,
        loss: {
          expectedAmountOut: expectedOut,
          actualAmountOut: r.actualAmountOut,
          lossAmount: lossSol,
          lossUsd,
          lossPercent,
          confidence: r.lossConfidence === 'high' ? 'exact' : 'estimated',
        },
      },
      validator: {
        identity: r.validatorIdentity ?? '',
        name: '',
        riskLevel: 'unrated',
        riskScore: 0,
      },
      protection: {
        toolUsed: null,
        wasProtected: false,
        protectionFailed: false,
      },
      shareUrl: '',
      shareImageUrl: '',
      attackDetail: {
        kind: 'sandwich',
        attackerAddress: r.attack?.attacker ?? '',
        frontrunTx: detail?.frontrunTx ?? '',
        backrunTx: detail?.backrunTx ?? '',
        attackerProfit: (r.attack?.attackerProfit ?? 0) / 1e9,
        attackerProfitUsd:
          solPrice != null ? ((r.attack?.attackerProfit ?? 0) / 1e9) * solPrice : null,
        pool: r.attack?.pool ?? '',
        frontrunSlot: Number(detail?.frontrunSlot ?? r.attack?.slot ?? 0n),
        backrunSlot: Number(detail?.backrunSlot ?? r.attack?.slot ?? 0n),
        isWideSandwich: detail?.isWideSandwich ?? false,
      },
    };
  }

  private mapMevType(type: string): string {
    switch (type) {
      case 'sandwich': return 'sandwich_single';
      case 'wide_sandwich': return 'sandwich_wide';
      case 'authority_hop': return 'sandwich_auth_hop';
      case 'backrun': return 'backrun';
      default: return 'sandwich_single';
    }
  }
}
