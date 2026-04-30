import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProtocolLeaderboard from '../ProtocolLeaderboard';
import type { PoolLeaderboardEntry } from '@/lib/types';

const MOCK_PROTOCOLS: PoolLeaderboardEntry[] = [
  { pool: 'SOL/USDC', dex: 'Raydium', attacks: 100, volumeLost: '$50,000', trend: '+5%' },
  { pool: 'RAY/SOL', dex: 'Orca', attacks: 75, volumeLost: '$30,000', trend: '-2%' },
];

describe('ProtocolLeaderboard', () => {
  it('renders the heading', () => {
    render(<ProtocolLeaderboard protocols={MOCK_PROTOCOLS} maxAttacks={100} />);
    expect(screen.getByText('Most Targeted Protocols')).toBeInTheDocument();
  });

  it('renders protocols', () => {
    render(<ProtocolLeaderboard protocols={MOCK_PROTOCOLS} maxAttacks={100} />);
    expect(screen.getByText('SOL/USDC')).toBeInTheDocument();
    expect(screen.getByText('RAY/SOL')).toBeInTheDocument();
  });

  it('shows loading state when empty', () => {
    const { container } = render(<ProtocolLeaderboard protocols={[]} maxAttacks={1} />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });
});
