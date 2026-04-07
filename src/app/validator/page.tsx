"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Heatmap from '@/components/Heatmap';
import DonutChart from '@/components/DonutChart';
import { getValidatorDetail } from '@/lib/services/validator';
import type { ValidatorDetail } from '@/lib/types';

const RISK_COLOR: Record<string, string> = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#eab308',
  low:      '#22c55e',
};

export default function ValidatorPage() {
  const [validator, setValidator] = useState<ValidatorDetail | null>(null);

  useEffect(() => {
    // identity would come from route params in a full implementation
    getValidatorDetail('StKHse...7Qx4p').then(setValidator);
  }, []);

  const riskColor = validator ? (RISK_COLOR[validator.riskLevel] ?? '#8892ab') : '#8892ab';

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Nav Bar */}
      <nav className="fixed top-0 left-0 right-0 h-14 bg-[#0a0e1a] border-b border-white/10 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#3b82f6] rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg">security</span>
              </div>
              <span className="font-bold text-xl">VIGIL</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-[#8892ab] hover:text-white transition-colors">Dashboard</Link>
              <Link href="/validator" className="text-white font-medium">Validators</Link>
              <Link href="/protection" className="text-[#8892ab] hover:text-white transition-colors">Protection</Link>
              <Link href="/receipt" className="text-[#8892ab] hover:text-white transition-colors">Receipts</Link>
              <Link href="/api-docs" className="text-[#8892ab] hover:text-white transition-colors">API</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-[#22c55e]/20 text-[#22c55e] rounded text-xs font-medium">MAINNET-BETA</span>
            <span className="text-[#8892ab] text-sm">Epoch 642</span>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed left-0 top-14 w-[220px] h-[calc(100vh-3.5rem)] bg-[#0a0e1a] border-r border-white/10 flex flex-col">
        <div className="flex-1 p-4">
          <div className="mb-6">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded mb-4">
              <span className="material-symbols-outlined text-lg" style={{ color: riskColor }}>warning</span>
              <span className="font-medium text-sm">{validator?.name ?? '...'}</span>
            </div>
          </div>
          <nav className="space-y-1">
            <Link href="#overview"        className="block px-3 py-2 text-sm text-white bg-white/5 rounded">Overview</Link>
            <Link href="#attack-vectors"  className="block px-3 py-2 text-sm text-[#8892ab] hover:text-white hover:bg-white/5 rounded transition-colors">Attack Vectors</Link>
            <Link href="#targeted-pools"  className="block px-3 py-2 text-sm text-[#8892ab] hover:text-white hover:bg-white/5 rounded transition-colors">Targeted Pools</Link>
            <Link href="#telemetry"       className="block px-3 py-2 text-sm text-[#8892ab] hover:text-white hover:bg-white/5 rounded transition-colors">Telemetry</Link>
          </nav>
        </div>
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-[#8892ab] mb-2">Risk Assessment</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold" style={{ color: riskColor }}>
              {validator?.riskScore ?? '—'}
            </span>
            <span className="text-sm text-[#8892ab]">/100</span>
          </div>
          <div className="h-2 bg-[#0a0e1a] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: validator ? `${validator.riskScore}%` : '0%',
                background: `linear-gradient(to right, ${riskColor}, ${riskColor}aa)`,
              }}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-14 lg:pl-[220px]">
        <div className="p-6 max-w-[1600px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#8892ab] mb-6">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <span>&gt;</span>
            <Link href="/validator" className="hover:text-white transition-colors">Validators</Link>
            <span>&gt;</span>
            <span className="text-white">{validator?.name ?? '...'}</span>
          </div>

          {/* Header Card */}
          <div
            className="bg-[#0a0e1a] rounded-lg p-6 mb-6 relative overflow-hidden border"
            style={{ borderColor: `${riskColor}4d` }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: `${riskColor}0d` }} />
            <div className="relative">
              {validator === null ? (
                <div className="animate-pulse space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/10 rounded-lg" />
                    <div className="space-y-2">
                      <div className="h-6 w-48 bg-white/10 rounded" />
                      <div className="h-4 w-32 bg-white/10 rounded" />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ background: `${riskColor}33` }}>
                        <span className="material-symbols-outlined text-3xl" style={{ color: riskColor }}>gpp_bad</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h1 className="text-2xl font-bold">{validator.name}</h1>
                          <span className="px-2 py-1 rounded text-xs font-bold" style={{ background: `${riskColor}33`, color: riskColor }}>
                            {validator.riskLevel.toUpperCase()}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-[#8892ab]">Vote Account:</span>
                            <span className="font-mono">{validator.voteAccount}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-[#8892ab]">Identity:</span>
                            <span className="font-mono">{validator.identity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded transition-colors">
                        <span className="material-symbols-outlined text-sm">share</span>
                      </button>
                      <button className="px-4 py-2 hover:opacity-80 rounded transition-colors" style={{ background: `${riskColor}33`, color: riskColor }}>
                        <span className="material-symbols-outlined text-sm">flag</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="px-3 py-1 bg-white/5 rounded text-sm">
                      <span className="text-[#8892ab]">Stake:</span> <span className="font-medium">{validator.stake}</span>
                    </div>
                    <div className="px-3 py-1 bg-white/5 rounded text-sm">
                      <span className="text-[#8892ab]">Client:</span> <span className="font-medium">{validator.client}</span>
                    </div>
                    <div className="px-3 py-1 bg-white/5 rounded text-sm">
                      <span className="text-[#8892ab]">Commission:</span> <span className="font-medium">{validator.commission}%</span>
                    </div>
                    <div className="px-3 py-1 bg-white/5 rounded text-sm">
                      <span className="text-[#8892ab]">Active since:</span> <span className="font-medium">Epoch {validator.activeSinceEpoch}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Extracted Value',  value: validator?.metrics.totalExtractedUsd   ?? '...', color: '#ef4444' },
              { label: 'Sandwich Success Rate',  value: validator?.metrics.sandwichSuccessRate ?? '...', color: '#f97316' },
              { label: 'Targeted Protocols',     value: String(validator?.metrics.targetedProtocols ?? '...'), color: '#a855f7' },
              { label: 'Avg Response Time',      value: validator ? `${validator.metrics.avgResponseMs}ms` : '...', color: '#22d3ee' },
            ].map((s) => (
              <div key={s.label} className="bg-[#0a0e1a] border border-white/10 rounded-lg overflow-hidden">
                <div className="h-1" style={{ background: s.color }} />
                <div className="p-4">
                  <div className="text-[#8892ab] text-sm mb-1">{s.label}</div>
                  <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Attack Frequency Heatmap */}
          <div className="bg-[#0a0e1a] border border-white/10 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Attack Frequency Heatmap</h2>
            <Heatmap />
          </div>

          {/* Attack Distribution and Targeted Pools */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-[#0a0e1a] border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Attack Type Distribution</h2>
              <DonutChart />
            </div>

            <div className="bg-[#0a0e1a] border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Most Targeted Pools</h2>
              <div className="space-y-4">
                {[
                  { name: 'Orca SOL-USDC',      value: 1247, max: 1247, color: '#ef4444' },
                  { name: 'Raydium RAY-SOL',     value: 982,  max: 1247, color: '#f97316' },
                  { name: 'Meteora SOL-USDT',    value: 856,  max: 1247, color: '#eab308' },
                  { name: 'Orca BONK-SOL',       value: 734,  max: 1247, color: '#22c55e' },
                  { name: 'Lifinity mSOL-SOL',   value: 621,  max: 1247, color: '#22d3ee' },
                  { name: 'Orca JitoSOL-SOL',    value: 543,  max: 1247, color: '#3b82f6' },
                  { name: 'Marinade mSOL-SOL',   value: 487,  max: 1247, color: '#a855f7' },
                ].map((pool) => (
                  <div key={pool.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{pool.name}</span>
                      <span className="font-mono text-[#8892ab]">{pool.value}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${(pool.value / pool.max) * 100}%`, backgroundColor: pool.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Telemetry Table */}
          <div className="bg-[#0a0e1a] border border-white/10 rounded-lg overflow-hidden mb-6">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">Telemetry</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    {['Timestamp', 'Type', 'Pool', 'Victim TX', 'Extracted', 'Latency', 'Status'].map((h) => (
                      <th key={h} className={`px-6 py-3 text-xs font-medium text-[#8892ab] uppercase tracking-wider ${h === 'Extracted' || h === 'Latency' ? 'text-right' : h === 'Status' ? 'text-center' : 'text-left'}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {[
                    { time: '2026-04-07 14:23:45', type: 'Sandwich',    pool: 'Orca SOL-USDC',    tx: '5Kx...9pR', extracted: '$12,450', latency: '8ms',  status: 'success' },
                    { time: '2026-04-07 14:23:12', type: 'Backrun',     pool: 'Raydium RAY-SOL',  tx: '7mN...2kP', extracted: '$8,230',  latency: '11ms', status: 'success' },
                    { time: '2026-04-07 14:22:58', type: 'Sandwich',    pool: 'Meteora SOL-USDT', tx: '3Qw...8vL', extracted: '$15,680', latency: '9ms',  status: 'success' },
                    { time: '2026-04-07 14:22:34', type: 'Sandwich',    pool: 'Orca BONK-SOL',    tx: '9Rt...4jK', extracted: '$24,590', latency: '15ms', status: 'success' },
                    { time: '2026-04-07 14:22:01', type: 'Sandwich',    pool: 'Lifinity mSOL-SOL', tx: '2Yx...7nM', extracted: '$9,870',  latency: '10ms', status: 'failed'  },
                    { time: '2026-04-07 14:21:47', type: 'Backrun',     pool: 'Orca JitoSOL-SOL', tx: '6Zp...3hT', extracted: '$5,420',  latency: '13ms', status: 'success' },
                    { time: '2026-04-07 14:21:23', type: 'Sandwich',    pool: 'Marinade mSOL-SOL', tx: '8Lm...5qW', extracted: '$11,340', latency: '12ms', status: 'success' },
                    { time: '2026-04-07 14:20:59', type: 'Sandwich',    pool: 'Orca SOL-USDC',    tx: '4Bn...9xC', extracted: '$18,760', latency: '14ms', status: 'success' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-[#8892ab]">{row.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          row.type === 'Sandwich' ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-[#f97316]/20 text-[#f97316]'
                        }`}>{row.type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{row.pool}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-[#22d3ee]">{row.tx}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">{row.extracted}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-[#8892ab]">{row.latency}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          row.status === 'success' ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                        }`}>
                          <span className="material-symbols-outlined text-xs">
                            {row.status === 'success' ? 'check_circle' : 'cancel'}
                          </span>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-[#8892ab]">Showing 1–8 of 4,745 attacks</div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded transition-colors disabled:opacity-50" disabled>Previous</button>
              {[1, 2, 3].map((n) => (
                <button key={n} className={`px-3 py-1 rounded transition-colors ${n === 1 ? 'bg-[#3b82f6]' : 'bg-white/5 hover:bg-white/10'}`}>{n}</button>
              ))}
              <span className="px-3 py-1 text-[#8892ab]">...</span>
              <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded transition-colors">593</button>
              <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded transition-colors">Next</button>
            </div>
          </div>

          <footer className="border-t border-white/10 pt-6 text-center text-sm text-[#8892ab]">
            <p>VIGIL — Solana MEV Detection &amp; Protection</p>
            <p className="mt-2">Powered by real-time on-chain analysis</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
