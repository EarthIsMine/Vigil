import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MethodBadge from '../MethodBadge';

describe('MethodBadge', () => {
  it('renders GET badge', () => {
    render(<MethodBadge method="GET" />);
    expect(screen.getByText('GET')).toBeInTheDocument();
  });

  it('renders POST badge', () => {
    render(<MethodBadge method="POST" />);
    expect(screen.getByText('POST')).toBeInTheDocument();
  });

  it('renders DELETE badge', () => {
    render(<MethodBadge method="DELETE" />);
    expect(screen.getByText('DELETE')).toBeInTheDocument();
  });
});
