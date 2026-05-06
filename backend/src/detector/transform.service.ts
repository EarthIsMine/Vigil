import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SandwichAttack, AttackType } from './detector.types';

export type FeConfidenceLevel = 'low' | 'medium' | 'high';
export type FeDetectionMethod = 'header' | 'cross_slot_window' | 'jito_bundle';
export type FeBundleProvenance = 'atomic' | 'spanning' | 'tip_race' | 'organic';
export type FeLossSource =
  | 'amm_replay'
  | 'whirlpool_replay'
  | 'dlmm_replay'
  | 'pool_amount_out'
  | 'unenriched';

export interface FeAmmReplayData {
  reservesPre: [number, number];
  reservesPostFront: [number, number];
  reservesPostVictim: [number, number];
  reservesPostBack: [number, number];
  spotPricePre: number;
  spotPricePostFront: number;
  counterfactualVictimOut: number;
  actualVictimOut: number;
  feeNum: number;
  feeDen: number;
}

export interface FeWhirlpoolReplayData {
  sqrtPricePre: string;
  sqrtPricePostFront: string;
  sqrtPricePostVictim: string;
  sqrtPricePostBack: string;
  liquidityPre: string;
  liquidityPostFront: string;
  liquidityPostVictim: string;
  liquidityPostBack: string;
  tickCurrentPre: number;
  tickCurrentPostFront: number;
  tickCurrentPostVictim: number;
  tickCurrentPostBack: number;
  counterfactualVictimOut: number;
  actualVictimOut: number;
  feeNum: number;
  feeDen: number;
}

export interface FeDlmmReplayData {
  activeIdPre: number;
  activeIdPostFront: number;
  activeIdPostVictim: number;
  activeIdPostBack: number;
  binPricePre: string;
  counterfactualVictimOut: number;
  actualVictimOut: number;
  binStep: number;
  feeNum: number;
  feeDen: number;
  volatilityAccumulatorPre: number;
  volatilityAccumulatorPostFront: number;
  variableFeeRatePre: number;
  variableFeeRatePostFront: number;
  tokenXTransferFeeBps: number | null;
  tokenYTransferFeeBps: number | null;
}

