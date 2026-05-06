import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ConfidenceBadge from '../ConfidenceBadge';

describe('ConfidenceBadge', () => {
  it('renders Verified label with green tone for high confidence', () => {
    const { container } = render(<ConfidenceBadge level="high" />);
    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(container.querySelector('[role="status"]')?.className).toContain('text-accent-green');
  });

  it('renders Likely label with yellow tone for medium confidence', () => {
    const { container } = render(<ConfidenceBadge level="medium" />);
    expect(screen.getByText('Likely')).toBeInTheDocument();
    expect(container.querySelector('[role="status"]')?.className).toContain('text-accent-yellow');
  });

  it('renders Unverified label with muted tone for low confidence', () => {
    const { container } = render(<ConfidenceBadge level="low" />);
    expect(screen.getByText('Unverified')).toBeInTheDocument();
    expect(container.querySelector('[role="status"]')?.className).toContain('text-vigil-muted');
  });

  it('renders nothing when level is null', () => {
    const { container } = render(<ConfidenceBadge level={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when level is undefined', () => {
    const { container } = render(<ConfidenceBadge level={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('exposes accessible status label using the visible badge text', () => {
    render(<ConfidenceBadge level="high" />);
    expect(screen.getByRole('status')).toHaveAttribute(
      'aria-label',
      'Detection confidence: Verified',
    );
  });
});
