import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ValidatorPagination from '../ValidatorPagination';

describe('ValidatorPagination', () => {
  it('renders count text with data', () => {
    render(<ValidatorPagination total={50} shown={20} />);
    expect(screen.getByText('Showing 1–20 of 50 attacks')).toBeInTheDocument();
  });

  it('renders empty state when no attacks', () => {
    render(<ValidatorPagination total={0} shown={20} />);
    expect(screen.getByText('No attacks detected yet')).toBeInTheDocument();
  });

  it('caps shown at total when total is smaller', () => {
    render(<ValidatorPagination total={5} shown={20} />);
    expect(screen.getByText('Showing 1–5 of 5 attacks')).toBeInTheDocument();
  });
});
