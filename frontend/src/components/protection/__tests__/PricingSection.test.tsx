import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PricingSection from '../PricingSection';

describe('PricingSection', () => {
  it('renders the section heading', () => {
    render(<PricingSection />);
    expect(screen.getByText('Simple, Transparent Pricing')).toBeInTheDocument();
  });

  it('renders all three tiers', () => {
    render(<PricingSection />);
    expect(screen.getByText('Community')).toBeInTheDocument();
    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(screen.getByText('Sovereign')).toBeInTheDocument();
  });

  it('renders prices', () => {
    render(<PricingSection />);
    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('$499')).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('renders the MOST POPULAR badge', () => {
    render(<PricingSection />);
    expect(screen.getByText('MOST POPULAR')).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(<PricingSection />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText('Start Free Trial')).toBeInTheDocument();
    expect(screen.getByText('Contact Sales')).toBeInTheDocument();
  });
});
