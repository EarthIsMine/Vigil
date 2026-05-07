import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TelemetryTable from '../TelemetryTable';
import { MevType, Severity, type MevAttack } from '@/lib/types';

const MOCK_ATTACKS: MevAttack[] = [
  {
    signature: 'sigOrcaSandwich1234567890',
    type: MevType.SANDWICH_SINGLE,
    timestamp: 1700000000000,
    slot: 250000000,
    extractedUsd: 12450,
    extractedSol: 1.2345,
    victim: { signer: 'victim1', amountIn: 1000, amountOut: 990, expectedAmountOut: 1000 },
    attacker: 'attacker1',
    dex: 'Orca',
    pool: 'PoolAddr12345',
    severity: Severity.CRITICAL,
    confidenceLevel: null,
    detectionMethod: null,
    bundleProvenance: null,
    lossSource: 'pool_amount_out',
  },
  {
    signature: 'sigRayBackrun9876543210',
    type: MevType.BACKRUN,
    timestamp: 1700000050000,
    slot: 250000010,
    extractedUsd: 500,
    extractedSol: 0.05,
    victim: { signer: 'victim2', amountIn: 200, amountOut: 195, expectedAmountOut: 200 },
    attacker: 'attacker2',
    dex: 'Raydium',
    pool: 'PoolAddr67890',
    severity: Severity.MEDIUM,
    confidenceLevel: null,
    detectionMethod: null,
    bundleProvenance: null,
    lossSource: 'pool_amount_out',
  },
];

describe('TelemetryTable', () => {
  it('renders the heading', () => {
    render(<TelemetryTable attacks={MOCK_ATTACKS} />);
    expect(screen.getByText('Recent attacks')).toBeInTheDocument();
  });

  it('renders sentence-case column headers', () => {
    render(<TelemetryTable attacks={MOCK_ATTACKS} />);
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Pool')).toBeInTheDocument();
    expect(screen.getByText('Loss (SOL)')).toBeInTheDocument();
    expect(screen.getByText('Severity')).toBeInTheDocument();
  });

  it('renders attack type labels and loss values', () => {
    render(<TelemetryTable attacks={MOCK_ATTACKS} />);
    expect(screen.getByText('Sandwich')).toBeInTheDocument();
    expect(screen.getByText('Backrun')).toBeInTheDocument();
    expect(screen.getByText('1.2345')).toBeInTheDocument();
    expect(screen.getByText('0.0500')).toBeInTheDocument();
  });

  it('shows severity capitalized via CSS class', () => {
    render(<TelemetryTable attacks={MOCK_ATTACKS} />);
    expect(screen.getByText('critical')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  it('renders an empty-state message when there are no attacks', () => {
    render(<TelemetryTable attacks={[]} />);
    expect(screen.getByText(/No attacks detected yet/)).toBeInTheDocument();
  });
});
