import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ValidatorLeaderboard from '../ValidatorLeaderboard';
import type { ValidatorLeaderboardEntry } from '@/lib/types';

const MOCK_VALIDATORS: ValidatorLeaderboardEntry[] = [
  {
    rank: 1,
    identity: 'Val1abc',
    name: 'Validator Alpha',
    client: 'Jito',
    riskLevel: 'critical',
    riskScore: 92,
    extractedUsd: '$12,345',
  },
  {
    rank: 2,
    identity: 'Val2def',
    name: 'Validator Beta',
    client: 'Agave',
    riskLevel: 'high',
    riskScore: 78,
    extractedUsd: '$8,901',
  },
];

describe('ValidatorLeaderboard', () => {
  it('renders the heading in sentence case', () => {
    render(<ValidatorLeaderboard validators={MOCK_VALIDATORS} />);
    expect(screen.getByText('Risky validators')).toBeInTheDocument();
  });

  it('renders all validators', () => {
    render(<ValidatorLeaderboard validators={MOCK_VALIDATORS} />);
    expect(screen.getByText('Validator Alpha')).toBeInTheDocument();
    expect(screen.getByText('Validator Beta')).toBeInTheDocument();
  });

  it('renders risk levels in sentence case', () => {
    render(<ValidatorLeaderboard validators={MOCK_VALIDATORS} />);
    expect(screen.getByText('Critical')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('renders extracted amounts', () => {
    render(<ValidatorLeaderboard validators={MOCK_VALIDATORS} />);
    expect(screen.getByText('$12,345')).toBeInTheDocument();
    expect(screen.getByText('$8,901')).toBeInTheDocument();
  });

  it('links each row to the validator detail page', () => {
    render(<ValidatorLeaderboard validators={MOCK_VALIDATORS} />);
    const links = screen.getAllByRole('link');
    // 2 row links + the "View all →" link
    expect(links.length).toBeGreaterThanOrEqual(2);
    expect(links.some((a) => a.getAttribute('href') === '/validator/Val1abc')).toBe(true);
    expect(links.some((a) => a.getAttribute('href') === '/validator/Val2def')).toBe(true);
  });
});
