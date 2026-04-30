import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReceiptBottomCta from '../ReceiptBottomCta';

describe('ReceiptBottomCta', () => {
  it('renders heading', () => {
    render(<ReceiptBottomCta />);
    expect(screen.getByText('STOP LEAKING VALUE')).toBeInTheDocument();
  });

  it('renders action button', () => {
    render(<ReceiptBottomCta />);
    expect(screen.getByText('ACTIVATE SHIELD')).toBeInTheDocument();
  });
});
