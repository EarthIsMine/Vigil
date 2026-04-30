import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ValidatorFooter from '../ValidatorFooter';

describe('ValidatorFooter', () => {
  it('renders brand text', () => {
    render(<ValidatorFooter />);
    expect(screen.getByText(/VIGIL/)).toBeInTheDocument();
  });

  it('renders powered by text', () => {
    render(<ValidatorFooter />);
    expect(screen.getByText('Powered by real-time on-chain analysis')).toBeInTheDocument();
  });
});
