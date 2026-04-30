import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ValidatorPagination from '../ValidatorPagination';

describe('ValidatorPagination', () => {
  it('renders count text', () => {
    render(<ValidatorPagination />);
    expect(screen.getByText('Showing 1–8 of 4,745 attacks')).toBeInTheDocument();
  });

  it('renders page buttons', () => {
    render(<ValidatorPagination />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('593')).toBeInTheDocument();
  });

  it('disables previous button', () => {
    render(<ValidatorPagination />);
    expect(screen.getByText('Previous')).toBeDisabled();
  });
});
