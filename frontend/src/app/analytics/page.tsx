'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MevChart from '@/components/MevChart';
import { getEpochSummary, getProtocolLeaderboard } from '@/lib/services/analytics';
import type { EpochSummary } from '@/lib/services/analytics';
import type { PoolLeaderboardEntry } from '@/lib/types';

const TYPE_BREAKDOWN = [
  { type: 'Sandwich', count: '4,247', pct: 52, color: '#ef4444' },
  { type: 'Backrun',  count: '2,891', pct: 35, color: '#3b82f6' },
  { type: 'Frontrun', count: '1,061', pct: 13, color: '#eab308' },
];

export default function AnalyticsPage() {
  const [epochs,    setEpochs]    = useState<EpochSummary[]>([]);
  const [protocols, setProtocols] = useState<PoolLeaderboardEntry[]>([]);

  useEffect(() => {
    Promise.all([getEpochSummary(), getProtocolLeaderboard()]).then(([e, p]) => {
      setEpochs(e);
      setProtocols(p);
    });
  }, []);

  const maxAttacks = protocols.reduce((m, p) => Math.max(m, p.attacks), 1);

  return (
    <div className="min-h-screen bg-vigil-bg text-white">
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
              <div className="font-display font-bold text-2xl text-white mb-1">
                {epochs.length > 0
                  ? epochs[0].extracted
                  : '$2.05M'}
              </div>
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
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
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
              {protocols.length === 0 ? (
                <div className="space-y-4 animate-pulse">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-8 bg-vigil-card-dark rounded" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {protocols.map((p, i) => (
                    <div key={p.pool}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-vigil-muted w-4">{i + 1}</span>
                          <span className="text-sm font-semibold text-white">{p.pool}</span>
                          <span className="text-xs text-vigil-muted">{p.dex}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xs text-vigil-muted">{p.attacks} attacks</span>
                          <span className="font-mono text-sm font-semibold text-vigil-red">{p.volumeLost}</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-vigil-bg rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-vigil-accent/60"
                          style={{ width: `${Math.round((p.attacks / maxAttacks) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Epoch-by-Epoch Table */}
          <div className="receipt-card rounded-xl border border-vigil-border-dark overflow-hidden mb-8 fade-up">
            <div className="p-6 border-b border-vigil-border-dark flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-white">Epoch Summary</h2>
              <span className="text-xs font-mono text-vigil-muted">
                {epochs.length > 0
                  ? `Epochs ${epochs[epochs.length - 1].epoch}–${epochs[0].epoch}`
                  : 'Loading...'}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-vigil-bg/50">
                  <tr>
                    {['Epoch', 'Extracted', 'Sandwich', 'Frontrun', 'Backrun', 'Dominant Client'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-mono font-semibold text-vigil-muted uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-vigil-border-dark">
                  {epochs.length === 0
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: 6 }).map((__, j) => (
                            <td key={j} className="px-5 py-4">
                              <div className="h-4 bg-vigil-card-dark rounded animate-pulse" />
                            </td>
                          ))}
                        </tr>
                      ))
                    : epochs.map((row) => (
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
                              {row.dominantClient}
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
