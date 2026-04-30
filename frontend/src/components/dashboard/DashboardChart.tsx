import MevChart from '@/components/MevChart';

export default function DashboardChart() {
  return (
    <div className="bg-surface-100 border border-outline rounded-lg p-6 mb-8">
      <h2 className="font-display text-xl font-bold text-on-surf mb-6">MEV Extraction Over Time</h2>
      <MevChart />
    </div>
  );
}
