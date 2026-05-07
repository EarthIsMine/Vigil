import Link from 'next/link';
import type { ValidatorLeaderboardEntry } from '@/lib/types';

const RISK_TEXT: Record<string, string> = {
  critical: 'text-error',
  high: 'text-warning',
  medium: 'text-yellow-500',
  low: 'text-vigil-muted',
  unrated: 'text-vigil-muted',
};

const RISK_BAR: Record<string, string> = {
  critical: 'bg-error',
  high: 'bg-warning',
  medium: 'bg-yellow-500',
  low: 'bg-vigil-muted/60',
  unrated: 'bg-vigil-muted/40',
};

const RISK_LABEL: Record<string, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  unrated: 'Unrated',
};

interface ValidatorListProps {
  validators: ValidatorLeaderboardEntry[];
}

export default function ValidatorList({ validators }: ValidatorListProps) {
  if (validators.length === 0) {
    return (
      <p className="text-sm text-vigil-muted py-12">No validators yet.</p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-vigil-muted text-left border-b border-vigil-border">
            <th className="font-normal py-3 pr-4 text-right w-12">#</th>
            <th className="font-normal py-3 pr-6">Validator</th>
            <th className="font-normal py-3 pr-6">Client</th>
            <th className="font-normal py-3 pr-6 text-right">Risk score</th>
            <th className="font-normal py-3 pr-6">Level</th>
            <th className="font-normal py-3 text-right">Extracted</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-vigil-border/60">
          {validators.map((v) => {
            const riskTextClass = RISK_TEXT[v.riskLevel] ?? RISK_TEXT.unrated;
            const riskBarClass = RISK_BAR[v.riskLevel] ?? RISK_BAR.unrated;
            const levelLabel = RISK_LABEL[v.riskLevel] ?? v.riskLevel;
            return (
              <tr key={v.identity} className="group hover:bg-white/[0.02] transition-colors">
                <td colSpan={6} className="p-0">
                  <Link
                    href={`/validator/${encodeURIComponent(v.identity)}`}
                    className="grid grid-cols-[48px_minmax(0,1fr)_140px_140px_120px_120px] items-center gap-4 px-2 py-3"
                  >
                    <span className="text-right font-mono text-vigil-muted text-xs tabular-nums">
                      {v.rank}
                    </span>

                    <div className="min-w-0">
                      <div className="text-white font-medium truncate group-hover:text-primary transition-colors">
                        {v.name}
                      </div>
                      <code
                        className="font-mono text-xs text-vigil-muted truncate block"
                        title={v.identity}
                      >
                        {v.identity.length > 20
                          ? `${v.identity.slice(0, 8)}…${v.identity.slice(-6)}`
                          : v.identity}
                      </code>
                    </div>

                    <span className="text-xs text-vigil-muted">{v.client}</span>

                    <div className="flex items-center gap-3">
                      <span className="font-mono tabular-nums text-white text-sm w-8 text-right">
                        {v.riskScore}
                      </span>
                      <div className="flex-1 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${riskBarClass} rounded-full`}
                          style={{ width: `${Math.max(2, v.riskScore)}%` }}
                        />
                      </div>
                    </div>

                    <span className={`text-sm ${riskTextClass}`}>{levelLabel}</span>

                    <span className="text-right font-mono text-sm tabular-nums text-white">
                      {v.extractedUsd ?? '—'}
                    </span>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
