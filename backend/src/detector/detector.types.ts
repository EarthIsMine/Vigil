/**
 * TypeScript types matching sandwich-detector's JSON output.
 * Based on solana-sandwich-detector/contrib/vigil-types.ts.
 * Schema version: vigil-v1.
 *
 * Updated per DETECTOR_INTEGRATION.md §1: heartbeat uses per-DexType bucket.
 */

// ---------------------------------------------------------------------------
// Framing
// ---------------------------------------------------------------------------

export interface JsonlHeader {
  _header: true;
  schema_version: 'vigil-v1';
  tool_version: string;
  started_at_ms: number;
}

export interface JsonlHeartbeat {
  _heartbeat: number;
  metrics: EnrichmentMetrics;
}

/** Per-counter bucket (6 counters per DEX) */
export interface EnrichmentMetricsBucket {
  enriched: number;
  unsupported_dex: number;
  config_unavailable: number;
  reserves_missing: number;
  replay_failed: number;
  cross_boundary_unsupported: number;
}

/** New shape: per-DexType bucket (PR #28) */
export type EnrichmentMetrics = Record<DexType, EnrichmentMetricsBucket>;

export type DetectorLine = JsonlHeader | JsonlHeartbeat | SandwichAttack;

/** Discriminator helper. */
export function parseDetectorLine(raw: string): DetectorLine {
  const obj = JSON.parse(raw);
  if (obj && obj._header === true) return obj as JsonlHeader;
  if (obj && typeof obj._heartbeat === 'number') return obj as JsonlHeartbeat;
  return obj as SandwichAttack;
}

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type DexType =
  | 'raydium_v4'
  | 'raydium_clmm'
  | 'raydium_cpmm'
  | 'orca_whirlpool'
  | 'jupiter_v6'
  | 'meteora_dlmm'
  | 'pump_fun'
  | 'phoenix';

export type SwapDirection = 'buy' | 'sell';
export type AttackType = 'sandwich' | 'wide_sandwich' | 'backrun' | 'authority_hop';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type BundleProvenance = 'atomic_bundle' | 'spanning_bundle' | 'tip_race' | 'organic';

/**
 * DetectionMethod — serde quirk (§13):
 * Unit variant `SameBlock` → string "same_block"
 * Tagged variants → objects
 * Discriminate: typeof dm === 'string' ? dm === 'same_block' : 'cross_slot_window' in dm
 */
export type DetectionMethod =
  | 'same_block'
  | { cross_slot_window: { window_size: number } }
  | { jito_bundle_confirmed: { bundle_id: string } };

// ---------------------------------------------------------------------------
// Swap event
// ---------------------------------------------------------------------------

export interface SwapEvent {
  signature: string;
  signer: string;
  dex: DexType;
  pool: string;
  direction: SwapDirection;
  token_mint: string;
  amount_in: number;
  amount_out: number;
  tx_index: number;
  slot?: number | null;
  fee?: number | null;
}

// ---------------------------------------------------------------------------
// AMM replay traces (stored as jsonb)
// ---------------------------------------------------------------------------

export interface AmmReplayTrace {
  reserves_pre: [number, number];
  reserves_post_front: [number, number];
  reserves_post_victim: [number, number];
  reserves_post_back: [number, number];
  spot_price_pre: number;
  spot_price_post_front: number;
  counterfactual_victim_out: number;
  actual_victim_out: number;
  fee_num: number;
  fee_den: number;
}

export interface WhirlpoolReplayTrace {
  sqrt_price_pre: string; // u128 base-10 → BigInt()
  sqrt_price_post_front: string;
  sqrt_price_post_victim: string;
  sqrt_price_post_back: string;
  liquidity_pre: string;
  liquidity_post_front: string;
  liquidity_post_victim: string;
  liquidity_post_back: string;
  tick_current_pre: number;
  tick_current_post_front: number;
  tick_current_post_victim: number;
  tick_current_post_back: number;
  counterfactual_victim_out: number;
  actual_victim_out: number;
  fee_num: number;
  fee_den: number;
}

export interface MeteoraDlmmReplayTrace {
  active_id_pre: number;
  active_id_post_front: number;
  active_id_post_victim: number;
  active_id_post_back: number;
  bin_price_pre: string; // u128 base-10
  counterfactual_victim_out: number;
  actual_victim_out: number;
  bin_step: number;
  fee_num: number;
  fee_den: number;
  volatility_accumulator_pre: number;
  volatility_accumulator_post_front: number;
  variable_fee_rate_pre: number;
  variable_fee_rate_post_front: number;
  token_x_transfer_fee_bps: number | null;
  token_y_transfer_fee_bps: number | null;
}

// ---------------------------------------------------------------------------
// Per-victim receipt
// ---------------------------------------------------------------------------

export interface MevReceipt {
  victim_tx_signature: string;
  attack_signature: string;
  timestamp_ms?: number | null;
  victim_wallet: string;
  victim_action: SwapDirection;
  victim_dex: DexType;
  token_in_mint?: string | null;
  token_out_mint?: string | null;
  amount_in: number;
  expected_amount_out?: number | null;
  actual_amount_out: number;
  slippage?: number | null;
  mev_detected: boolean;
  mev_type: AttackType;
  severity: Severity;
  loss_amount?: number | null;
  loss_amount_lower?: number | null;
  loss_amount_upper?: number | null;
  loss_percent?: number | null;
  loss_confidence: ConfidenceLevel;
  validator_identity?: string | null;
}

// ---------------------------------------------------------------------------
// Top-level detection — SandwichAttack
// ---------------------------------------------------------------------------

export interface SandwichAttack {
  slot: number;
  attacker: string;
  frontrun: SwapEvent;
  victim: SwapEvent;
  backrun: SwapEvent;
  pool: string;
  dex: DexType;

  estimated_attacker_profit: number | null;

  // AMM-replay numbers
  victim_loss_lamports?: number | null;
  victim_loss_lamports_lower?: number | null;
  victim_loss_lamports_upper?: number | null;
  attacker_profit?: number | null;
  price_impact_bps?: number | null;

  // Triplet bookkeeping
  frontrun_slot?: number | null;
  backrun_slot?: number | null;
  detection_method?: DetectionMethod | null;
  bundle_provenance?: BundleProvenance | null;
  confidence?: number | null;
  net_profit?: number | null;

  // Structured reasoning + replay traces (store as jsonb)
  evidence?: any | null;
  amm_replay?: AmmReplayTrace | null;
  whirlpool_replay?: WhirlpoolReplayTrace | null;
  dlmm_replay?: MeteoraDlmmReplayTrace | null;

  // Vigil v1 fields (populated by finalize_for_vigil())
  attack_signature?: string | null;
  timestamp_ms?: number | null;
  attack_type?: AttackType | null;
  severity?: Severity | null;
  confidence_level?: ConfidenceLevel | null;
  slot_leader?: string | null;
  is_wide_sandwich: boolean;
  receipts: MevReceipt[];

  // Top-level promotions
  victim_signer?: string | null;
  victim_amount_in?: number | null;
  victim_amount_out?: number | null;
  victim_amount_out_expected?: number | null;
}
