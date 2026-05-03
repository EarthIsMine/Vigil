import type { PoolLeaderboardEntry } from '@/lib/types';

const POOL_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#22d3ee', '#3b82f6', '#a855f7'];

interface Props {
  pools: PoolLeaderboardEntry[];
}

export default function TargetedPools({ pools }: Props) {
  const maxVal = pools.length > 0 ? pools[0].attacks : 1;

  return (
    <div className="bg-[#0a0e1a] border border-white/10 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Most Targeted Pools</h2>
      <div className="space-y-4">
        {pools.map((pool, i) => (
          <div key={pool.pool}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>{pool.dex} — {pool.pool.slice(0, 8)}...{pool.pool.slice(-4)}</span>
              <span className="font-mono text-[#8892ab]">{pool.attacks}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(pool.attacks / maxVal) * 100}%`, backgroundColor: POOL_COLORS[i % POOL_COLORS.length] }}
              />
            </div>
          </div>
        ))}
        {pools.length === 0 && (
          <div className="text-sm text-[#8892ab] text-center py-4">No pool data yet</div>
        )}
      </div>
    </div>
  );
}
