import { describe, it, expect } from 'vitest';
import { seededRandom, getAttackCount, getColorClass, generateHeatmapData } from '../heatmap-utils';

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

describe('getColorClass', () => {
  it('returns bg-[#1a1f2e] for 0', () => expect(getColorClass(0)).toBe('bg-[#1a1f2e]'));
  it('returns /20 for low counts', () => expect(getColorClass(10)).toContain('/20'));
  it('returns /40 for medium counts', () => expect(getColorClass(30)).toContain('/40'));
  it('returns /60 for high counts', () => expect(getColorClass(60)).toContain('/60'));
  it('returns full red for very high', () => expect(getColorClass(100)).toBe('bg-[#ef4444]'));
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
