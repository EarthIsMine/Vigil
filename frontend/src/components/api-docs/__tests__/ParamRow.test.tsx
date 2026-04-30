import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ParamRow from '../ParamRow';

describe('ParamRow', () => {
  it('renders parameter name and type', () => {
    render(<ParamRow name="apiKey" type="string">API key description</ParamRow>);
    expect(screen.getByText('apiKey')).toBeInTheDocument();
    expect(screen.getByText('string')).toBeInTheDocument();
  });

  it('shows required badge when required', () => {
    render(<ParamRow name="tx" type="string" required>Required param</ParamRow>);
    expect(screen.getByText('required')).toBeInTheDocument();
  });

  it('shows optional badge when not required', () => {
    render(<ParamRow name="tx" type="string">Optional param</ParamRow>);
    expect(screen.getByText('optional')).toBeInTheDocument();
  });

  it('renders children as description', () => {
    render(<ParamRow name="tx" type="string">Transaction hash</ParamRow>);
    expect(screen.getByText('Transaction hash')).toBeInTheDocument();
  });
});
