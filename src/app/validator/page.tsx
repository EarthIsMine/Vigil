"use client";

import Link from 'next/link';
import Heatmap from '@/components/Heatmap';
import DonutChart from '@/components/DonutChart';

export default function ValidatorPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Nav Bar */}
      <nav className="fixed top-0 left-0 right-0 h-14 bg-[#0a0e1a] border-b border-white/10 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#3b82f6] rounded flex items-center justify-center">
                <span className="material-icons text-white text-lg">security</span>
              </div>
              <span className="font-bold text-xl">VIGIL</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-[#8892ab] hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/validator" className="text-white font-medium">
                Validators
              </Link>
              <Link href="/protection" className="text-[#8892ab] hover:text-white transition-colors">
                Protection
              </Link>
              <Link href="/receipt" className="text-[#8892ab] hover:text-white transition-colors">
                Receipts
              </Link>
              <Link href="/api-docs" className="text-[#8892ab] hover:text-white transition-colors">
                API
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-[#22c55e]/20 text-[#22c55e] rounded text-xs font-medium">
              MAINNET-BETA
            </span>
            <span className="text-[#8892ab] text-sm">Epoch 642</span>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed left-0 top-14 w-[220px] h-[calc(100vh-3.5rem)] bg-[#0a0e1a] border-r border-white/10 flex flex-col">
        <div className="flex-1 p-4">
          <div className="mb-6">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded mb-4">
              <span className="material-icons text-[#ef4444] text-lg">warning</span>
              <span className="font-medium text-sm">Stake House Capital</span>
            </div>
          </div>
          <nav className="space-y-1">
            <Link href="#overview" className="block px-3 py-2 text-sm text-white bg-white/5 rounded">
              Overview
            </Link>
            <Link href="#attack-vectors" className="block px-3 py-2 text-sm text-[#8892ab] hover:text-white hover:bg-white/5 rounded transition-colors">
              Attack Vectors
            </Link>
            <Link href="#targeted-pools" className="block px-3 py-2 text-sm text-[#8892ab] hover:text-white hover:bg-white/5 rounded transition-colors">
              Targeted Pools
            </Link>
            <Link href="#telemetry" className="block px-3 py-2 text-sm text-[#8892ab] hover:text-white hover:bg-white/5 rounded transition-colors">
              Telemetry
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-[#8892ab] mb-2">Risk Assessment</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-[#ef4444]">96</span>
            <span className="text-sm text-[#8892ab]">/100</span>
          </div>
          <div className="h-2 bg-[#0a0e1a] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: '96%',
                background: 'linear-gradient(to right, #ef4444, #f97316)'
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
            <span className="text-white">Stake House Capital</span>
          </div>

          {/* Header Card */}
          <div className="bg-[#0a0e1a] border border-[#ef4444]/30 rounded-lg p-6 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#ef4444]/5 pointer-events-none" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#ef4444]/20 rounded-lg flex items-center justify-center">
                    <span className="material-icons text-[#ef4444] text-3xl">gpp_bad</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold">Stake House Capital</h1>
                      <span className="px-2 py-1 bg-[#ef4444]/20 text-[#ef4444] rounded text-xs font-bold">
                        CRITICAL
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-[#8892ab]">Vote Account:</span>
                        <span className="font-mono">StKHse...7Qx4p</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-[#8892ab]">Identity:</span>
                        <span className="font-mono">4vJ8K...nM2wR</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded transition-colors">
                    <span className="material-icons text-sm">share</span>
                  </button>
                  <button className="px-4 py-2 bg-[#ef4444]/20 text-[#ef4444] hover:bg-[#ef4444]/30 rounded transition-colors">
                    <span className="material-icons text-sm">flag</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="px-3 py-1 bg-white/5 rounded text-sm">
                  <span className="text-[#8892ab]">Stake:</span> <span className="font-medium">2.1M SOL</span>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded text-sm">
                  <span className="text-[#8892ab]">Client:</span> <span className="font-medium">Jito-Agave</span>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded text-sm">
                  <span className="text-[#8892ab]">Commission:</span> <span className="font-medium">7%</span>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded text-sm">
                  <span className="text-[#8892ab]">Active since:</span> <span className="font-medium">Epoch 412</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="validator-stat-card stat-red">
              <div className="stat-bar" />
              <div className="p-4">
                <div className="text-[#8892ab] text-sm mb-1">Total Extracted Value</div>
                <div className="text-2xl font-bold">$4.2M</div>
              </div>
            </div>
            <div className="validator-stat-card stat-orange">
              <div className="stat-bar" />
              <div className="p-4">
                <div className="text-[#8892ab] text-sm mb-1">Sandwich Success Rate</div>
                <div className="text-2xl font-bold">98.4%</div>
              </div>
            </div>
            <div className="validator-stat-card stat-purple">
              <div className="stat-bar" />
              <div className="p-4">
                <div className="text-[#8892ab] text-sm mb-1">Targeted Protocols</div>
                <div className="text-2xl font-bold">142</div>
              </div>
            </div>
            <div className="validator-stat-card stat-cyan">
              <div className="stat-bar" />
              <div className="p-4">
                <div className="text-[#8892ab] text-sm mb-1">Avg Response Time</div>
                <div className="text-2xl font-bold">12.5ms</div>
              </div>
            </div>
          </div>

          {/* Attack Frequency Heatmap */}
          <div className="bg-[#0a0e1a] border border-white/10 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Attack Frequency Heatmap</h2>
            <Heatmap />
          </div>

          {/* Attack Distribution and Targeted Pools */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Attack Type Distribution */}
            <div className="bg-[#0a0e1a] border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Attack Type Distribution</h2>
              <DonutChart />
            </div>

            {/* Most Targeted Pools */}
            <div className="bg-[#0a0e1a] border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Most Targeted Pools</h2>
              <div className="space-y-4">
                {[
                  { name: 'Orca USDC-SOL', value: 1247, max: 1247, color: '#ef4444' },
                  { name: 'Raydium RAY-USDC', value: 982, max: 1247, color: '#f97316' },
                  { name: 'Meteora SOL-USDT', value: 856, max: 1247, color: '#eab308' },
                  { name: 'Phoenix BTC-USDC', value: 734, max: 1247, color: '#22c55e' },
                  { name: 'Lifinity ETH-SOL', value: 621, max: 1247, color: '#22d3ee' },
                  { name: 'Saber USDC-USDT', value: 543, max: 1247, color: '#3b82f6' },
                  { name: 'Marinade mSOL-SOL', value: 487, max: 1247, color: '#a855f7' }
                ].map((pool) => (
                  <div key={pool.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{pool.name}</span>
                      <span className="font-mono text-[#8892ab]">{pool.value}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(pool.value / pool.max) * 100}%`,
                          backgroundColor: pool.color
                        }}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#8892ab] uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#8892ab] uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#8892ab] uppercase tracking-wider">
                      Pool
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#8892ab] uppercase tracking-wider">
                      Victim TX
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#8892ab] uppercase tracking-wider">
                      Extracted
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#8892ab] uppercase tracking-wider">
                      Latency
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-[#8892ab] uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {[
                    { time: '2024-03-15 14:23:45', type: 'Sandwich', pool: 'Orca USDC-SOL', tx: '5Kx...9pR', extracted: '$12,450', latency: '8ms', status: 'success' },
                    { time: '2024-03-15 14:23:12', type: 'Arbitrage', pool: 'Raydium RAY-USDC', tx: '7mN...2kP', extracted: '$8,230', latency: '11ms', status: 'success' },
                    { time: '2024-03-15 14:22:58', type: 'Sandwich', pool: 'Meteora SOL-USDT', tx: '3Qw...8vL', extracted: '$15,680', latency: '9ms', status: 'success' },
                    { time: '2024-03-15 14:22:34', type: 'Liquidation', pool: 'Phoenix BTC-USDC', tx: '9Rt...4jK', extracted: '$24,590', latency: '15ms', status: 'success' },
                    { time: '2024-03-15 14:22:01', type: 'Sandwich', pool: 'Lifinity ETH-SOL', tx: '2Yx...7nM', extracted: '$9,870', latency: '10ms', status: 'failed' },
                    { time: '2024-03-15 14:21:47', type: 'Arbitrage', pool: 'Saber USDC-USDT', tx: '6Zp...3hT', extracted: '$5,420', latency: '13ms', status: 'success' },
                    { time: '2024-03-15 14:21:23', type: 'Sandwich', pool: 'Marinade mSOL-SOL', tx: '8Lm...5qW', extracted: '$11,340', latency: '12ms', status: 'success' },
                    { time: '2024-03-15 14:20:59', type: 'Liquidation', pool: 'Orca USDC-SOL', tx: '4Bn...9xC', extracted: '$18,760', latency: '14ms', status: 'success' }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-[#8892ab]">
                        {row.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          row.type === 'Sandwich' ? 'bg-[#ef4444]/20 text-[#ef4444]' :
                          row.type === 'Arbitrage' ? 'bg-[#f97316]/20 text-[#f97316]' :
                          'bg-[#a855f7]/20 text-[#a855f7]'
                        }`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {row.pool}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-[#22d3ee]">
                        {row.tx}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                        {row.extracted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-[#8892ab]">
                        {row.latency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          row.status === 'success' ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                        }`}>
                          <span className="material-icons text-xs">
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
            <div className="text-sm text-[#8892ab]">
              Showing 1-8 of 4,745 attacks
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Previous
              </button>
              <button className="px-3 py-1 bg-[#3b82f6] hover:bg-[#3b82f6]/80 rounded transition-colors">
                1
              </button>
              <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded transition-colors">
                2
              </button>
              <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded transition-colors">
                3
              </button>
              <span className="px-3 py-1 text-[#8892ab]">...</span>
              <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded transition-colors">
                593
              </button>
              <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded transition-colors">
                Next
              </button>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-white/10 pt-6 text-center text-sm text-[#8892ab]">
            <p>VIGIL - Solana MEV Detection & Protection</p>
            <p className="mt-2">Powered by real-time on-chain analysis</p>
          </footer>
        </div>
      </main>

      <style jsx>{`
        .validator-stat-card {
          background: #0a0e1a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          overflow: hidden;
          position: relative;
        }
        .stat-bar {
          height: 4px;
          width: 100%;
        }
        .stat-red .stat-bar {
          background: linear-gradient(to right, #ef4444, #dc2626);
        }
        .stat-orange .stat-bar {
          background: linear-gradient(to right, #f97316, #ea580c);
        }
        .stat-purple .stat-bar {
          background: linear-gradient(to right, #a855f7, #9333ea);
        }
        .stat-cyan .stat-bar {
          background: linear-gradient(to right, #22d3ee, #06b6d4);
        }
      `}</style>
    </div>
  );
}
