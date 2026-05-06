import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TransactionTable from '../TransactionTable';
import type { MevReceipt } from '@/lib/types';
import { MevType, Severity } from '@/lib/types';

function makeReceipt(overrides: Partial<MevReceipt> = {}): MevReceipt {
  return {
    receiptId: 'r-1',
    txSignature: 'tx-1',
    timestamp: 0,
    victim: {
      wallet: 'w-1',
      action: 'swap',
      dex: 'Orca',
      tokenIn: { mint: 'a', symbol: 'A', decimals: 9 },
      tokenOut: { mint: 'b', symbol: 'B', decimals: 6 },
      amountIn: 1,
      expectedAmountOut: 1,
      actualAmountOut: 1,
      slippage: 0,
    },
    mevAnalysis: {
      detected: true,
      type: MevType.SANDWICH_SINGLE,
      severity: Severity.HIGH,
      loss: {
        expectedAmountOut: 1,
        actualAmountOut: 0.9,
        lossAmount: 0.1,
        lossUsd: null,
        lossPercent: 10,
        confidence: 'exact',
      },
    },
    validator: { identity: '', name: '', riskLevel: 'unrated', riskScore: 0 },
    protection: { toolUsed: null, wasProtected: false, protectionFailed: false },
    shareUrl: '',
    shareImageUrl: '',
    confidenceLevel: 'high',
    detectionMethod: 'jito_bundle',
    bundleProvenance: 'atomic',
    lossSource: 'amm_replay',
    attackDetail: {
      kind: 'sandwich',
      attackerAddress: 'a',
      frontrunTx: 'f',
      backrunTx: 'b',
      attackerProfit: 0.05,
      attackerProfitUsd: null,
      pool: 'p',
      frontrunSlot: 1,
      backrunSlot: 1,
      isWideSandwich: false,
    },
    ...overrides,
  };
}

describe('TransactionTable lossDisplay', () => {
  it('shows "Loss not estimated" only for detected MEV with lossSource=unenriched', () => {
    const detectedUnenriched = makeReceipt({
      mevAnalysis: {
        ...makeReceipt().mevAnalysis,
        detected: true,
      },
      lossSource: 'unenriched',
    });
    render(<TransactionTable receipts={[detectedUnenriched]} />);
    expect(screen.getByText('Loss not estimated')).toBeInTheDocument();
  });

  it('does NOT show placeholder for non-detected receipts even with lossSource=unenriched', () => {
    const cleanSwap = makeReceipt({
      mevAnalysis: {
        ...makeReceipt().mevAnalysis,
        detected: false,
        type: MevType.NONE,
        loss: {
          expectedAmountOut: 1,
          actualAmountOut: 1,
          lossAmount: 0,
          lossUsd: 0,
          lossPercent: 0,
          confidence: 'exact',
        },
      },
      lossSource: 'unenriched',
    });
    render(<TransactionTable receipts={[cleanSwap]} />);
    expect(screen.queryByText('Loss not estimated')).not.toBeInTheDocument();
    expect(screen.getByText('0.000 SOL')).toBeInTheDocument();
  });

  it('formats positive loss as -X.XXX SOL', () => {
    render(<TransactionTable receipts={[makeReceipt()]} />);
    expect(screen.getByText('-0.100 SOL')).toBeInTheDocument();
  });
});
