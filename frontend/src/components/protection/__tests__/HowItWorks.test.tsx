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

  it('renders step highlights without fabricated numbers', () => {
    render(<HowItWorks />);
    expect(screen.getByText('Pre-submission scoring')).toBeInTheDocument();
    expect(screen.getByText('Direct Block Engine routing')).toBeInTheDocument();
    expect(screen.getByText('Automatic rebate distribution')).toBeInTheDocument();
    expect(screen.queryByText('99.8%')).not.toBeInTheDocument();
    expect(screen.queryByText('2,847')).not.toBeInTheDocument();
    expect(screen.queryByText('$2.4M')).not.toBeInTheDocument();
  });
});
