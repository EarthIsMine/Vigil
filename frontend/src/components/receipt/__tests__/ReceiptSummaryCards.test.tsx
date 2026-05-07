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
  it('renders total loss with USD subtotal', () => {
    render(<ReceiptSummaryCards result={MOCK_RESULT} />);
    expect(screen.getByText('1.234 SOL')).toBeInTheDocument();
    expect(screen.getByText('$185.12')).toBeInTheDocument();
  });

  it('renders attack frequency as count over scanned + label', () => {
    render(<ReceiptSummaryCards result={MOCK_RESULT} />);
    // "5" big tabular number, "/ 20" muted continuation, then "Medium frequency" foot
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('/ 20')).toBeInTheDocument();
    expect(screen.getByText('Medium frequency')).toBeInTheDocument();
  });

  it('renders avg loss per tx', () => {
    render(<ReceiptSummaryCards result={MOCK_RESULT} />);
    expect(screen.getByText('$37.02')).toBeInTheDocument();
  });

  it('renders txs scanned with sentence-case foot', () => {
    render(<ReceiptSummaryCards result={MOCK_RESULT} />);
    expect(screen.getByText('Transactions scanned')).toBeInTheDocument();
    expect(screen.getByText('in selected range')).toBeInTheDocument();
  });
});
