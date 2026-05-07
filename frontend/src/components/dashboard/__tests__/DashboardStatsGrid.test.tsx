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
  it('renders all stat labels in sentence case', () => {
    render(<DashboardStatsGrid stats={MOCK_STATS} />);
    expect(screen.getByText('MEV extracted (24h)')).toBeInTheDocument();
    expect(screen.getByText('Attacks detected')).toBeInTheDocument();
    expect(screen.getByText('Avg loss per victim')).toBeInTheDocument();
    expect(screen.getByText('Active attackers')).toBeInTheDocument();
  });

  it('renders formatted values', () => {
    render(<DashboardStatsGrid stats={MOCK_STATS} />);
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('$42.50')).toBeInTheDocument();
  });

  it('renders top attacker hint when available', () => {
    render(<DashboardStatsGrid stats={MOCK_STATS} />);
    expect(screen.getByText(/top: abc\.\.\.xyz/)).toBeInTheDocument();
  });

  it('renders change indicator for non-null changePercent', () => {
    render(<DashboardStatsGrid stats={MOCK_STATS} />);
    expect(screen.getByText(/\+5\.2%/)).toBeInTheDocument();
    expect(screen.getByText(/-3\.1%/)).toBeInTheDocument();
  });
});
