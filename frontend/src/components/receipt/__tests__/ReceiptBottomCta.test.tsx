import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReceiptBottomCta from '../ReceiptBottomCta';

describe('ReceiptBottomCta', () => {
  it('renders heading in sentence case', () => {
    render(<ReceiptBottomCta />);
    expect(screen.getByText('Stop leaking value')).toBeInTheDocument();
  });

  it('renders action link to Vigil-RPC', () => {
    render(<ReceiptBottomCta />);
    const link = screen.getByText('Activate shield').closest('a');
    expect(link).toHaveAttribute('href', 'https://github.com/EarthIsMine/Vigil-RPC');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
