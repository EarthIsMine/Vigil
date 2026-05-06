import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TargetedPools from '../TargetedPools';
import type { PoolLeaderboardEntry } from '@/lib/types';

const MOCK_POOLS: PoolLeaderboardEntry[] = [
  { pool: 'OrcaPoolAddrFFFFCDEF', dex: 'Orca', attacks: 1247, volumeLost: '$45,678', trend: '+12%' },
  { pool: 'RaydPoolAddrAAAAFEDC', dex: 'Raydium', attacks: 982, volumeLost: '$30,000', trend: '+5%' },
  { pool: 'MariPoolAddrBBBBABCD', dex: 'Marinade', attacks: 543, volumeLost: '$10,000', trend: '-2%' },
];

describe('TargetedPools', () => {
  it('renders the heading', () => {
    render(<TargetedPools pools={MOCK_POOLS} />);
    expect(screen.getByText('Most Targeted Pools')).toBeInTheDocument();
  });

  it('renders all pools', () => {
    render(<TargetedPools pools={MOCK_POOLS} />);
    expect(screen.getByText('Orca — OrcaPool...CDEF')).toBeInTheDocument();
    expect(screen.getByText('Raydium — RaydPool...FEDC')).toBeInTheDocument();
    expect(screen.getByText('Marinade — MariPool...ABCD')).toBeInTheDocument();
  });

  it('renders attack counts', () => {
    render(<TargetedPools pools={MOCK_POOLS} />);
    expect(screen.getByText('1247')).toBeInTheDocument();
    expect(screen.getByText('982')).toBeInTheDocument();
    expect(screen.getByText('543')).toBeInTheDocument();
  });
});
