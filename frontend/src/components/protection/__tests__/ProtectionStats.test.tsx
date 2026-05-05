import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProtectionStats from '../ProtectionStats';

describe('ProtectionStats', () => {
  it('renders all four qualitative stat cards', () => {
    render(<ProtectionStats />);
    expect(screen.getByText('Real-Time Detection')).toBeInTheDocument();
    expect(screen.getByText('Sub-Millisecond Routing')).toBeInTheDocument();
    expect(screen.getByText('Jito Bundle Submission')).toBeInTheDocument();
    expect(screen.getByText('Open Audit Trail')).toBeInTheDocument();
  });

  it('does not render fabricated marketing numbers', () => {
    render(<ProtectionStats />);
    expect(screen.queryByText('$4.21B')).not.toBeInTheDocument();
    expect(screen.queryByText('842,109')).not.toBeInTheDocument();
    expect(screen.queryByText('<0.4ms')).not.toBeInTheDocument();
    expect(screen.queryByText('99.99%')).not.toBeInTheDocument();
  });
});
