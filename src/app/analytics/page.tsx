'use client';

import Link from 'next/link';
import MevChart from '@/components/MevChart';

const EPOCH_DATA = [
  { epoch: 642, extracted: '$2.14M', sandwich: 847, frontrun: 312, backrun: 1204, dominant: 'Jito-Agave' },
  { epoch: 641, extracted: '$1.98M', sandwich: 791, frontrun: 287, backrun: 1089, dominant: 'Jito-Agave' },
  { epoch: 640, extracted: '$2.31M', sandwich: 903, frontrun: 341, backrun: 1347, dominant: 'Firedancer' },
  { epoch: 639, extracted: '$1.77M', sandwich: 712, frontrun: 263, backrun: 987, dominant: 'Jito-Agave' },
  { epoch: 638, extracted: '$2.05M', sandwich: 834, frontrun: 309, backrun: 1156, dominant: 'Agave' },
];

const PROTOCOL_DATA = [
  { name: 'Orca', attacks: 1247, lost: '$892K', pct: 100 },
  { name: 'Raydium', attacks: 982, lost: '$743K', pct: 79 },
  { name: 'Meteora', attacks: 856, lost: '$621K', pct: 69 },
  { name: 'Phoenix', attacks: 734, lost: '$558K', pct: 59 },
  { name: 'Lifinity', attacks: 621, lost: '$492K', pct: 50 },
  { name: 'Jupiter', attacks: 543, lost: '$411K', pct: 44 },
];

