import { describe, it, expect } from 'vitest';
import { seededRandom, getAttackCount, getColorClass, getHeatColor, generateHeatmapData } from '../heatmap-utils';

describe('seededRandom', () => {
  it('returns deterministic values for same seed', () => {
    expect(seededRandom(42)).toBe(seededRandom(42));
  });

  it('returns values between 0 and 1', () => {
    for (let i = 0; i < 100; i++) {
      const val = seededRandom(i);
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });
});

describe('getAttackCount', () => {
  it('returns consistent values for same inputs', () => {
    expect(getAttackCount(0, 12)).toBe(getAttackCount(0, 12));
  });

  it('returns higher counts during peak hours (13-21)', () => {
    const peakTotal = Array.from({ length: 9 }, (_, i) => getAttackCount(0, 13 + i))
      .reduce((s, v) => s + v, 0);
    const offPeakTotal = Array.from({ length: 9 }, (_, i) => getAttackCount(0, i))
      .reduce((s, v) => s + v, 0);
    expect(peakTotal).toBeGreaterThan(offPeakTotal);
  });

  it('returns lower counts on weekends (dayIndex >= 5)', () => {
    const weekdayTotal = Array.from({ length: 24 }, (_, h) => getAttackCount(0, h))
      .reduce((s, v) => s + v, 0);
    const weekendTotal = Array.from({ length: 24 }, (_, h) => getAttackCount(5, h))
      .reduce((s, v) => s + v, 0);
    expect(weekendTotal).toBeLessThan(weekdayTotal);
  });
});

describe('getHeatColor', () => {
  it('returns transparent for 0', () => expect(getHeatColor(0)).toBe('bg-white/[0.03]'));
  it('returns low opacity for small counts', () => expect(getHeatColor(10)).toBe('bg-red-500/10'));
  it('returns medium opacity for mid counts', () => expect(getHeatColor(30)).toBe('bg-red-500/20'));
  it('returns higher opacity for high counts', () => expect(getHeatColor(65)).toBe('bg-red-500/50'));
  it('returns highest opacity for very high', () => expect(getHeatColor(100)).toBe('bg-red-500/70'));
});

describe('getColorClass (deprecated alias)', () => {
  it('delegates to getHeatColor', () => expect(getColorClass(0)).toBe(getHeatColor(0)));
});

describe('generateHeatmapData', () => {
  it('generates 7x24 matrix by default', () => {
    const data = generateHeatmapData();
    expect(data).toHaveLength(7);
    data.forEach((row) => expect(row).toHaveLength(24));
  });

  it('generates custom size', () => {
    const data = generateHeatmapData(3, 12);
    expect(data).toHaveLength(3);
    data.forEach((row) => expect(row).toHaveLength(12));
  });
});
