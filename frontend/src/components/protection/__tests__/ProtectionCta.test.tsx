import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProtectionCta from '../ProtectionCta';

describe('ProtectionCta', () => {
  it('renders the CTA heading', () => {
    render(<ProtectionCta />);
    expect(screen.getByText('Stop Losing Money to')).toBeInTheDocument();
    expect(screen.getByText('MEV Attacks Today')).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(<ProtectionCta />);
    expect(screen.getByText('Start Protecting Now')).toBeInTheDocument();
    expect(screen.getByText('Read Documentation')).toBeInTheDocument();
  });
});
