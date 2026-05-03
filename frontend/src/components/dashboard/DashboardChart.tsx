import MevChart from '@/components/MevChart';
import type { TimeSeriesDataPoint } from '@/lib/types';

interface DashboardChartProps {
  timeseries: TimeSeriesDataPoint[];
}

export default function DashboardChart({ timeseries }: DashboardChartProps) {
  const labels = timeseries.map((dp) => {
    const d = new Date(dp.timestamp);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  });
  const dataValues = timeseries.map((dp) => dp.totalUsd);

  return (
    <div className="bg-surface-100 border border-outline rounded-lg p-6 mb-8 fade-up fade-up-d2">
      <h2 className="font-display text-xl font-bold text-on-surf mb-6">MEV Extraction Over Time</h2>
      <MevChart labels={labels} dataValues={dataValues} />
    </div>
  );
}
