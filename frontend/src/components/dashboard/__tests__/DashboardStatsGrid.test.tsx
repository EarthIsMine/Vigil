import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardStatsGrid from '../DashboardStatsGrid';
import type { DashboardStats } from '@/lib/types';

const MOCK_STATS: DashboardStats = {
  totalMevExtracted24h: { usd: 50000, sol: 250, changePercent: 5.2 },
  totalAttacks24h: { count: 120, changePercent: -3.1 },
  averageLossPerTx: { usd: 42.5, changePercent: null },
  activeAttackers24h: { count: 18, topAttacker: 'abc...xyz' },
};

describe('DashboardStatsGrid', () => {
  it('renders all stat titles', () => {
    render(<DashboardStatsGrid stats={MOCK_STATS} />);
    expect(screen.getByText('MEV Extracted')).toBeInTheDocument();
    expect(screen.getByText('Total Attacks')).toBeInTheDocument();
    expect(screen.getByText('Active Attackers')).toBeInTheDocument();
    expect(screen.getByText('Avg Victim Loss')).toBeInTheDocument();
  });

  it('renders formatted values', () => {
    render(<DashboardStatsGrid stats={MOCK_STATS} />);
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
  });
});
