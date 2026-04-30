import type { EpochSummary } from '@/lib/types';

interface AnalyticsStatsGridProps {
  epochs: EpochSummary[];
}

const STATS = [
  { label: 'Total Extracted', value: '$10.25M', sub: '+8.3% vs prev period', subCls: 'text-vigil-red' },
  { label: 'Total Attacks', value: '8,199', sub: '+5.1% vs prev period', subCls: 'text-vigil-red' },
  { label: 'Validators Flagged', value: '34', sub: 'of 1,809 active', subCls: 'text-vigil-muted' },
];

export default function AnalyticsStatsGrid({ epochs }: AnalyticsStatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-up fade-up-d1">
      {STATS.slice(0, 2).map((s) => (
        <div key={s.label} className="receipt-card p-5 rounded-xl border border-vigil-border-dark">
          <div className="text-xs text-vigil-muted mb-2 font-mono uppercase tracking-wider">{s.label}</div>
          <div className="font-display font-bold text-2xl text-white mb-1">{s.value}</div>
          <div className={`text-xs ${s.subCls} font-mono`}>{s.sub}</div>
        </div>
      ))}
      <div className="receipt-card p-5 rounded-xl border border-vigil-border-dark">
        <div className="text-xs text-vigil-muted mb-2 font-mono uppercase tracking-wider">Avg per Epoch</div>
        <div className="font-display font-bold text-2xl text-white mb-1">
          {epochs.length > 0 ? epochs[0].extracted : '$2.05M'}
        </div>
        <div className="text-xs text-vigil-muted font-mono">~2 days / epoch</div>
      </div>
      <div className="receipt-card p-5 rounded-xl border border-vigil-border-dark">
        <div className="text-xs text-vigil-muted mb-2 font-mono uppercase tracking-wider">{STATS[2].label}</div>
        <div className="font-display font-bold text-2xl text-vigil-red mb-1">{STATS[2].value}</div>
        <div className="text-xs text-vigil-muted font-mono">{STATS[2].sub}</div>
      </div>
    </div>
  );
}
