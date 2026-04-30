import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnalyticsHeader from '../AnalyticsHeader';

describe('AnalyticsHeader', () => {
  it('renders heading', () => {
    render(<AnalyticsHeader />);
    expect(screen.getByText('Network Analytics')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<AnalyticsHeader />);
    expect(screen.getByText('Solana MEV extraction · Epoch-level data')).toBeInTheDocument();
  });

  it('renders epoch range select', () => {
    render(<AnalyticsHeader />);
    expect(screen.getByText('Last 7 epochs')).toBeInTheDocument();
  });
});
