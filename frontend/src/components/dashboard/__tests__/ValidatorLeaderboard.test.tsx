import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ValidatorLeaderboard from '../ValidatorLeaderboard';
import type { ValidatorLeaderboardEntry } from '@/lib/types';

const MOCK_VALIDATORS: ValidatorLeaderboardEntry[] = [
  {
    rank: 1,
    identity: 'Val1...abc',
    name: 'Validator Alpha',
    client: 'Jito',
    riskLevel: 'critical',
    riskScore: 92,
    extractedUsd: '$12,345',
  },
  {
    rank: 2,
    identity: 'Val2...def',
    name: 'Validator Beta',
    client: 'Agave',
    riskLevel: 'high',
    riskScore: 78,
    extractedUsd: '$8,901',
  },
];

describe('ValidatorLeaderboard', () => {
  it('renders the heading', () => {
    render(<ValidatorLeaderboard validators={MOCK_VALIDATORS} />);
    expect(screen.getByText('Risky Validators Leaderboard')).toBeInTheDocument();
  });

  it('renders all validators', () => {
    render(<ValidatorLeaderboard validators={MOCK_VALIDATORS} />);
    expect(screen.getByText('Validator Alpha')).toBeInTheDocument();
    expect(screen.getByText('Validator Beta')).toBeInTheDocument();
  });

  it('renders risk levels', () => {
    render(<ValidatorLeaderboard validators={MOCK_VALIDATORS} />);
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('renders extracted amounts', () => {
    render(<ValidatorLeaderboard validators={MOCK_VALIDATORS} />);
    expect(screen.getByText('$12,345')).toBeInTheDocument();
    expect(screen.getByText('$8,901')).toBeInTheDocument();
  });
});
