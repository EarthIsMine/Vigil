import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PoolLeaderboard from '../PoolLeaderboard';
import type { PoolLeaderboardEntry } from '@/lib/types';

const MOCK_POOLS: PoolLeaderboardEntry[] = [
  {
    pool: 'SOL/USDC',
    dex: 'Raydium',
    attacks: 1234,
    volumeLost: '$45,678',
    trend: '+12%',
  },
  {
    pool: 'RAY/USDC',
    dex: 'Orca',
    attacks: 567,
    volumeLost: '$12,345',
    trend: '-5%',
  },
];

describe('PoolLeaderboard', () => {
  it('renders the heading in sentence case', () => {
    render(<PoolLeaderboard pools={MOCK_POOLS} />);
    expect(screen.getByText('Most targeted pools')).toBeInTheDocument();
  });

  it('renders dex names per row', () => {
    render(<PoolLeaderboard pools={MOCK_POOLS} />);
    expect(screen.getByText('Raydium')).toBeInTheDocument();
    expect(screen.getByText('Orca')).toBeInTheDocument();
  });

  it('renders attack counts with thousands separator', () => {
    render(<PoolLeaderboard pools={MOCK_POOLS} />);
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('567')).toBeInTheDocument();
  });

  it('renders empty-state when no pools', () => {
    render(<PoolLeaderboard pools={[]} />);
    expect(screen.getByText(/No data yet/)).toBeInTheDocument();
  });
});
