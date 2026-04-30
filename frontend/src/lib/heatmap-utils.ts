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

export function getColorClass(count: number): string {
  if (count === 0) return 'bg-[#1a1f2e]';
  if (count < 25) return 'bg-[#ef4444]/20';
  if (count < 50) return 'bg-[#ef4444]/40';
  if (count < 75) return 'bg-[#ef4444]/60';
  return 'bg-[#ef4444]';
}

export function generateHeatmapData(days = 7, hours = 24): number[][] {
  return Array.from({ length: days }, (_, dayIndex) =>
    Array.from({ length: hours }, (_, hour) => getAttackCount(dayIndex, hour))
  );
}
