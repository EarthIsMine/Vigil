import StatCard from '@/components/shared/StatCard';
import { formatUsd, fmtChange } from '@/lib/format';
import type { DashboardStats } from '@/lib/types';

interface DashboardStatsGridProps {
  stats: DashboardStats;
}

export default function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  const extracted = fmtChange(stats.totalMevExtracted24h.changePercent);
  const attacks = fmtChange(stats.totalAttacks24h.changePercent);
  const avgLoss = fmtChange(stats.averageLossPerTx.changePercent);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 fade-up fade-up-d1">
      <StatCard title="MEV Extracted" value={formatUsd(stats.totalMevExtracted24h.usd)} change={extracted} />
      <StatCard title="Total Attacks" value={stats.totalAttacks24h.count.toLocaleString()} change={attacks} />
      <StatCard title="Active Attackers" value={stats.activeAttackers24h.count} subtitle={stats.activeAttackers24h.topAttacker} />
      <StatCard title="Avg Victim Loss" value={stats.averageLossPerTx.usd != null ? `$${stats.averageLossPerTx.usd.toFixed(2)}` : '—'} change={avgLoss} />
    </div>
  );
}
