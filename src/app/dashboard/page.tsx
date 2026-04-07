import Nav from '@/components/Nav';
import MevChart from '@/components/MevChart';
import LiveFeed from '@/components/LiveFeed';
import {
  getDashboardStats,
  getValidatorLeaderboard,
  getPoolLeaderboard,
} from '@/lib/services/dashboard';

function fmtUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(2)}`;
}

function fmtChange(pct: number | null): { label: string; cls: string } {
  if (pct === null) return { label: 'N/A', cls: 'text-muted' };
  const sign = pct >= 0 ? '+' : '';
  return {
    label: `${sign}${pct.toFixed(1)}%`,
    cls: pct >= 0 ? 'text-secondary' : 'text-error',
  };
}

export default async function DashboardPage() {
  const [stats, validators, pools] = await Promise.all([
    getDashboardStats(),
    getValidatorLeaderboard(),
    getPoolLeaderboard(),
  ]);

  const extracted = fmtChange(stats.totalMevExtracted24h.changePercent);
  const attacks   = fmtChange(stats.totalAttacks24h.changePercent);
  const avgLoss   = fmtChange(stats.averageLossPerTx.changePercent);

  return (
    <div className="min-h-screen bg-surface">
      <Nav />

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-56 bg-surface-100 border-r border-outline hidden lg:block overflow-y-auto">
        <div className="p-4 space-y-6">
          <nav className="space-y-1">
            <a href="#" className="block px-3 py-2 rounded-lg text-sm font-medium text-primary bg-primary-dim hover:bg-surface-300 transition-colors">
              Live Feed
            </a>
            <a href="#" className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surf hover:bg-surface-300 transition-colors">
              Top Extractors
            </a>
            <a href="#" className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surf hover:bg-surface-300 transition-colors">
              Searchers
            </a>
            <a href="#" className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surf hover:bg-surface-300 transition-colors">
              Network Health
            </a>
          </nav>

          <div>
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted uppercase tracking-wider">Filters</h3>
            <div className="space-y-2">
              {['Sandwich', 'Frontrun', 'Backrun'].map((f) => (
                <label key={f} className="flex items-center px-3 py-1.5 cursor-pointer hover:bg-surface-300 rounded-lg transition-colors">
                  <input type="checkbox" defaultChecked className="mr-2 w-4 h-4 accent-primary" />
                  <span className="text-sm text-on-surf">{f}</span>
                </label>
              ))}
              <label className="flex items-center px-3 py-1.5 cursor-pointer hover:bg-surface-300 rounded-lg transition-colors">
                <input type="checkbox" className="mr-2 w-4 h-4 accent-primary" />
                <span className="text-sm text-on-surf">Liquidation</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-outline">
            <a href="#" className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surf hover:bg-surface-300 transition-colors">
              Settings
            </a>
            <div className="px-3 mt-4">
              <span className="text-xs font-mono text-muted">v0.9.4-beta</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-56 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
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

          {/* Hero Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-surface-100 border border-outline rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-medium text-muted">MEV Extracted</h3>
                <span className={`text-xs font-mono ${extracted.cls}`}>{extracted.label}</span>
              </div>
              <p className="font-display text-3xl font-bold text-on-surf">
                {fmtUsd(stats.totalMevExtracted24h.usd)}
              </p>
            </div>

            <div className="bg-surface-100 border border-outline rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-medium text-muted">Total Attacks</h3>
                <span className={`text-xs font-mono ${attacks.cls}`}>{attacks.label}</span>
              </div>
              <p className="font-display text-3xl font-bold text-on-surf">
                {stats.totalAttacks24h.count.toLocaleString()}
              </p>
            </div>

            <div className="bg-surface-100 border border-outline rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-medium text-muted">Active Attackers</h3>
                <span className="text-xs font-mono text-muted">{stats.activeAttackers24h.topAttacker}</span>
              </div>
              <p className="font-display text-3xl font-bold text-on-surf">
                {stats.activeAttackers24h.count}
              </p>
            </div>

            <div className="bg-surface-100 border border-outline rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-medium text-muted">Avg Victim Loss</h3>
                <span className={`text-xs font-mono ${avgLoss.cls}`}>{avgLoss.label}</span>
              </div>
              <p className="font-display text-3xl font-bold text-on-surf">
                ${stats.averageLossPerTx.usd.toFixed(2)}
              </p>
            </div>
          </div>

          {/* MEV Chart */}
          <div className="bg-surface-100 border border-outline rounded-lg p-6 mb-8">
            <h2 className="font-display text-xl font-bold text-on-surf mb-6">MEV Extraction Over Time</h2>
            <MevChart />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Risky Validators Leaderboard */}
            <div className="bg-surface-100 border border-outline rounded-lg p-6">
              <h2 className="font-display text-xl font-bold text-on-surf mb-6">Risky Validators Leaderboard</h2>
              <div className="space-y-4">
                {validators.map((v) => (
                  <div key={v.rank} className="flex items-center gap-4 p-4 bg-surface-200 border border-outline rounded-lg hover:bg-surface-300 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary-dim rounded-full">
                      <span className="font-mono text-sm font-bold text-primary">{v.rank}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="font-mono text-sm text-on-surf">{v.identity}</code>
                        <span className="text-xs text-muted">•</span>
                        <span className="text-xs text-muted">{v.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs px-1.5 py-0.5 rounded text-secondary bg-sec-dim">
                          {v.client}
                        </span>
                        <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${
                          v.riskLevel === 'critical' ? 'text-error bg-error/10' :
                          v.riskLevel === 'high' ? 'text-error/70 bg-error/10' :
                          'text-muted bg-surface-400'
                        }`}>
                          {v.riskLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-mono font-semibold text-error">{v.extractedUsd}</p>
                      <p className="font-mono text-xs text-muted">Risk: {v.riskScore}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Targeted Pools */}
            <div className="bg-surface-100 border border-outline rounded-lg p-6">
              <h2 className="font-display text-xl font-bold text-on-surf mb-6">Most Targeted Pools</h2>
              <div className="space-y-4">
                {pools.map((p) => (
                  <div key={p.pool} className="p-4 bg-surface-200 border border-outline rounded-lg hover:bg-surface-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-mono font-semibold text-on-surf">{p.pool}</h3>
                        <p className="text-xs text-muted">{p.dex}</p>
                      </div>
                      <span className="text-xs font-mono text-secondary">{p.trend}</span>
                    </div>
                    <div className="flex items-center gap-6 mt-3">
                      <div>
                        <p className="text-xs text-muted mb-1">Attacks</p>
                        <p className="font-mono text-sm font-semibold text-error">{p.attacks}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted mb-1">Volume Lost</p>
                        <p className="font-mono text-sm font-semibold text-on-surf">{p.volumeLost}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Attacks Live Feed */}
          <div className="bg-surface-100 border border-outline rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-on-surf">Recent Attacks Live Feed</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                <span className="text-xs font-mono text-muted">Live</span>
              </div>
            </div>
            <LiveFeed />
          </div>
        </div>
      </main>
    </div>
  );
}
