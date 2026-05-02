import LiveFeed from '@/components/LiveFeed';
import type { MevAttack } from '@/lib/types';

interface DashboardLiveFeedProps {
  attacks: MevAttack[];
}

export default function DashboardLiveFeed({ attacks }: DashboardLiveFeedProps) {
  return (
    <div className="bg-surface-100 border border-outline rounded-lg p-6 fade-up fade-up-d4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-on-surf">Recent Attacks Live Feed</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
          <span className="text-xs font-mono text-muted">Live</span>
        </div>
      </div>
      <LiveFeed attacks={attacks} />
    </div>
  );
}
