import type { PoolLeaderboardEntry } from '@/lib/types';

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
          {pools.map((p) => (
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
                  className="h-full rounded-full bg-white/30"
                  style={{ width: `${(p.attacks / maxAttacks) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
