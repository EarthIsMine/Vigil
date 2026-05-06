import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransformService } from '../detector/transform.service';

@Injectable()
export class AttacksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transform: TransformService,
  ) {}

  async getRecent(limit: number) {
    const attacks = await this.prisma.mevAttack.findMany({
      orderBy: { timestampMs: 'desc' },
      take: limit,
    });

    return attacks.map((a) => ({
      signature: a.signature,
      type: this.transform.toFrontendType(a.type),
      timestamp: Number(a.timestampMs ?? 0),
      slot: Number(a.slot),
      extractedUsd: a.extractedUsd,
      extractedSol: a.extractedSol,
      victim: {
        signer: a.victimSigner,
        amountIn: a.victimAmountIn,
        amountOut: a.victimAmountOut,
        expectedAmountOut: a.victimExpectedAmountOut ?? a.victimAmountOut,
      },
      attacker: a.attacker,
      dex: a.dex,
      pool: a.pool,
      severity: a.severity ?? 'low',
      confidenceLevel: this.transform.normalizeConfidenceLevel(a.confidenceLevel),
      detectionMethod: this.transform.normalizeDetectionMethod(a.detectionMethod),
      bundleProvenance: this.transform.normalizeBundleProvenance(a.bundleProvenance),
      lossSource: this.transform.determineLossSource({
        ammReplay: a.ammReplay,
        whirlpoolReplay: a.whirlpoolReplay,
        dlmmReplay: a.dlmmReplay,
        victimLossLamports: a.victimLossLamports,
      }),
    }));
  }
}
