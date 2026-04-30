import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardHeader from '../DashboardHeader';

describe('DashboardHeader', () => {
  it('renders heading', () => {
    render(<DashboardHeader />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<DashboardHeader />);
    expect(screen.getByText('Real-time MEV monitoring and analytics')).toBeInTheDocument();
  });

  it('renders time range select', () => {
    render(<DashboardHeader />);
    expect(screen.getByText('Last 24 hours')).toBeInTheDocument();
    expect(screen.getByText('Last 7 days')).toBeInTheDocument();
  });
});
