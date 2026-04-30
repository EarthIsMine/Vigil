import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DocsSidebar from '../DocsSidebar';

describe('DocsSidebar', () => {
  it('renders all navigation groups', () => {
    render(<DocsSidebar activeSection="introduction" />);
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Core API')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<DocsSidebar activeSection="introduction" />);
    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.getByText('Authentication')).toBeInTheDocument();
    expect(screen.getByText('Send Transaction')).toBeInTheDocument();
    expect(screen.getByText('MEV Receipt')).toBeInTheDocument();
    expect(screen.getByText('Rate Limits')).toBeInTheDocument();
  });

  it('renders the help section', () => {
    render(<DocsSidebar activeSection="introduction" />);
    expect(screen.getByText('Need help?')).toBeInTheDocument();
    expect(screen.getByText('Join Discord →')).toBeInTheDocument();
  });
});
