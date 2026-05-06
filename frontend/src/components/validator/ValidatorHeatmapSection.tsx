import Heatmap from '@/components/Heatmap';
import type { MevAttack } from '@/lib/types';

interface Props {
  attacks: MevAttack[];
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function buildHeatmapData(attacks: MevAttack[]): number[][] {
  const grid = Array.from({ length: 7 }, () => Array(24).fill(0) as number[]);
  for (const atk of attacks) {
    const d = new Date(atk.timestamp);
    const day = (d.getDay() + 6) % 7; // Mon=0, Sun=6
    const hour = d.getHours();
    grid[day][hour]++;
  }
  return grid;
}

export default function ValidatorHeatmapSection({ attacks }: Props) {
  const heatmapData = attacks.length > 0 ? buildHeatmapData(attacks) : undefined;

  return (
    <section className="mb-14 fade-up fade-up-d3">
      <h2 className="font-display text-2xl font-bold text-white mb-1">Attack frequency</h2>
      <p className="text-sm text-vigil-muted mb-6">
        Attacks bucketed by day-of-week and hour, last {attacks.length.toLocaleString()} events.
      </p>
      <Heatmap data={heatmapData} days={DAYS} />
    </section>
  );
}
