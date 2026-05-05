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

  it('renders social media icons as disabled placeholders', () => {
    render(<SiteFooter />);
    expect(screen.getByLabelText('Twitter (coming soon)')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByLabelText('GitHub (coming soon)')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByLabelText('Discord (coming soon)')).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders unfinished footer links as disabled spans, not anchors', () => {
    render(<SiteFooter />);
    const apiRef = screen.getByText('API Reference');
    expect(apiRef.tagName).toBe('SPAN');
    expect(apiRef).toHaveAttribute('aria-disabled', 'true');

    const privacy = screen.getByText('Privacy');
    expect(privacy.tagName).toBe('SPAN');
    expect(privacy).toHaveAttribute('aria-disabled', 'true');
  });

  it('keeps real internal routes as anchors', () => {
    render(<SiteFooter />);
    const dashboard = screen.getByText('Dashboard');
    expect(dashboard.tagName).toBe('A');
    expect(dashboard).toHaveAttribute('href', '/dashboard');

    const contact = screen.getByText('Contact');
    expect(contact.tagName).toBe('A');
    expect(contact).toHaveAttribute('href', '/contact');
  });
});