const TYPE_BREAKDOWN = [
  { type: 'Sandwich', count: '4,247', pct: 52, color: '#ef4444' },
  { type: 'Backrun', count: '2,891', pct: 35, color: '#3b82f6' },
  { type: 'Frontrun', count: '1,061', pct: 13, color: '#eab308' },
];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-vigil-bg text-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-vigil-card-dark/80 backdrop-blur-xl border-b border-vigil-border-dark">
        <div className="flex items-center justify-between h-14 px-5">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg">shield</span>
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-white">VIGIL</span>
              <span className="px-1.5 py-0.5 bg-vigil-accent/20 border border-vigil-accent/30 rounded text-[10px] font-mono font-semibold text-vigil-accent">
                BETA
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-1 ml-4">
              <Link href="/dashboard" className="nav-link px-3 py-1.5 text-sm font-medium rounded-md text-vigil-muted hover:text-white">
                Dashboard
              </Link>
              <Link href="/receipt" className="nav-link px-3 py-1.5 text-sm font-medium rounded-md text-vigil-muted hover:text-white">
                MEV Receipt
              </Link>
              <Link href="/protection" className="nav-link px-3 py-1.5 text-sm font-medium rounded-md text-vigil-muted hover:text-white">
                Protection
              </Link>
              <Link href="/analytics" className="nav-link px-3 py-1.5 text-sm font-medium rounded-md active text-vigil-accent">
                Analytics
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-accent-green/10 border border-accent-green/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-accent-green pulse-dot"></span>
              <span className="text-xs font-mono text-accent-green">Epoch 642</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-vigil-accent to-accent-cyan"></div>
          </div>
        </div>
      </nav>

      {/* Left Sidebar */}
      <aside className="fixed left-0 top-14 bottom-0 w-16 bg-vigil-card-dark border-r border-vigil-border-dark flex flex-col items-center py-6 gap-6 z-40">
        <Link href="/dashboard" className="p-3 rounded-lg hover:bg-vigil-accent/10 transition text-vigil-muted hover:text-white">
          <span className="material-symbols-outlined text-xl">dashboard</span>
        </Link>
        <Link href="/receipt" className="p-3 rounded-lg hover:bg-vigil-accent/10 transition text-vigil-muted hover:text-white">
          <span className="material-symbols-outlined text-xl">receipt_long</span>
        </Link>
        <Link href="/protection" className="p-3 rounded-lg hover:bg-vigil-accent/10 transition text-vigil-muted hover:text-white">
          <span className="material-symbols-outlined text-xl">security</span>
        </Link>
        <Link href="/analytics" className="p-3 rounded-lg bg-vigil-accent/10 transition text-vigil-accent">
          <span className="material-symbols-outlined text-xl">analytics</span>
        </Link>
        <div className="mt-auto">
          <button className="p-3 rounded-lg hover:bg-vigil-accent/10 transition text-vigil-muted hover:text-white">
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-16 pt-14">
        <div className="p-6 max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 fade-up">
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

          {/* Hero Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-up fade-up-d1">
            <div className="receipt-card p-5 rounded-xl border border-vigil-border-dark">
              <div className="text-xs text-vigil-muted mb-2 font-mono uppercase tracking-wider">Total Extracted</div>
              <div className="font-display font-bold text-2xl text-white mb-1">$10.25M</div>
              <div className="text-xs text-vigil-red font-mono">+8.3% vs prev period</div>
            </div>
            <div className="receipt-card p-5 rounded-xl border border-vigil-border-dark">
              <div className="text-xs text-vigil-muted mb-2 font-mono uppercase tracking-wider">Total Attacks</div>
              <div className="font-display font-bold text-2xl text-white mb-1">8,199</div>
              <div className="text-xs text-vigil-red font-mono">+5.1% vs prev period</div>
            </div>
            <div className="receipt-card p-5 rounded-xl border border-vigil-border-dark">
              <div className="text-xs text-vigil-muted mb-2 font-mono uppercase tracking-wider">Avg per Epoch</div>
              <div className="font-display font-bold text-2xl text-white mb-1">$2.05M</div>
              <div className="text-xs text-vigil-muted font-mono">~2 days / epoch</div>
            </div>
            <div className="receipt-card p-5 rounded-xl border border-vigil-border-dark">
              <div className="text-xs text-vigil-muted mb-2 font-mono uppercase tracking-wider">Validators Flagged</div>
              <div className="font-display font-bold text-2xl text-vigil-red mb-1">34</div>
              <div className="text-xs text-vigil-muted font-mono">of 1,809 active</div>
            </div>
          </div>

          {/* MEV Over Time */}
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

          {/* Two Column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* Attack Type Breakdown */}
            <div className="receipt-card p-6 rounded-xl border border-vigil-border-dark fade-up fade-up-d3">
              <h2 className="font-display font-bold text-lg text-white mb-6">Attack Type Breakdown</h2>
              <div className="space-y-5">
                {TYPE_BREAKDOWN.map((item) => (
                  <div key={item.type}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-white font-medium">{item.type}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-sm text-vigil-muted">{item.count}</span>
                        <span className="font-mono text-sm font-semibold" style={{ color: item.color }}>
                          {item.pct}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-vigil-bg rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-vigil-border-dark">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-base text-vigil-muted">info</span>
                  <span className="text-xs text-vigil-muted">
                    Sandwich attacks carry the highest user impact (avg $58/victim). Backruns are typically benign arbitrage.
                  </span>
                </div>
              </div>
            </div>

            {/* Most Targeted Protocols */}
            <div className="receipt-card p-6 rounded-xl border border-vigil-border-dark fade-up fade-up-d3">
              <h2 className="font-display font-bold text-lg text-white mb-6">Most Targeted Protocols</h2>
              <div className="space-y-4">
                {PROTOCOL_DATA.map((p, i) => (
                  <div key={p.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-vigil-muted w-4">{i + 1}</span>
                        <span className="text-sm font-semibold text-white">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs text-vigil-muted">{p.attacks} attacks</span>
                        <span className="font-mono text-sm font-semibold text-vigil-red">{p.lost}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-vigil-bg rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-vigil-accent/60"
                        style={{ width: `${p.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Epoch-by-Epoch Table */}
          <div className="receipt-card rounded-xl border border-vigil-border-dark overflow-hidden mb-8 fade-up">
            <div className="p-6 border-b border-vigil-border-dark flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-white">Epoch Summary</h2>
              <span className="text-xs font-mono text-vigil-muted">Epochs 638–642</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-vigil-bg/50">
                  <tr>
                    {['Epoch', 'Extracted', 'Sandwich', 'Frontrun', 'Backrun', 'Dominant Client'].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-mono font-semibold text-vigil-muted uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-vigil-border-dark">
                  {EPOCH_DATA.map((row) => (
                    <tr key={row.epoch} className="hover:bg-vigil-card-dark/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-mono text-sm text-vigil-accent">{row.epoch}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-sm font-semibold text-white">{row.extracted}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-sm text-vigil-red">{row.sandwich}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-sm text-vigil-yellow">{row.frontrun}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-sm text-vigil-muted">{row.backrun}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 bg-vigil-accent/10 border border-vigil-accent/20 rounded text-xs font-mono text-vigil-accent">
                          {row.dominant}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
