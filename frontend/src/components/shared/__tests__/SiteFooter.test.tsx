import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SiteFooter from '../SiteFooter';

describe('SiteFooter', () => {
  it('renders the Vigil logo text', () => {
    render(<SiteFooter />);
    expect(screen.getByText('Vigil')).toBeInTheDocument();
  });

  it('renders all footer section titles', () => {
    render(<SiteFooter />);
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Developers')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
  });

  it('renders the copyright notice', () => {
    render(<SiteFooter />);
    expect(screen.getByText(/© 2024 Vigil/)).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<SiteFooter />);
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
    expect(screen.getByLabelText('Discord')).toBeInTheDocument();
  });
});
