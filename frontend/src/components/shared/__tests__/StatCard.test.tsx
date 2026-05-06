import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';

describe('StatCard', () => {
  it('renders title and value', () => {
    render(<StatCard title="MEV Extracted" value="$1.23M" />);
    expect(screen.getByText('MEV Extracted')).toBeInTheDocument();
    expect(screen.getByText('$1.23M')).toBeInTheDocument();
  });

  it('renders change indicator when provided', () => {
    render(
      <StatCard
        title="Total Attacks"
        value="1,234"
        change={{ label: '+5.1%', cls: 'text-secondary' }}
      />
    );
    expect(screen.getByText('+5.1%')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(
      <StatCard title="Active Attackers" value="42" subtitle="top: StKH7Qx4p" />
    );
    expect(screen.getByText('top: S...Qx4p')).toBeInTheDocument();
  });

  it('does not render change when not provided', () => {
    const { container } = render(<StatCard title="Test" value="123" />);
    const changeSpan = container.querySelector('[data-testid="stat-change"]');
    expect(changeSpan).toBeNull();
  });
});
