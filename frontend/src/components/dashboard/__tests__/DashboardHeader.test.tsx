import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardHeader from '../DashboardHeader';

vi.mock('@/components/ConnectionStatusProvider', () => ({
  useConnectionStatus: () => 'live',
}));

describe('DashboardHeader', () => {
  it('renders the heading', () => {
    render(<DashboardHeader />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<DashboardHeader />);
    expect(
      screen.getByText('Last 24 hours of MEV extraction across Solana DEXs.'),
    ).toBeInTheDocument();
  });

  it('renders the connection status indicator', () => {
    render(<DashboardHeader />);
    expect(screen.getByText('Live')).toBeInTheDocument();
  });
});
