export default function AnalyticsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 fade-up">
      <div>
        <h1 className="font-display font-bold text-3xl text-white mb-1">Network Analytics</h1>
        <p className="text-sm text-vigil-muted">Solana MEV extraction · Epoch-level data</p>
      </div>
      <div className="flex items-center gap-3">
        <select className="bg-vigil-card-dark border border-vigil-border-dark rounded-lg px-4 py-2 text-white text-sm font-mono focus:outline-none focus:border-vigil-accent transition">
          <option>Last 7 epochs</option>
          <option>Last 30 epochs</option>
          <option>Last 90 days</option>
        </select>
      </div>
    </div>
  );
}
