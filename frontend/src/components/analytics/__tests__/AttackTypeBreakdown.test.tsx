import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AttackTypeBreakdown from '../AttackTypeBreakdown';

describe('AttackTypeBreakdown', () => {
  it('renders the heading', () => {
    render(<AttackTypeBreakdown />);
    expect(screen.getByText('Attack Type Breakdown')).toBeInTheDocument();
  });

  it('renders all attack types', () => {
    render(<AttackTypeBreakdown />);
    expect(screen.getByText('Sandwich')).toBeInTheDocument();
    expect(screen.getByText('Backrun')).toBeInTheDocument();
    expect(screen.getByText('Frontrun')).toBeInTheDocument();
  });

  it('renders percentages', () => {
    render(<AttackTypeBreakdown />);
    expect(screen.getByText('52%')).toBeInTheDocument();
    expect(screen.getByText('35%')).toBeInTheDocument();
    expect(screen.getByText('13%')).toBeInTheDocument();
  });
});
