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
});
