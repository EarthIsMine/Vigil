import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReceiptSearchForm from '../ReceiptSearchForm';

describe('ReceiptSearchForm', () => {
  const defaultProps = {
    query: '',
    loading: false,
    onQueryChange: vi.fn(),
    onAnalyze: vi.fn(),
  };

  it('renders the heading', () => {
    render(<ReceiptSearchForm {...defaultProps} />);
    expect(screen.getByText('TRACE YOUR IMPACT')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<ReceiptSearchForm {...defaultProps} />);
    expect(screen.getByPlaceholderText(/7xKp/)).toBeInTheDocument();
  });

  it('renders the analyze button', () => {
    render(<ReceiptSearchForm {...defaultProps} />);
    expect(screen.getByText('ANALYZE')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<ReceiptSearchForm {...defaultProps} loading={true} query="test" />);
    expect(screen.getByText('ANALYZING...')).toBeInTheDocument();
  });

  it('disables button when query is empty', () => {
    render(<ReceiptSearchForm {...defaultProps} />);
    expect(screen.getByText('ANALYZE').closest('button')).toBeDisabled();
  });

  it('calls onQueryChange when typing', () => {
    const onQueryChange = vi.fn();
    render(<ReceiptSearchForm {...defaultProps} onQueryChange={onQueryChange} />);
    fireEvent.change(screen.getByPlaceholderText(/7xKp/), { target: { value: 'abc' } });
    expect(onQueryChange).toHaveBeenCalledWith('abc');
  });

  it('renders network badges', () => {
    render(<ReceiptSearchForm {...defaultProps} />);
    expect(screen.getByText('Solana Mainnet')).toBeInTheDocument();
    expect(screen.getByText('Devnet')).toBeInTheDocument();
  });
});
