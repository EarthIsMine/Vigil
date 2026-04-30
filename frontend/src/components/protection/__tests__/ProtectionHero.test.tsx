import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProtectionHero from '../ProtectionHero';

describe('ProtectionHero', () => {
  it('renders the main heading', () => {
    render(<ProtectionHero />);
    expect(screen.getByText('FRONT-RUN THE')).toBeInTheDocument();
    expect(screen.getByText('ATTACKERS')).toBeInTheDocument();
  });

  it('renders CTA links', () => {
    render(<ProtectionHero />);
    expect(screen.getByText('Start Protecting')).toBeInTheDocument();
    expect(screen.getByText('Read Docs')).toBeInTheDocument();
  });

  it('renders feature checklist items', () => {
    render(<ProtectionHero />);
    expect(screen.getByText('Zero configuration required')).toBeInTheDocument();
    expect(screen.getByText('Sub-millisecond response times')).toBeInTheDocument();
    expect(screen.getByText('Free tier available')).toBeInTheDocument();
  });

  it('renders the code window', () => {
    render(<ProtectionHero />);
    expect(screen.getByText('shield.config.ts')).toBeInTheDocument();
  });
});
