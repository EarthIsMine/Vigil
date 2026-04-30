import type { PoolLeaderboardEntry } from '@/lib/types';

interface ProtocolLeaderboardProps {
  protocols: PoolLeaderboardEntry[];
  maxAttacks: number;
}

export default function ProtocolLeaderboard({ protocols, maxAttacks }: ProtocolLeaderboardProps) {
  return (
    <div className="receipt-card p-6 rounded-xl border border-vigil-border-dark fade-up fade-up-d3">
      <h2 className="font-display font-bold text-lg text-white mb-6">Most Targeted Protocols</h2>
      {protocols.length === 0 ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 bg-vigil-card-dark rounded" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {protocols.map((p, i) => (
            <div key={p.pool}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-vigil-muted w-4">{i + 1}</span>
                  <span className="text-sm font-semibold text-white">{p.pool}</span>
                  <span className="text-xs text-vigil-muted">{p.dex}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-vigil-muted">{p.attacks} attacks</span>
                  <span className="font-mono text-sm font-semibold text-vigil-red">{p.volumeLost}</span>
                </div>
              </div>
              <div className="h-1.5 bg-vigil-bg rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-vigil-accent/60"
                  style={{ width: `${Math.round((p.attacks / maxAttacks) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
