import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HowItWorks from '../HowItWorks';

describe('HowItWorks', () => {
  it('renders the section heading', () => {
    render(<HowItWorks />);
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  it('renders all three steps', () => {
    render(<HowItWorks />);
    expect(screen.getByText('Real-Time TX Analysis')).toBeInTheDocument();
    expect(screen.getByText('Jito Bundle Submission')).toBeInTheDocument();
    expect(screen.getByText('MEV Rebates')).toBeInTheDocument();
  });

  it('renders step statistics', () => {
    render(<HowItWorks />);
    expect(screen.getByText('99.8%')).toBeInTheDocument();
    expect(screen.getByText('2,847')).toBeInTheDocument();
    expect(screen.getByText('$2.4M')).toBeInTheDocument();
  });
});
