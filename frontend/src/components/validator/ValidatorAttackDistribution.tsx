import DonutChart from '@/components/DonutChart';
import TargetedPools from './TargetedPools';

export default function ValidatorAttackDistribution() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-[#0a0e1a] border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Attack Type Distribution</h2>
        <DonutChart />
      </div>
      <TargetedPools />
    </div>
  );
}
