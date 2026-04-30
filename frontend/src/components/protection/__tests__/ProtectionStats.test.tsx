import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProtectionStats from '../ProtectionStats';

describe('ProtectionStats', () => {
  it('renders all four stat cards', () => {
    render(<ProtectionStats />);
    expect(screen.getByText('$4.21B')).toBeInTheDocument();
    expect(screen.getByText('842,109')).toBeInTheDocument();
    expect(screen.getByText('<0.4ms')).toBeInTheDocument();
    expect(screen.getByText('99.99%')).toBeInTheDocument();
  });

  it('renders stat labels', () => {
    render(<ProtectionStats />);
    expect(screen.getByText('Total Protected')).toBeInTheDocument();
    expect(screen.getByText('Attacks Blocked')).toBeInTheDocument();
    expect(screen.getByText('Avg Latency')).toBeInTheDocument();
    expect(screen.getByText('Network Health')).toBeInTheDocument();
  });
});
