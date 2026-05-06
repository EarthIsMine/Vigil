import Link from 'next/link';
import type { ValidatorLeaderboardEntry } from '@/lib/types';

const RISK_BADGE_CLASS: Record<string, string> = {
  critical: 'text-error bg-error/10 border-error/40',
  high: 'text-error/80 bg-error/10 border-error/30',
  medium: 'text-warning bg-warning/10 border-warning/30',
  low: 'text-muted bg-surface-400 border-outline',
  unrated: 'text-muted bg-surface-400 border-outline',
};

interface ValidatorListProps {
  validators: ValidatorLeaderboardEntry[];
}

export default function ValidatorList({ validators }: ValidatorListProps) {
  if (validators.length === 0) {
    return (
      <div className="bg-surface-100 border border-outline rounded-lg p-12 text-center text-vigil-muted">
        No validators yet.
      </div>
    );
  }

  return (
    <div className="bg-surface-100 border border-outline rounded-lg overflow-hidden">
      <div className="hidden md:grid grid-cols-[60px_1fr_140px_100px_120px_140px] gap-4 px-6 py-3 bg-white/5 border-b border-outline text-xs font-mono uppercase tracking-wider text-vigil-muted">
        <span className="text-right">Rank</span>
        <span>Validator</span>
        <span>Client</span>
        <span className="text-right">Risk Score</span>
        <span className="text-center">Risk Level</span>
        <span className="text-right">Extracted</span>
      </div>
      <ul className="divide-y divide-outline">
        {validators.map((v) => {
          const badgeClass = RISK_BADGE_CLASS[v.riskLevel] ?? RISK_BADGE_CLASS.unrated;
          return (
            <li key={v.identity}>
              <Link
                href={`/validator/${encodeURIComponent(v.identity)}`}
                className="grid grid-cols-1 md:grid-cols-[60px_1fr_140px_100px_120px_140px] gap-4 px-6 py-4 hover:bg-white/[0.03] transition-colors"
              >
                <span className="hidden md:block text-right font-mono text-sm text-vigil-muted self-center">
                  #{v.rank}
                </span>
                <div className="min-w-0 self-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-on-surf truncate">{v.name}</span>
                    <span className="md:hidden text-xs font-mono text-vigil-muted">
                      #{v.rank}
                    </span>
                  </div>
                  <code
                    className="font-mono text-xs text-vigil-muted truncate block"
                    title={v.identity}
                  >
                    {v.identity.length > 20
                      ? `${v.identity.slice(0, 8)}...${v.identity.slice(-6)}`
                      : v.identity}
                  </code>
                </div>
                <span className="self-center font-mono text-xs text-secondary bg-sec-dim/40 px-2 py-1 rounded inline-block w-fit">
                  {v.client}
                </span>
                <span className="self-center text-right font-mono text-sm text-on-surf">
                  {v.riskScore}
                </span>
                <span className="self-center text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-mono font-bold border ${badgeClass}`}
                  >
                    {v.riskLevel.toUpperCase()}
                  </span>
                </span>
                <span className="self-center text-right font-mono text-sm font-semibold text-error">
                  {v.extractedUsd ?? '—'}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
