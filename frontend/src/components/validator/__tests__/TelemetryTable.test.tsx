import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TelemetryTable from '../TelemetryTable';

describe('TelemetryTable', () => {
  it('renders the heading', () => {
    render(<TelemetryTable />);
    expect(screen.getByText('Telemetry')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(<TelemetryTable />);
    expect(screen.getByText('Timestamp')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Pool')).toBeInTheDocument();
    expect(screen.getByText('Extracted')).toBeInTheDocument();
  });

  it('renders telemetry rows', () => {
    render(<TelemetryTable />);
    expect(screen.getAllByText('Sandwich').length).toBeGreaterThan(0);
    expect(screen.getByText('$12,450')).toBeInTheDocument();
  });
});
