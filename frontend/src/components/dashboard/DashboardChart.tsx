import MevChart from '@/components/MevChart';
import type { TimeSeriesDataPoint } from '@/lib/types';

interface DashboardChartProps {
  timeseries: TimeSeriesDataPoint[];
}

export default function DashboardChart({ timeseries }: DashboardChartProps) {
  const labels = timeseries.map((dp) => {
    const d = new Date(dp.timestamp);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  });
  const dataValues = timeseries.map((dp) => dp.totalUsd);

  return (
    <section className="fade-up fade-up-d2 bg-surface-100 border border-outline/30 rounded-lg p-6">
      <header className="mb-5">
        <h2 className="font-display text-2xl font-bold text-white mb-1">
          Extraction over time
        </h2>
        <p className="text-sm text-vigil-muted">
          Hourly buckets for the last 24 hours.
        </p>
      </header>
      <MevChart labels={labels} dataValues={dataValues} />
    </section>
  );
}
