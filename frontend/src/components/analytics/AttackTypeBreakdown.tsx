import { TYPE_BREAKDOWN } from '@/lib/constants';

export default function AttackTypeBreakdown() {
  return (
    <div className="receipt-card p-6 rounded-xl border border-vigil-border-dark fade-up fade-up-d3">
      <h2 className="font-display font-bold text-lg text-white mb-6">Attack Type Breakdown</h2>
      <div className="space-y-5">
        {TYPE_BREAKDOWN.map((item) => (
          <div key={item.type}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-white font-medium">{item.type}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm text-vigil-muted">{item.count}</span>
                <span className="font-mono text-sm font-semibold" style={{ color: item.color }}>
                  {item.pct}%
                </span>
              </div>
            </div>
            <div className="h-2 bg-vigil-bg rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${item.pct}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-5 border-t border-vigil-border-dark">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-base text-vigil-muted">info</span>
          <span className="text-xs text-vigil-muted">
            Sandwich attacks carry the highest user impact (avg $58/victim). Backruns are typically benign arbitrage.
          </span>
        </div>
      </div>
    </div>
  );
}
