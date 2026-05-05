import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SandwichAttack, AttackType } from './detector.types';

/** Frontend MevAttack shape (matches frontend/src/lib/types.ts) */
export interface FrontendMevAttack {
  signature: string;
  type: string;
  timestamp: number;
  slot: number;
  extractedUsd: number | null;
  extractedSol: number | null;
  victim: {
    signer: string;
    amountIn: number;
    amountOut: number;
    expectedAmountOut: number;
  };
  attacker: string;
  dex: string;
  pool: string;
  severity: string;
}

export interface TransformResult {
  dbAttack: Prisma.MevAttackCreateInput;
  dbSandwichDetail: Prisma.SandwichDetailCreateManyInput | null;
  dbReceipts: Prisma.MevReceiptCreateManyInput[];
  frontendPayload: FrontendMevAttack;
}

@Injectable()
export class TransformService {
  transform(attack: SandwichAttack, solPrice: number | null): TransformResult {
    const signature = attack.attack_signature ?? attack.victim.signature;
    const timestampMs = attack.timestamp_ms ?? Date.now();
    const attackType = attack.attack_type ?? 'sandwich';
    const severity = attack.severity ?? null;
    // Phoenix CLOB and other un-enriched DEXes emit null victim_loss_lamports
    // per detector v1.0.0 CHANGELOG "Deferred" section — CLOB sandwich pattern
    // (limit-order placement) does not match the frontrun/victim/backrun model.
    // Preserve null end-to-end so stats aren't polluted with synthetic zeros.
    // solPrice is null when CoinGecko hasn't returned yet — do not synthesize USD.
    const lossLamports = attack.victim_loss_lamports;
    const extractedSol = lossLamports != null ? lossLamports / 1e9 : null;
    const extractedUsd =
      extractedSol != null && solPrice != null ? extractedSol * solPrice : null;
    const expectedAmountOut = this.getExpectedAmountOut(attack);

    const dbAttack: Prisma.MevAttackCreateInput = {
      signature,
      type: attackType,
      slot: BigInt(attack.slot),
      timestampMs: timestampMs ? BigInt(Math.round(timestampMs)) : null,
      severity,
      attacker: attack.attacker,
      dex: attack.dex,
      pool: attack.pool,
      leaderIdentity: attack.slot_leader ?? null,
      victimSigner: attack.victim.signer,
      victimAmountIn: attack.victim.amount_in,
      victimAmountOut: attack.victim.amount_out,
      victimExpectedAmountOut: expectedAmountOut,
      victimLossLamports: attack.victim_loss_lamports ?? null,
      victimLossLamportsLower: attack.victim_loss_lamports_lower ?? null,
      victimLossLamportsUpper: attack.victim_loss_lamports_upper ?? null,
      attackerProfit: attack.attacker_profit ?? null,
      priceImpactBps: attack.price_impact_bps ?? null,
      bundleProvenance: attack.bundle_provenance ?? null,
      confidence: attack.confidence ?? null,
      confidenceLevel: attack.confidence_level ?? null,
      detectionMethod: attack.detection_method as any ?? undefined,
      evidence: attack.evidence ?? undefined,
      ammReplay: attack.amm_replay as any ?? undefined,
      whirlpoolReplay: attack.whirlpool_replay as any ?? undefined,
      dlmmReplay: attack.dlmm_replay as any ?? undefined,
      extractedSol,
      extractedUsd,
    };

    // SandwichDetail (separate table per §4)
    const dbSandwichDetail: Prisma.SandwichDetailCreateManyInput | null =
      attackType !== 'backrun'
        ? {
            attackSignature: signature,
            frontrunTx: attack.frontrun.signature,
            backrunTx: attack.backrun.signature,
            attackerProfit: attack.attacker_profit ?? null,
            frontrunSlot: attack.frontrun_slot ? BigInt(attack.frontrun_slot) : null,
            backrunSlot: attack.backrun_slot ? BigInt(attack.backrun_slot) : null,
            isWideSandwich: attack.is_wide_sandwich,
          }
        : null;

    // Receipts
    const dbReceipts: Prisma.MevReceiptCreateManyInput[] = (attack.receipts ?? []).map((r) => ({
      victimTxSignature: r.victim_tx_signature,
      attackSignature: signature,
      timestampMs: r.timestamp_ms ? BigInt(Math.round(r.timestamp_ms)) : null,
      victimWallet: r.victim_wallet,
      victimAction: r.victim_action,
      victimDex: r.victim_dex,
      tokenInMint: r.token_in_mint ?? null,
      tokenOutMint: r.token_out_mint ?? null,
      amountIn: r.amount_in,
      expectedAmountOut: r.expected_amount_out ?? null,
      actualAmountOut: r.actual_amount_out,
      slippage: r.slippage ?? null,
      mevDetected: r.mev_detected,
      mevType: r.mev_type,
      severity: r.severity,
      lossAmount: r.loss_amount ?? null,
      lossAmountLower: r.loss_amount_lower ?? null,
      lossAmountUpper: r.loss_amount_upper ?? null,
      lossPercent: r.loss_percent ?? null,
      lossConfidence: r.loss_confidence,
      validatorIdentity: r.validator_identity ?? null,
    }));

    const frontendPayload: FrontendMevAttack = {
      signature,
      type: this.toFrontendType(attackType),
      timestamp: timestampMs,
      slot: attack.slot,
      extractedUsd,
      extractedSol,
      victim: {
        signer: attack.victim.signer,
        amountIn: attack.victim.amount_in,
        amountOut: attack.victim.amount_out,
        expectedAmountOut,
      },
      attacker: attack.attacker,
      dex: attack.dex,
      pool: attack.pool,
      severity: severity ?? 'low',
    };

    return { dbAttack, dbSandwichDetail, dbReceipts, frontendPayload };
  }

  /** Map DB attack_type to frontend MevType enum string */
  toFrontendType(dbType: string): string {
    switch (dbType) {
      case 'sandwich':
        return 'sandwich_single';
      case 'wide_sandwich':
        return 'sandwich_wide';
      case 'authority_hop':
        return 'sandwich_auth_hop';
      case 'backrun':
        return 'backrun';
      default:
        return 'sandwich_single';
    }
  }

  private getExpectedAmountOut(attack: SandwichAttack): number {
    if (attack.victim_amount_out_expected != null) {
      return attack.victim_amount_out_expected;
    }
    if (attack.amm_replay?.counterfactual_victim_out != null) {
      return attack.amm_replay.counterfactual_victim_out;
    }
    if (attack.whirlpool_replay?.counterfactual_victim_out != null) {
      return attack.whirlpool_replay.counterfactual_victim_out;
    }
    if (attack.dlmm_replay?.counterfactual_victim_out != null) {
      return attack.dlmm_replay.counterfactual_victim_out;
    }
    return attack.victim.amount_out;
  }
}
