import { describe, it, expect } from 'vitest';
import { fmtChange, txTypeLabel, getRiskColorHex } from '../format';
import { MevType } from '../types';

describe('fmtChange', () => {
  it('returns N/A with muted class for null', () => {
    expect(fmtChange(null)).toEqual({ label: 'N/A', cls: 'text-muted' });
  });

  it('returns + prefix for positive values', () => {
    const result = fmtChange(12.3);
    expect(result.label).toBe('+12.3%');
  });

  it('returns text-secondary class for positive values', () => {
    expect(fmtChange(5).cls).toBe('text-secondary');
  });

  it('returns text-error class for negative values', () => {
    expect(fmtChange(-3.7).cls).toBe('text-error');
  });

  it('returns no sign prefix for negative values (already has minus)', () => {
    expect(fmtChange(-8.5).label).toBe('-8.5%');
  });

  it('treats zero as positive', () => {
    const result = fmtChange(0);
    expect(result.label).toBe('+0.0%');
    expect(result.cls).toBe('text-secondary');
  });
});

describe('txTypeLabel', () => {
  it('returns Sandwiched for SANDWICH_SINGLE', () => {
    expect(txTypeLabel(MevType.SANDWICH_SINGLE)).toEqual({
      label: 'Sandwiched',
      cls: 'text-vigil-red',
    });
  });

  it('returns Sandwiched for SANDWICH_WIDE', () => {
    expect(txTypeLabel(MevType.SANDWICH_WIDE).label).toBe('Sandwiched');
  });

  it('returns Sandwiched for SANDWICH_AUTH_HOP', () => {
    expect(txTypeLabel(MevType.SANDWICH_AUTH_HOP).label).toBe('Sandwiched');
  });

  it('returns Backrun for BACKRUN', () => {
    expect(txTypeLabel(MevType.BACKRUN)).toEqual({
      label: 'Backrun',
      cls: 'text-accent-yellow',
    });
  });

  it('returns JIT for JIT_LIQUIDITY', () => {
    expect(txTypeLabel(MevType.JIT_LIQUIDITY).label).toBe('JIT');
  });

  it('returns Liquidation for LIQUIDATION', () => {
    expect(txTypeLabel(MevType.LIQUIDATION).label).toBe('Liquidation');
  });

  it('returns Neutral for NONE', () => {
    expect(txTypeLabel(MevType.NONE)).toEqual({
      label: 'Neutral',
      cls: 'text-accent-green',
    });
  });
});

describe('getRiskColorHex', () => {
  it('returns #ef4444 for critical', () => {
    expect(getRiskColorHex('critical')).toBe('#ef4444');
  });

  it('returns #f97316 for high', () => {
    expect(getRiskColorHex('high')).toBe('#f97316');
  });

  it('returns #eab308 for medium', () => {
    expect(getRiskColorHex('medium')).toBe('#eab308');
  });

  it('returns #22c55e for low', () => {
    expect(getRiskColorHex('low')).toBe('#22c55e');
  });

  it('returns fallback #8892ab for unknown level', () => {
    expect(getRiskColorHex('unknown')).toBe('#8892ab');
  });

  it('returns fallback #8892ab for unrated', () => {
    expect(getRiskColorHex('unrated')).toBe('#8892ab');
  });
});
