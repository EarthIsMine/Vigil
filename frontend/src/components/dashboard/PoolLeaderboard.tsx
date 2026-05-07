import type { PoolLeaderboardEntry } from '@/lib/types';

const POOL_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#22d3ee', '#3b82f6', '#a855f7'];

export default function PoolLeaderboard({ pools }: { pools: PoolLeaderboardEntry[] }) {
  const maxAttacks = pools.length > 0 ? pools[0].attacks : 1;

  return (
    <section className="fade-up fade-up-d3">
      <h2 className="font-display text-xl font-bold text-white mb-5">
        Most targeted pools
      </h2>

      {pools.length === 0 ? (
        <p className="text-sm text-vigil-muted py-4">No data yet.</p>
      ) : (
        <ul className="space-y-4">
          {pools.map((p, i) => (
            <li key={p.pool}>
              <div className="flex items-baseline justify-between text-sm mb-1.5">
                <span className="text-white truncate mr-3">
                  <span className="text-vigil-muted">{p.dex}</span>{' '}
                  <span className="font-mono text-xs">
                    {p.pool.length > 16 ? `${p.pool.slice(0, 8)}…${p.pool.slice(-4)}` : p.pool}
                  </span>
                </span>
                <span className="font-mono tabular-nums text-vigil-muted shrink-0">
                  {p.attacks.toLocaleString()}
                </span>
              </div>
              <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(p.attacks / maxAttacks) * 100}%`,
                    backgroundColor: POOL_COLORS[i % POOL_COLORS.length],
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
