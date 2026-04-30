import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReceiptSummaryCards from '../ReceiptSummaryCards';
import type { ReceiptSearchResult } from '@/lib/types';

const MOCK_RESULT: ReceiptSearchResult = {
  totalLossSol: 1.234,
  totalLossUsd: 185.12,
  totalAttacked: 5,
  totalTxScanned: 20,
  avgLossPerTx: 37.02,
  receipts: [],
};

describe('ReceiptSummaryCards', () => {
  it('renders total loss', () => {
    render(<ReceiptSummaryCards result={MOCK_RESULT} />);
    expect(screen.getByText('1.234 SOL')).toBeInTheDocument();
    expect(screen.getByText('$185.12')).toBeInTheDocument();
  });

  it('renders attack frequency', () => {
    render(<ReceiptSummaryCards result={MOCK_RESULT} />);
    expect(screen.getByText('MED')).toBeInTheDocument();
  });

  it('renders avg loss per tx', () => {
    render(<ReceiptSummaryCards result={MOCK_RESULT} />);
    expect(screen.getByText('$37.02')).toBeInTheDocument();
  });

  it('renders total txs scanned', () => {
    render(<ReceiptSummaryCards result={MOCK_RESULT} />);
    expect(screen.getByText('20')).toBeInTheDocument();
  });
});
