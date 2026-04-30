import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReceiptResultsHeader from '../ReceiptResultsHeader';

describe('ReceiptResultsHeader', () => {
  it('renders query in input', () => {
    render(<ReceiptResultsHeader query="abc123" onBack={() => {}} />);
    expect(screen.getByDisplayValue('abc123')).toBeInTheDocument();
  });

  it('calls onBack when back button clicked', () => {
    const onBack = vi.fn();
    render(<ReceiptResultsHeader query="abc123" onBack={onBack} />);
    fireEvent.click(screen.getByText('arrow_back'));
    expect(onBack).toHaveBeenCalledOnce();
  });
});
