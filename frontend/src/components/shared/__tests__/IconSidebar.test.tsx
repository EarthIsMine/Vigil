import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import IconSidebar from '../IconSidebar';

describe('IconSidebar', () => {
  it('renders 4 navigation links', () => {
    render(<IconSidebar activePath="/dashboard" />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);
  });

  it('highlights the active path', () => {
    render(<IconSidebar activePath="/receipt" />);
    const receiptLink = screen.getByRole('link', { name: /receipt/i });
    expect(receiptLink.className).toContain('bg-vigil-accent/10');
    expect(receiptLink.className).toContain('text-vigil-accent');
  });

  it('renders settings button', () => {
    render(<IconSidebar activePath="/dashboard" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('links to correct routes', () => {
    render(<IconSidebar activePath="/dashboard" />);
    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href'));
    expect(hrefs).toContain('/dashboard');
    expect(hrefs).toContain('/receipt');
    expect(hrefs).toContain('/protection');
    expect(hrefs).toContain('/analytics');
  });
});
