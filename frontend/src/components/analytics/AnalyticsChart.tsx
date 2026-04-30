import MevChart from '@/components/MevChart';

export default function AnalyticsChart() {
  return (
    <div className="receipt-card p-6 rounded-xl border border-vigil-border-dark mb-8 fade-up fade-up-d2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-lg text-white">MEV Extraction Over Time</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-vigil-accent rounded-full pulse-dot"></div>
          <span className="text-xs font-mono text-vigil-muted">Live</span>
        </div>
      </div>
      <MevChart />
    </div>
  );
}
