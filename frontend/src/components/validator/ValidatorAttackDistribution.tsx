import DonutChart from '@/components/DonutChart';
import TargetedPools from './TargetedPools';
import type { MevAttack, PoolLeaderboardEntry } from '@/lib/types';

interface Props {
  attacks: MevAttack[];
  pools: PoolLeaderboardEntry[];
}

const TYPE_LABELS: Record<string, string> = {
  sandwich_single: 'Sandwich',
  sandwich_wide: 'Wide sandwich',
  sandwich_auth_hop: 'Auth hop',
  backrun: 'Backrun',
  liquidation: 'Liquidation',
  jit_liquidity: 'JIT liquidity',
};

const TYPE_COLORS: Record<string, string> = {
  sandwich_single: '#ef4444',
  sandwich_wide: '#f97316',
  sandwich_auth_hop: '#eab308',
  backrun: '#3b82f6',
  liquidation: '#a855f7',
  jit_liquidity: '#22c55e',
};

export default function ValidatorAttackDistribution({ attacks, pools }: Props) {
  const typeCounts: Record<string, number> = {};
  for (const atk of attacks) {
    typeCounts[atk.type] = (typeCounts[atk.type] || 0) + 1;
  }

  const entries = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const labels = entries.map(([t]) => TYPE_LABELS[t] ?? t);
  const data = entries.map(([, c]) => c);
  const colors = entries.map(([t]) => TYPE_COLORS[t] ?? '#8892ab');
  const total = data.reduce((a, b) => a + b, 0);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-14 fade-up fade-up-d4">
      <div>
        <h2 className="font-display text-2xl font-bold text-white mb-6">
          Attack types
        </h2>
        <DonutChart
          labels={labels.length > 0 ? labels : ['No data']}
          data={data.length > 0 ? data : [1]}
          colors={colors.length > 0 ? colors : ['#384460']}
          centerText={total.toLocaleString()}
          centerSubText="total"
        />
      </div>
      <TargetedPools pools={pools} />
    </section>
  );
}
