export function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function getAttackCount(dayIndex: number, hour: number): number {
  const isWeekend = dayIndex >= 5;
  const isPeakHour = hour >= 13 && hour <= 21;

  const seed = dayIndex * 100 + hour;
  const baseRandom = seededRandom(seed);

  let multiplier = 1;
  if (isPeakHour) multiplier *= 2.5;
  if (isWeekend) multiplier *= 0.4;

  return Math.floor(baseRandom * 100 * multiplier);
}

export function getHeatColor(count: number): string {
  if (count === 0) return 'bg-on-surf/5';
  if (count < 20) return 'bg-red-500/25';
  if (count < 40) return 'bg-red-500/40';
  if (count < 60) return 'bg-red-500/55';
  if (count < 80) return 'bg-red-500/70';
  return 'bg-red-500/85';
}

/** @deprecated Use getHeatColor instead */
export function getColorClass(count: number): string {
  return getHeatColor(count);
}

export function generateHeatmapData(days = 7, hours = 24): number[][] {
  return Array.from({ length: days }, (_, dayIndex) =>
    Array.from({ length: hours }, (_, hour) => getAttackCount(dayIndex, hour))
  );
}
