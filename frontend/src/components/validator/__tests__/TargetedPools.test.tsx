import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TargetedPools from '../TargetedPools';

describe('TargetedPools', () => {
  it('renders the heading', () => {
    render(<TargetedPools />);
    expect(screen.getByText('Most Targeted Pools')).toBeInTheDocument();
  });

  it('renders all pools', () => {
    render(<TargetedPools />);
    expect(screen.getByText('Orca SOL-USDC')).toBeInTheDocument();
    expect(screen.getByText('Raydium RAY-SOL')).toBeInTheDocument();
    expect(screen.getByText('Marinade mSOL-SOL')).toBeInTheDocument();
  });

  it('renders attack counts', () => {
    render(<TargetedPools />);
    expect(screen.getByText('1247')).toBeInTheDocument();
    expect(screen.getByText('982')).toBeInTheDocument();
  });
});
