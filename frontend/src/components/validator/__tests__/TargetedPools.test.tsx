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
    expect(screen.getByText('Most targeted pools')).toBeInTheDocument();
  });

  it('renders the dex for each pool row', () => {
    render(<TargetedPools pools={MOCK_POOLS} />);
    expect(screen.getByText('Orca')).toBeInTheDocument();
    expect(screen.getByText('Raydium')).toBeInTheDocument();
    expect(screen.getByText('Marinade')).toBeInTheDocument();
  });

  it('truncates long pool addresses', () => {
    render(<TargetedPools pools={MOCK_POOLS} />);
    expect(screen.getByText('OrcaPool…CDEF')).toBeInTheDocument();
  });

  it('renders attack counts with thousands separator', () => {
    render(<TargetedPools pools={MOCK_POOLS} />);
    expect(screen.getByText('1,247')).toBeInTheDocument();
    expect(screen.getByText('982')).toBeInTheDocument();
    expect(screen.getByText('543')).toBeInTheDocument();
  });
});
