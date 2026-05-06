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
  it('renders the heading', () => {
    render(<PoolLeaderboard pools={MOCK_POOLS} />);
    expect(screen.getByText('Most Targeted Pools')).toBeInTheDocument();
  });

  it('renders all pools', () => {
    render(<PoolLeaderboard pools={MOCK_POOLS} />);
    expect(screen.getByText('SOL/USDC...USDC')).toBeInTheDocument();
    expect(screen.getByText('RAY/USDC...USDC')).toBeInTheDocument();
  });

  it('renders dex names', () => {
    render(<PoolLeaderboard pools={MOCK_POOLS} />);
    expect(screen.getByText('Raydium')).toBeInTheDocument();
    expect(screen.getByText('Orca')).toBeInTheDocument();
  });

  it('renders attack counts and volume', () => {
    render(<PoolLeaderboard pools={MOCK_POOLS} />);
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('$45,678')).toBeInTheDocument();
  });
});
