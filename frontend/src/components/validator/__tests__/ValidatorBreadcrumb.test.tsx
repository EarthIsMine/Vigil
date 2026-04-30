import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ValidatorBreadcrumb from '../ValidatorBreadcrumb';

describe('ValidatorBreadcrumb', () => {
  it('renders navigation links', () => {
    render(<ValidatorBreadcrumb name="Test Validator" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Validators')).toBeInTheDocument();
  });

  it('renders current validator name', () => {
    render(<ValidatorBreadcrumb name="Test Validator" />);
    expect(screen.getByText('Test Validator')).toBeInTheDocument();
  });
});
