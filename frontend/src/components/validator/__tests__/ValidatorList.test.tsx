import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ValidatorList from '../ValidatorList';
import type { ValidatorLeaderboardEntry } from '@/lib/types';

const ROWS: ValidatorLeaderboardEntry[] = [
  {
    rank: 1,
    identity: 'StKHse7Qx4p',
    name: 'Stake House Capital',
    client: 'Jito-Agave',
    riskScore: 96,
    riskLevel: 'critical',
    extractedUsd: '$892K',
  },
  {
    rank: 2,
    identity: 'mariN4vALi9',
    name: 'Marinade Finance',
    client: 'Jito-Agave',
    riskScore: 81,
    riskLevel: 'high',
    extractedUsd: null,
  },
];

describe('ValidatorList', () => {
  it('renders empty state when validators is empty', () => {
    render(<ValidatorList validators={[]} />);
    expect(screen.getByText(/No validators yet/)).toBeInTheDocument();
  });

  it('renders one row per validator', () => {
    render(<ValidatorList validators={ROWS} />);
    expect(screen.getByText('Stake House Capital')).toBeInTheDocument();
    expect(screen.getByText('Marinade Finance')).toBeInTheDocument();
  });

  it('makes each row a link to the validator detail page', () => {
    render(<ValidatorList validators={ROWS} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(ROWS.length);
    expect(links[0]).toHaveAttribute('href', '/validator/StKHse7Qx4p');
    expect(links[1]).toHaveAttribute('href', '/validator/mariN4vALi9');
  });

  it('shows risk level badge text in upper case', () => {
    render(<ValidatorList validators={ROWS} />);
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('falls back to em-dash when extractedUsd is null', () => {
    render(<ValidatorList validators={ROWS} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
