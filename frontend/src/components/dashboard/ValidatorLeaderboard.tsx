import Link from 'next/link';
import type { ValidatorLeaderboardEntry } from '@/lib/types';
import CopyAddressButton from '@/components/shared/CopyAddressButton';

const RISK_TEXT: Record<string, string> = {
  critical: 'text-error',
  high: 'text-warning',
  medium: 'text-yellow-500',
  low: 'text-vigil-muted',
  unrated: 'text-vigil-muted',
};

const RISK_LABEL: Record<string, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  unrated: 'Unrated',
};

export default function ValidatorLeaderboard({ validators }: { validators: ValidatorLeaderboardEntry[] }) {
  return (
    <section className="fade-up fade-up-d3 bg-surface-100 border border-outline/30 rounded-lg p-6">
      <header className="flex items-baseline justify-between mb-5">
        <h2 className="font-display text-xl font-bold text-white">
          Risky validators
        </h2>
        <Link
          href="/validator"
          className="text-xs text-vigil-muted hover:text-white transition-colors"
        >
          View all →
        </Link>
      </header>

      {validators.length === 0 ? (
        <p className="text-sm text-vigil-muted py-4">No data yet.</p>
      ) : (
        <ul className="divide-y divide-vigil-border/60">
          {validators.map((v) => {
            const riskCls = RISK_TEXT[v.riskLevel] ?? RISK_TEXT.unrated;
            return (
              <li key={v.identity}>
                <Link
                  href={`/validator/${encodeURIComponent(v.identity)}`}
                  className="grid grid-cols-[24px_minmax(0,1fr)_60px_80px] items-center gap-3 py-3 group hover:bg-white/[0.02] -mx-2 px-2 transition-colors"
                >
                  <span className="font-mono text-xs text-vigil-muted tabular-nums">
                    {v.rank}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate group-hover:text-primary transition-colors">
                      {v.name}
                    </p>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p className="text-xs text-vigil-muted truncate font-mono" title={v.identity}>
                        {v.identity.length > 14
                          ? `${v.identity.slice(0, 6)}…${v.identity.slice(-4)}`
                          : v.identity}
                      </p>
                      <CopyAddressButton address={v.identity} iconClassName="text-xs" />
                    </div>
                  </div>
                  <span className={`text-xs ${riskCls} text-right`}>
                    {RISK_LABEL[v.riskLevel] ?? v.riskLevel}
                  </span>
                  <span className="text-right font-mono tabular-nums text-sm text-white">
                    {v.extractedUsd ?? '—'}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
