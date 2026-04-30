export default function DashboardHeader() {
  return (
    <div className="mb-8 fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-on-surf mb-2">Dashboard</h1>
          <p className="text-muted">Real-time MEV monitoring and analytics</p>
        </div>
        <select className="bg-surface-200 border border-outline rounded-lg px-4 py-2 text-on-surf text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary">
          <option>Last 24 hours</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>
    </div>
  );
}
