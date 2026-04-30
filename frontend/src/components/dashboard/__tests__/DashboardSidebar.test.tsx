import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardSidebar from '../DashboardSidebar';

describe('DashboardSidebar', () => {
  it('renders navigation links', () => {
    render(<DashboardSidebar />);
    expect(screen.getByText('Live Feed')).toBeInTheDocument();
    expect(screen.getByText('Top Extractors')).toBeInTheDocument();
    expect(screen.getByText('Searchers')).toBeInTheDocument();
    expect(screen.getByText('Network Health')).toBeInTheDocument();
  });

  it('renders filter checkboxes', () => {
    render(<DashboardSidebar />);
    expect(screen.getByText('Sandwich')).toBeInTheDocument();
    expect(screen.getByText('Frontrun')).toBeInTheDocument();
    expect(screen.getByText('Backrun')).toBeInTheDocument();
    expect(screen.getByText('Liquidation')).toBeInTheDocument();
  });

  it('renders version number', () => {
    render(<DashboardSidebar />);
    expect(screen.getByText('v0.9.4-beta')).toBeInTheDocument();
  });

  it('renders settings link', () => {
    render(<DashboardSidebar />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
