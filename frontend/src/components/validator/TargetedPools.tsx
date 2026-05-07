import type { PoolLeaderboardEntry } from '@/lib/types';

const POOL_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#22d3ee', '#3b82f6', '#a855f7'];

interface Props {
  pools: PoolLeaderboardEntry[];
}

export default function TargetedPools({ pools }: Props) {
  const maxVal = pools.length > 0 ? pools[0].attacks : 1;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-white mb-6">
        Most targeted pools
      </h2>
      <div className="space-y-5">
        {pools.map((pool, i) => (
          <div key={pool.pool}>
            <div className="flex items-baseline justify-between text-sm mb-2">
              <span className="text-white truncate mr-3" title={pool.pool}>
                <span className="text-vigil-muted">{pool.dex}</span>{' '}
                <span className="font-mono text-xs">
                  {pool.pool.length > 16
                    ? `${pool.pool.slice(0, 8)}…${pool.pool.slice(-4)}`
                    : pool.pool}
                </span>
              </span>
              <span className="font-mono tabular-nums text-vigil-muted shrink-0">
                {pool.attacks.toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(pool.attacks / maxVal) * 100}%`,
                  backgroundColor: POOL_COLORS[i % POOL_COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
        {pools.length === 0 && (
          <div className="text-sm text-vigil-muted py-4">No pool data yet</div>
        )}
      </div>
    </div>
  );
}
