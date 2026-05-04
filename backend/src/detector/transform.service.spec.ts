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
});
