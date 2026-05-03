import type { PoolLeaderboardEntry } from '@/lib/types';

export default function PoolLeaderboard({ pools }: { pools: PoolLeaderboardEntry[] }) {
  return (
    <div className="bg-surface-100 border border-outline rounded-lg p-6 fade-up fade-up-d3">
      <h2 className="font-display text-xl font-bold text-on-surf mb-6">Most Targeted Pools</h2>
      <div className="space-y-4">
        {pools.map((p) => (
          <div key={p.pool} className="p-4 bg-surface-200 border border-outline rounded-lg hover:bg-surface-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="min-w-0 flex-1 mr-3">
                <h3 className="font-mono font-semibold text-on-surf truncate" title={p.pool}>
                  {p.pool.slice(0, 8)}...{p.pool.slice(-4)}
                </h3>
                <p className="text-xs text-muted">{p.dex}</p>
              </div>
              <span className="text-xs font-mono text-secondary">{p.trend}</span>
            </div>
            <div className="flex items-center gap-6 mt-3">
              <div>
                <p className="text-xs text-muted mb-1">Attacks</p>
                <p className="font-mono text-sm font-semibold text-error">{p.attacks}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Volume Lost</p>
                <p className="font-mono text-sm font-semibold text-on-surf">{p.volumeLost}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
