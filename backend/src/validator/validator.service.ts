import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PriceService } from '../price/price.service';

@Injectable()
export class ValidatorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly price: PriceService,
  ) {}

  async getLeaderboard(limit: number) {
    const validators = await this.prisma.validatorStats.findMany({
      orderBy: { totalAttacksInSlots: 'desc' },
      take: limit,
    });

    const solPrice = this.price.getSolUsd();

    return validators.map((v, i) => {
      const extractedSol = Number(v.totalExtractedLamports) / 1e9;
      const riskScore = this.computeRiskScore(v);
      const extractedUsd =
        solPrice != null
          ? `$${(extractedSol * solPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
          : null;

      return {
        rank: i + 1,
        identity: v.identity,
        name: v.name || v.identity.slice(0, 8) + '...',
        client: v.client || 'unknown',
        riskScore,
        riskLevel: this.getRiskLevel(riskScore),
        extractedUsd,
      };
    });
  }

  async getDetail(identity: string) {
    const v = await this.prisma.validatorStats.findUnique({
      where: { identity },
    });

    if (!v) return null;

    const solPrice = this.price.getSolUsd();
    const extractedSol = Number(v.totalExtractedLamports) / 1e9;
    const riskScore = this.computeRiskScore(v);
    const sandwichRate = v.totalSlotsSeen > 0
      ? v.slotsWithSandwich / v.totalSlotsSeen
      : 0;
    const wideRate = v.totalSlotsSeen > 0
      ? v.slotsWithWideSandwich / v.totalSlotsSeen
      : 0;

    return {
      identity: v.identity,
      name: v.name || v.identity.slice(0, 8) + '...',
      voteAccount: v.voteAccount || '',
      client: v.client || 'unknown',
      stake: (Number(v.stake) / 1e9).toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' SOL',
      commission: v.commission,
      activeSinceEpoch: v.activeSinceEpoch,
      metricsRaw: {
        sandwichInvolvementRate: sandwichRate,
        wideSandwichRate: wideRate,
        consecutiveLeaderAbuse: 0,
        totalExtractedSol: extractedSol,
        avgExtractionPerSlot: v.totalSlotsSeen > 0 ? extractedSol / v.totalSlotsSeen : 0,
        recentTrend: 'stable' as const,
        observedSlots: v.totalSlotsSeen,
      },
      metricsNormalized: null,
      riskScore,
      riskLevel: this.getRiskLevel(riskScore),
      lastUpdated: v.lastUpdated.getTime(),
    };
  }

  private computeRiskScore(v: any): number {
    if (v.totalSlotsSeen < 100) return 0;
    const sandwichRate = v.slotsWithSandwich / v.totalSlotsSeen;
    const wideRate = v.slotsWithWideSandwich / v.totalSlotsSeen;
    const extractedSol = Number(v.totalExtractedLamports) / 1e9;

    // Simplified scoring (0-100)
    const score =
      sandwichRate * 30 * 100 +
      wideRate * 40 * 100 +
      Math.min(Math.log10(extractedSol + 1) * 10, 30);

    return Math.min(Math.round(score), 100);
  }

  private getRiskLevel(score: number): string {
    if (score >= 75) return 'critical';
    if (score >= 50) return 'high';
    if (score >= 25) return 'medium';
    if (score > 0) return 'low';
    return 'unrated';
  }
}
