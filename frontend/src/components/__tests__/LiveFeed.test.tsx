import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LiveFeed from '../LiveFeed';
import type { MevAttack } from '@/lib/types';
import { MevType, Severity } from '@/lib/types';

function mockAttack(overrides: Partial<MevAttack> = {}): MevAttack {
  return {
    signature: 'sig-1',
    type: MevType.SANDWICH_SINGLE,
    timestamp: Date.now(),
    slot: 1,
    extractedUsd: 100,
    extractedSol: 1,
    victim: { signer: 'A'.repeat(40), amountIn: 1, amountOut: 50, expectedAmountOut: 60 },
    attacker: 'B'.repeat(40),
    dex: 'Orca',
    pool: 'SOL/USDC',
    severity: Severity.HIGH,
    confidenceLevel: null,
    detectionMethod: null,
    bundleProvenance: null,
    lossSource: null,
    ...overrides,
  };
}

describe('LiveFeed confidence dot', () => {
  it('renders no dot when confidenceLevel is missing', () => {
    render(<LiveFeed attacks={[mockAttack()]} />);
    expect(screen.queryByTestId('confidence-dot')).not.toBeInTheDocument();
  });

  it('renders a green dot for high confidence', () => {
    render(
      <LiveFeed
        attacks={[mockAttack({ confidenceLevel: 'high', detectionMethod: 'jito_bundle' })]}
      />,
    );
    const dot = screen.getByTestId('confidence-dot');
    expect(dot).toHaveAttribute('data-confidence', 'high');
    expect(dot).toHaveStyle({ backgroundColor: 'rgb(34, 197, 94)' });
  });

  it('renders a yellow dot for medium confidence', () => {
    render(
      <LiveFeed
        attacks={[mockAttack({ confidenceLevel: 'medium', detectionMethod: 'cross_slot_window' })]}
      />,
    );
    const dot = screen.getByTestId('confidence-dot');
    expect(dot).toHaveStyle({ backgroundColor: 'rgb(234, 179, 8)' });
  });

  it('renders a muted dot for low confidence', () => {
    render(
      <LiveFeed
        attacks={[mockAttack({ confidenceLevel: 'low', detectionMethod: 'header' })]}
      />,
    );
    const dot = screen.getByTestId('confidence-dot');
    expect(dot).toHaveStyle({ backgroundColor: 'rgb(136, 146, 171)' });
  });

  it('exposes a tooltip describing detection method', () => {
    render(
      <LiveFeed
        attacks={[mockAttack({ confidenceLevel: 'high', detectionMethod: 'jito_bundle' })]}
      />,
    );
    const dot = screen.getByTestId('confidence-dot');
    expect(dot).toHaveAttribute('title', 'Confidence: high — Detected via Jito bundle inspection');
  });
});