export type FeReplayTrace =
  | { kind: 'amm'; data: FeAmmReplayData }
  | { kind: 'whirlpool'; data: FeWhirlpoolReplayData }
  | { kind: 'dlmm'; data: FeDlmmReplayData };

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
  confidenceLevel: FeConfidenceLevel | null;
  detectionMethod: FeDetectionMethod | null;
  bundleProvenance: FeBundleProvenance | null;
  lossSource: FeLossSource;
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
      confidenceLevel: this.normalizeConfidenceLevel(attack.confidence_level ?? null),
      detectionMethod: this.normalizeDetectionMethod(attack.detection_method ?? null),
      bundleProvenance: this.normalizeBundleProvenance(attack.bundle_provenance ?? null),
      lossSource: this.determineLossSource({
        ammReplay: attack.amm_replay ?? null,
        whirlpoolReplay: attack.whirlpool_replay ?? null,
        dlmmReplay: attack.dlmm_replay ?? null,
        victimLossLamports: attack.victim_loss_lamports ?? null,
      }),
    };

    return { dbAttack, dbSandwichDetail, dbReceipts, frontendPayload };
  }

  normalizeConfidenceLevel(value: unknown): FeConfidenceLevel | null {
    return value === 'low' || value === 'medium' || value === 'high' ? value : null;
  }

  normalizeDetectionMethod(value: unknown): FeDetectionMethod | null {
    if (value == null) return null;
    if (value === 'same_block') return 'header';
    if (typeof value === 'object') {
      if ('cross_slot_window' in (value as object)) return 'cross_slot_window';
      if ('jito_bundle_confirmed' in (value as object)) return 'jito_bundle';
    }
    return null;
  }

  normalizeBundleProvenance(value: unknown): FeBundleProvenance | null {
    switch (value) {
      case 'atomic_bundle':
        return 'atomic';
      case 'spanning_bundle':
        return 'spanning';
      case 'tip_race':
        return 'tip_race';
      case 'organic':
        return 'organic';
      default:
        return null;
    }
  }

  /**
   * Loss source priority — replay traces (precise counterfactual) → pool reserve estimate → unenriched.
   * `unenriched` is the Phoenix CLOB / unsupported-DEX case where loss can't be quantified.
   */
  determineLossSource(input: {
    ammReplay: unknown;
    whirlpoolReplay: unknown;
    dlmmReplay: unknown;
    victimLossLamports: number | null;
  }): FeLossSource {
    if (input.ammReplay) return 'amm_replay';
    if (input.whirlpoolReplay) return 'whirlpool_replay';
    if (input.dlmmReplay) return 'dlmm_replay';
    if (input.victimLossLamports == null) return 'unenriched';
    return 'pool_amount_out';
  }

  /**
   * Build the FE-friendly replay trace from raw detector output.
   * AMM/Whirlpool/DLMM each have different shapes; we pick whichever the
   * detector produced and normalise snake_case → camelCase for the FE.
   * Returns null if no replay was emitted (e.g. CLOB / unenriched).
   */
  buildReplayTrace(input: {
    ammReplay: unknown;
    whirlpoolReplay: unknown;
    dlmmReplay: unknown;
  }): FeReplayTrace | null {
    if (input.ammReplay) {
      const r = input.ammReplay as Record<string, unknown>;
      return {
        kind: 'amm',
        data: {
          reservesPre: r.reserves_pre as [number, number],
          reservesPostFront: r.reserves_post_front as [number, number],
          reservesPostVictim: r.reserves_post_victim as [number, number],
          reservesPostBack: r.reserves_post_back as [number, number],
          spotPricePre: r.spot_price_pre as number,
          spotPricePostFront: r.spot_price_post_front as number,
          counterfactualVictimOut: r.counterfactual_victim_out as number,
          actualVictimOut: r.actual_victim_out as number,
          feeNum: r.fee_num as number,
          feeDen: r.fee_den as number,
        },
      };
    }
    if (input.whirlpoolReplay) {
      const r = input.whirlpoolReplay as Record<string, unknown>;
      return {
        kind: 'whirlpool',
        data: {
          sqrtPricePre: String(r.sqrt_price_pre),
          sqrtPricePostFront: String(r.sqrt_price_post_front),
          sqrtPricePostVictim: String(r.sqrt_price_post_victim),
          sqrtPricePostBack: String(r.sqrt_price_post_back),
          liquidityPre: String(r.liquidity_pre),
          liquidityPostFront: String(r.liquidity_post_front),
          liquidityPostVictim: String(r.liquidity_post_victim),
          liquidityPostBack: String(r.liquidity_post_back),
          tickCurrentPre: r.tick_current_pre as number,
          tickCurrentPostFront: r.tick_current_post_front as number,
          tickCurrentPostVictim: r.tick_current_post_victim as number,
          tickCurrentPostBack: r.tick_current_post_back as number,
          counterfactualVictimOut: r.counterfactual_victim_out as number,
          actualVictimOut: r.actual_victim_out as number,
          feeNum: r.fee_num as number,
          feeDen: r.fee_den as number,
        },
      };
    }
    if (input.dlmmReplay) {
      const r = input.dlmmReplay as Record<string, unknown>;
      return {
        kind: 'dlmm',
        data: {
          activeIdPre: r.active_id_pre as number,
          activeIdPostFront: r.active_id_post_front as number,
          activeIdPostVictim: r.active_id_post_victim as number,
          activeIdPostBack: r.active_id_post_back as number,
          binPricePre: String(r.bin_price_pre),
          counterfactualVictimOut: r.counterfactual_victim_out as number,
          actualVictimOut: r.actual_victim_out as number,
          binStep: r.bin_step as number,
          feeNum: r.fee_num as number,
          feeDen: r.fee_den as number,
          volatilityAccumulatorPre: r.volatility_accumulator_pre as number,
          volatilityAccumulatorPostFront: r.volatility_accumulator_post_front as number,
          variableFeeRatePre: r.variable_fee_rate_pre as number,
          variableFeeRatePostFront: r.variable_fee_rate_post_front as number,
          tokenXTransferFeeBps: (r.token_x_transfer_fee_bps as number | null) ?? null,
          tokenYTransferFeeBps: (r.token_y_transfer_fee_bps as number | null) ?? null,
        },
      };
    }
    return null;
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
