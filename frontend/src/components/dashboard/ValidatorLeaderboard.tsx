import type { ValidatorLeaderboardEntry } from '@/lib/types';

export default function ValidatorLeaderboard({ validators }: { validators: ValidatorLeaderboardEntry[] }) {
  return (
    <div className="bg-surface-100 border border-outline rounded-lg p-6">
      <h2 className="font-display text-xl font-bold text-on-surf mb-6">Risky Validators Leaderboard</h2>
      <div className="space-y-4">
        {validators.map((v) => (
          <div key={v.rank} className="flex items-center gap-4 p-4 bg-surface-200 border border-outline rounded-lg hover:bg-surface-300 transition-colors">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary-dim rounded-full">
              <span className="font-mono text-sm font-bold text-primary">{v.rank}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <code className="font-mono text-sm text-on-surf">{v.identity}</code>
                <span className="text-xs text-muted">•</span>
                <span className="text-xs text-muted">{v.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs px-1.5 py-0.5 rounded text-secondary bg-sec-dim">
                  {v.client}
                </span>
                <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${
                  v.riskLevel === 'critical' ? 'text-error bg-error/10' :
                  v.riskLevel === 'high' ? 'text-error/70 bg-error/10' :
                  'text-muted bg-surface-400'
                }`}>
                  {v.riskLevel.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="font-mono font-semibold text-error">{v.extractedUsd}</p>
              <p className="font-mono text-xs text-muted">Risk: {v.riskScore}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
