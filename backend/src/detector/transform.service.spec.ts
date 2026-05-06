import { TransformService } from './transform.service';
import { SandwichAttack, SwapEvent } from './detector.types';

function buildSwap(overrides: Partial<SwapEvent> = {}): SwapEvent {
  return {
    signature: 'sig-default',
    signer: 'signer-default',
    dex: 'raydium_v4',
    pool: 'pool-default',
    direction: 'buy',
    token_mint: 'mint-default',
    amount_in: 1_000_000,
    amount_out: 990_000,
    tx_index: 0,
    ...overrides,
  };
}

function buildAttack(overrides: Partial<SandwichAttack> = {}): SandwichAttack {
  return {
    slot: 100,
    attacker: 'attacker-default',
    frontrun: buildSwap({ signature: 'frontrun-sig' }),
    victim: buildSwap({ signature: 'victim-sig', signer: 'victim-signer' }),
    backrun: buildSwap({ signature: 'backrun-sig' }),
    pool: 'pool-default',
    dex: 'raydium_v4',
    estimated_attacker_profit: null,
    is_wide_sandwich: false,
    receipts: [],
    ...overrides,
  };
}

describe('TransformService', () => {
  let service: TransformService;

  beforeEach(() => {
    service = new TransformService();
  });

  describe('victim_loss_lamports null preservation', () => {
    it('happy path: numeric loss is converted to extractedSol/extractedUsd', () => {
      const attack = buildAttack({
        victim_loss_lamports: 1_000_000_000,
      });

      const result = service.transform(attack, 100);

      expect(result.dbAttack.extractedSol).toBe(1);
      expect(result.dbAttack.extractedUsd).toBe(100);
      expect(result.dbAttack.victimLossLamports).toBe(1_000_000_000);
      expect(result.frontendPayload.extractedSol).toBe(1);
      expect(result.frontendPayload.extractedUsd).toBe(100);
    });

    it('null loss is preserved end-to-end (Phoenix CLOB / un-enriched DEX)', () => {
      const attack = buildAttack({
        victim_loss_lamports: null,
      });

      const result = service.transform(attack, 100);

      expect(result.dbAttack.victimLossLamports).toBeNull();
      expect(result.dbAttack.extractedSol).toBeNull();
      expect(result.dbAttack.extractedUsd).toBeNull();
      expect(result.frontendPayload.extractedSol).toBeNull();
      expect(result.frontendPayload.extractedUsd).toBeNull();
    });

    it('undefined loss (field omitted) is treated as null', () => {
      const attack = buildAttack();
      delete attack.victim_loss_lamports;

      const result = service.transform(attack, 100);

      expect(result.dbAttack.victimLossLamports).toBeNull();
      expect(result.dbAttack.extractedSol).toBeNull();
      expect(result.dbAttack.extractedUsd).toBeNull();
      expect(result.frontendPayload.extractedSol).toBeNull();
      expect(result.frontendPayload.extractedUsd).toBeNull();
    });

    it('zero loss is a real zero, not coerced from null', () => {
      const attack = buildAttack({
        victim_loss_lamports: 0,
      });

      const result = service.transform(attack, 100);

      expect(result.dbAttack.extractedSol).toBe(0);
      expect(result.dbAttack.extractedUsd).toBe(0);
      expect(result.dbAttack.victimLossLamports).toBe(0);
    });
  });

  describe('normalizeDetectionMethod', () => {
    it('maps same_block string → header', () => {
      expect(service.normalizeDetectionMethod('same_block')).toBe('header');
    });

    it('maps cross_slot_window object → cross_slot_window', () => {
      expect(
        service.normalizeDetectionMethod({ cross_slot_window: { window_size: 4 } }),
      ).toBe('cross_slot_window');
    });

    it('maps jito_bundle_confirmed object → jito_bundle', () => {
      expect(
        service.normalizeDetectionMethod({ jito_bundle_confirmed: { bundle_id: 'b1' } }),
      ).toBe('jito_bundle');
    });

    it('returns null for unknown shapes and null/undefined input', () => {
      expect(service.normalizeDetectionMethod(null)).toBeNull();
      expect(service.normalizeDetectionMethod(undefined)).toBeNull();
      expect(service.normalizeDetectionMethod('mystery')).toBeNull();
      expect(service.normalizeDetectionMethod({ unknown: true })).toBeNull();
    });
  });

  describe('normalizeBundleProvenance', () => {
    it('strips _bundle suffix where present', () => {
      expect(service.normalizeBundleProvenance('atomic_bundle')).toBe('atomic');
      expect(service.normalizeBundleProvenance('spanning_bundle')).toBe('spanning');
    });

    it('passes through tip_race / organic unchanged', () => {
      expect(service.normalizeBundleProvenance('tip_race')).toBe('tip_race');
      expect(service.normalizeBundleProvenance('organic')).toBe('organic');
    });

    it('returns null for unknown / missing values', () => {
      expect(service.normalizeBundleProvenance(null)).toBeNull();
      expect(service.normalizeBundleProvenance('foo')).toBeNull();
    });
  });

  describe('determineLossSource', () => {
    it('prefers amm_replay when present', () => {
      expect(
        service.determineLossSource({
          ammReplay: { x: 1 },
          whirlpoolReplay: { x: 1 },
          dlmmReplay: { x: 1 },
          victimLossLamports: 100,
        }),
      ).toBe('amm_replay');
    });

    it('falls back to whirlpool_replay when amm_replay missing', () => {
      expect(
        service.determineLossSource({
          ammReplay: null,
          whirlpoolReplay: { x: 1 },
          dlmmReplay: { x: 1 },
          victimLossLamports: 100,
        }),
      ).toBe('whirlpool_replay');
    });

    it('falls back to dlmm_replay when amm and whirlpool missing', () => {
      expect(
        service.determineLossSource({
          ammReplay: null,
          whirlpoolReplay: null,
          dlmmReplay: { x: 1 },
          victimLossLamports: 100,
        }),
      ).toBe('dlmm_replay');
    });

    it('returns unenriched when no replay and victim loss is null (Phoenix CLOB)', () => {
      expect(
        service.determineLossSource({
          ammReplay: null,
          whirlpoolReplay: null,
          dlmmReplay: null,
          victimLossLamports: null,
        }),
      ).toBe('unenriched');
    });

    it('returns pool_amount_out when no replay but victim loss is concrete', () => {
      expect(
        service.determineLossSource({
          ammReplay: null,
          whirlpoolReplay: null,
          dlmmReplay: null,
          victimLossLamports: 0,
        }),
      ).toBe('pool_amount_out');
    });
  });

  describe('buildReplayTrace', () => {
    it('returns null when no replay data is provided', () => {
      expect(
        service.buildReplayTrace({
          ammReplay: null,
          whirlpoolReplay: null,
          dlmmReplay: null,
        }),
      ).toBeNull();
    });

    it('builds an amm trace with normalised camelCase keys', () => {
      const trace = service.buildReplayTrace({
        ammReplay: {
          reserves_pre: [1_000_000, 200_000],
          reserves_post_front: [1_010_000, 198_020],
          reserves_post_victim: [1_015_000, 197_040],
          reserves_post_back: [1_005_000, 199_010],
          spot_price_pre: 0.2,
          spot_price_post_front: 0.196,
          counterfactual_victim_out: 102.5,
          actual_victim_out: 98.2,
          fee_num: 30,
          fee_den: 10_000,
        },
        whirlpoolReplay: null,
        dlmmReplay: null,
      });

      expect(trace?.kind).toBe('amm');
      if (trace?.kind !== 'amm') return;
      expect(trace.data.reservesPre).toEqual([1_000_000, 200_000]);
      expect(trace.data.reservesPostBack).toEqual([1_005_000, 199_010]);
      expect(trace.data.spotPricePostFront).toBe(0.196);
      expect(trace.data.counterfactualVictimOut).toBe(102.5);
      expect(trace.data.actualVictimOut).toBe(98.2);
    });

    it('builds a whirlpool trace and stringifies u128 fields', () => {
      const trace = service.buildReplayTrace({
        ammReplay: null,
        whirlpoolReplay: {
          // u128 strings come through as-is from the detector
          sqrt_price_pre: '12345678901234567890',
          sqrt_price_post_front: '12300000000000000000',
          sqrt_price_post_victim: '12250000000000000000',
          sqrt_price_post_back: '12290000000000000000',
          liquidity_pre: '99999999999999999999',
          liquidity_post_front: '99999999999999999999',
          liquidity_post_victim: '99999999999999999999',
          liquidity_post_back: '99999999999999999999',
          tick_current_pre: 12000,
          tick_current_post_front: 11990,
          tick_current_post_victim: 11985,
          tick_current_post_back: 11992,
          counterfactual_victim_out: 50,
          actual_victim_out: 47.3,
          fee_num: 30,
          fee_den: 10_000,
        },
        dlmmReplay: null,
      });

      expect(trace?.kind).toBe('whirlpool');
      if (trace?.kind !== 'whirlpool') return;
      expect(trace.data.sqrtPricePre).toBe('12345678901234567890');
      expect(typeof trace.data.sqrtPricePre).toBe('string');
      expect(trace.data.tickCurrentPostBack).toBe(11992);
      expect(trace.data.counterfactualVictimOut).toBe(50);
    });

    it('builds a dlmm trace with bin/volatility fields', () => {
      const trace = service.buildReplayTrace({
        ammReplay: null,
        whirlpoolReplay: null,
        dlmmReplay: {
          active_id_pre: 8_388_608,
          active_id_post_front: 8_388_610,
          active_id_post_victim: 8_388_612,
          active_id_post_back: 8_388_609,
          bin_price_pre: '1099999999',
          counterfactual_victim_out: 12,
          actual_victim_out: 11.4,
          bin_step: 25,
          fee_num: 30,
          fee_den: 10_000,
          volatility_accumulator_pre: 100,
          volatility_accumulator_post_front: 150,
          variable_fee_rate_pre: 20,
          variable_fee_rate_post_front: 35,
          token_x_transfer_fee_bps: null,
          token_y_transfer_fee_bps: null,
        },
      });

      expect(trace?.kind).toBe('dlmm');
      if (trace?.kind !== 'dlmm') return;
      expect(trace.data.activeIdPre).toBe(8_388_608);
      expect(trace.data.binPricePre).toBe('1099999999');
      expect(trace.data.binStep).toBe(25);
      expect(trace.data.tokenXTransferFeeBps).toBeNull();
    });

    it('prefers amm over whirlpool/dlmm when multiple are present', () => {
      const trace = service.buildReplayTrace({
        ammReplay: {
          reserves_pre: [1, 2],
          reserves_post_front: [1, 2],
          reserves_post_victim: [1, 2],
          reserves_post_back: [1, 2],
          spot_price_pre: 0,
          spot_price_post_front: 0,
          counterfactual_victim_out: 1,
          actual_victim_out: 1,
          fee_num: 0,
          fee_den: 1,
        },
        whirlpoolReplay: { foo: 'bar' },
        dlmmReplay: { foo: 'bar' },
      });

      expect(trace?.kind).toBe('amm');
    });

    it('coerces non-string u128 fields via String() (defensive)', () => {
      // If the detector ever emits a number for a u128 field instead of a string,
      // we still produce a string so the FE can BigInt()-parse it uniformly.
      const trace = service.buildReplayTrace({
        ammReplay: null,
        whirlpoolReplay: {
          sqrt_price_pre: 123, // number instead of string
          sqrt_price_post_front: '0',
          sqrt_price_post_victim: '0',
          sqrt_price_post_back: '0',
          liquidity_pre: '0',
          liquidity_post_front: '0',
          liquidity_post_victim: '0',
          liquidity_post_back: '0',
          tick_current_pre: 0,
          tick_current_post_front: 0,
          tick_current_post_victim: 0,
          tick_current_post_back: 0,
          counterfactual_victim_out: 0,
          actual_victim_out: 0,
          fee_num: 0,
          fee_den: 1,
        },
        dlmmReplay: null,
      });

      if (trace?.kind !== 'whirlpool') throw new Error('expected whirlpool');
      expect(trace.data.sqrtPricePre).toBe('123');
    });
  });
});
