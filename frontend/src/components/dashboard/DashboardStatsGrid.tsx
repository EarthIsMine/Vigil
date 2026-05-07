import { formatUsd } from '@/lib/format';
import type { DashboardStats } from '@/lib/types';

interface DashboardStatsGridProps {
  stats: DashboardStats;
}

function changeText(value: number | null): { text: string; cls: string } | null {
  if (value == null || !Number.isFinite(value)) return null;
  const sign = value > 0 ? '+' : '';
  const cls =
    value > 0 ? 'text-error' :
    value < 0 ? 'text-vigil-green' :
                'text-vigil-muted';
  return { text: `${sign}${value.toFixed(1)}% vs prior 24h`, cls };
}

export default function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  const items: { label: string; value: string; foot?: { text: string; cls: string } | null }[] = [
    {
      label: 'MEV extracted (24h)',
      value: formatUsd(stats.totalMevExtracted24h.usd),
      foot: changeText(stats.totalMevExtracted24h.changePercent),
    },
    {
      label: 'Attacks detected',
      value: stats.totalAttacks24h.count.toLocaleString(),
      foot: changeText(stats.totalAttacks24h.changePercent),
    },
    {
      label: 'Avg loss per victim',
      value:
        stats.averageLossPerTx.usd != null
          ? `$${stats.averageLossPerTx.usd.toFixed(2)}`
          : '—',
      foot: changeText(stats.averageLossPerTx.changePercent),
    },
    {
      label: 'Active attackers',
      value: stats.activeAttackers24h.count.toLocaleString(),
      foot: stats.activeAttackers24h.topAttacker
        ? { text: `top: ${stats.activeAttackers24h.topAttacker}`, cls: 'text-vigil-muted font-mono' }
        : null,
    },
  ];

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 border-y border-vigil-border py-8 mb-12 fade-up fade-up-d1">
      {items.map((s) => (
        <div key={s.label} className="border-l border-vigil-border pl-4">
          <p className="text-xs text-vigil-muted mb-2">{s.label}</p>
          <p className="font-display text-3xl font-bold text-white tabular-nums mb-2">
            {s.value}
          </p>
          {s.foot && (
            <p className={`text-xs ${s.foot.cls}`}>{s.foot.text}</p>
          )}
        </div>
      ))}
    </section>
  );
}
