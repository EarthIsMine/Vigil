import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardLiveFeed from '../DashboardLiveFeed';
import type { MevAttack } from '@/lib/types';
import { MevType, Severity } from '@/lib/types';

const useConnectionStatusMock = vi.fn();

vi.mock('@/components/ConnectionStatusProvider', () => ({
  useConnectionStatus: () => useConnectionStatusMock(),
}));

const ATTACKS: MevAttack[] = [
  {
    signature: 'sig-1',
    type: MevType.SANDWICH_SINGLE,
    timestamp: Date.now(),
    slot: 1,
    extractedUsd: 100,
    extractedSol: 1,
    victim: { signer: 'A'.repeat(40), amountIn: 1, amountOut: 50, expectedAmountOut: 60 },
    attacker: 'B'.repeat(40),
    dex: 'Orca',
    pool: 'SOL/USDC',
    severity: Severity.HIGH,
    confidenceLevel: null,
    detectionMethod: null,
    bundleProvenance: null,
    lossSource: 'pool_amount_out',
  },
];

describe('DashboardLiveFeed', () => {
  beforeEach(() => {
    useConnectionStatusMock.mockReset();
  });

  it('renders the heading', () => {
    useConnectionStatusMock.mockReturnValue('live');
    render(<DashboardLiveFeed attacks={ATTACKS} />);
    expect(screen.getByText('Live attack feed')).toBeInTheDocument();
  });

  it('shows pulsing Live badge when status is live', () => {
    useConnectionStatusMock.mockReturnValue('live');
    const { container } = render(<DashboardLiveFeed attacks={ATTACKS} />);
    expect(screen.getByText('Live')).toBeInTheDocument();
    expect(container.querySelector('.animate-pulse')).not.toBeNull();
  });

  it('shows non-pulsing Offline badge when status is offline', () => {
    useConnectionStatusMock.mockReturnValue('offline');
    const { container } = render(<DashboardLiveFeed attacks={ATTACKS} />);
    expect(screen.getByText('Offline')).toBeInTheDocument();
    expect(screen.queryByText('Live')).not.toBeInTheDocument();
    expect(container.querySelector('.animate-pulse')).toBeNull();
  });
});
