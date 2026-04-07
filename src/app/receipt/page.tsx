"use client";

import { useState } from "react";
import Link from "next/link";

export default function ReceiptPage() {
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const handleAnalyze = () => {
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 1400);
  };

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
              <Link
                href="/dashboard"
                className="nav-link px-3 py-1.5 text-sm font-medium rounded-md text-vigil-muted hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href="/receipt"
                className="nav-link px-3 py-1.5 text-sm font-medium rounded-md active text-vigil-accent"
              >
                MEV Receipt
              </Link>
              <Link
                href="/protection"
                className="nav-link px-3 py-1.5 text-sm font-medium rounded-md text-vigil-muted hover:text-white"
              >
                Protection
              </Link>
              <Link
                href="/analytics"
                className="nav-link px-3 py-1.5 text-sm font-medium rounded-md text-vigil-muted hover:text-white"
              >
                Analytics
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-vigil-card-dark rounded-lg transition">
              <span className="material-symbols-outlined text-xl text-vigil-muted">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-vigil-red rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-vigil-accent to-accent-cyan"></div>
          </div>
        </div>
      </nav>

      {/* Left Sidebar */}
      <aside className="fixed left-0 top-14 bottom-0 w-16 bg-vigil-card-dark border-r border-vigil-border-dark flex flex-col items-center py-6 gap-6 z-40">
        <Link href="/dashboard" className="p-3 rounded-lg hover:bg-vigil-accent/10 transition text-vigil-muted hover:text-white">
          <span className="material-symbols-outlined text-xl">dashboard</span>
        </Link>
        <Link href="/receipt" className="p-3 rounded-lg bg-vigil-accent/10 transition text-vigil-accent">
          <span className="material-symbols-outlined text-xl">receipt_long</span>
        </Link>
        <Link href="/protection" className="p-3 rounded-lg hover:bg-vigil-accent/10 transition text-vigil-muted hover:text-white">
          <span className="material-symbols-outlined text-xl">security</span>
        </Link>
        <Link href="/analytics" className="p-3 rounded-lg hover:bg-vigil-accent/10 transition text-vigil-muted hover:text-white">
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
        {!showResults ? (
          /* State 1: Search */
          <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6">
            <div className="max-w-2xl w-full text-center space-y-8 fade-up">
              <div className="flex justify-center mb-6 fade-up fade-up-d1">
                <div className="relative">
                  <div className="absolute inset-0 bg-vigil-accent/20 blur-3xl rounded-full"></div>
                  <div className="relative w-20 h-20 rounded-full bg-vigil-card-dark border-2 border-vigil-accent flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-vigil-accent">radar</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 fade-up fade-up-d2">
                <h1 className="font-display font-bold text-5xl tracking-tight">
                  TRACE YOUR IMPACT
                </h1>
                <p className="text-lg text-vigil-muted">
                  Enter a wallet address or transaction hash to analyze MEV extraction and generate your receipt
                </p>
              </div>

              <div className="space-y-4 fade-up fade-up-d3">
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                    placeholder="7xKp...mN4q or full transaction hash"
                    className="w-full px-6 py-4 bg-vigil-card-dark border-2 border-vigil-border-dark rounded-xl text-white placeholder:text-vigil-muted focus:outline-none focus:border-vigil-accent glow-blue transition font-mono text-sm"
                  />
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !query.trim()}
                  className="w-full py-4 bg-vigil-accent hover:bg-vigil-accent/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-display font-semibold text-white glow-blue-btn transition flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ANALYZING...
                    </>
                  ) : 'ANALYZE'}
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 pt-8 fade-up fade-up-d4">
                <div className="flex items-center gap-2 px-3 py-2 bg-vigil-card-dark/50 border border-vigil-border-dark rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-accent-green pulse-dot"></span>
                  <span className="text-xs font-mono text-vigil-muted">Solana Mainnet</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-vigil-card-dark/50 border border-vigil-border-dark rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-vigil-accent pulse-dot"></span>
                  <span className="text-xs font-mono text-vigil-muted">Devnet</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* State 2: Results */
          <div className="min-h-[calc(100vh-3.5rem)]">
            {/* Back Button + Mini Search */}
            <div className="sticky top-14 z-30 bg-vigil-bg/80 backdrop-blur-xl border-b border-vigil-border-dark px-6 py-4">
              <div className="flex items-center gap-4 max-w-7xl mx-auto">
                <button
                  onClick={() => setShowResults(false)}
                  className="p-2 hover:bg-vigil-card-dark rounded-lg transition"
                >
                  <span className="material-symbols-outlined text-xl text-vigil-muted">arrow_back</span>
                </button>
                <div className="flex-1 max-w-md">
                  <input
                    type="text"
                    value={query}
                    readOnly
                    className="w-full px-4 py-2 bg-vigil-card-dark border border-vigil-border-dark rounded-lg text-white font-mono text-sm focus:outline-none focus:border-vigil-accent transition"
                  />
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="flex gap-6 p-6 max-w-7xl mx-auto">
              {/* Left Column */}
              <div className="flex-1 space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 fade-up">
                  <div className="receipt-card p-4 rounded-xl border border-vigil-border-dark">
                    <div className="text-xs text-vigil-muted mb-2">Total MEV Lost</div>
                    <div className="font-display font-bold text-2xl text-white mb-1">0.428 SOL</div>
                    <div className="text-xs text-vigil-muted">$58.22</div>
                  </div>
                  <div className="receipt-card p-4 rounded-xl border border-vigil-border-dark">
                    <div className="text-xs text-vigil-muted mb-2">Attack Frequency</div>
                    <div className="font-display font-bold text-2xl text-vigil-red mb-1">HIGH</div>
                    <div className="text-xs text-vigil-muted">14/30d</div>
                  </div>
                  <div className="receipt-card p-4 rounded-xl border border-vigil-border-dark">
                    <div className="text-xs text-vigil-muted mb-2">Protection Rank</div>
                    <div className="font-display font-bold text-2xl text-accent-yellow mb-1">UNSHIELDED</div>
                    <div className="text-xs text-vigil-muted">Vulnerable</div>
                  </div>
                  <div className="receipt-card p-4 rounded-xl border border-vigil-border-dark">
                    <div className="text-xs text-vigil-muted mb-2">Last Scan</div>
                    <div className="font-display font-bold text-2xl text-accent-green mb-1">JUST NOW</div>
                    <div className="text-xs text-vigil-muted">Live</div>
                  </div>
                </div>

                {/* Transaction Table */}
                <div className="receipt-card p-6 rounded-xl border border-vigil-border-dark fade-up fade-up-d1">
                  <h2 className="font-display font-bold text-lg mb-4">Recent Transactions</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-3 bg-vigil-bg/50 rounded-lg border border-vigil-border-dark">
                      <div className="flex-1">
                        <div className="font-mono text-sm text-white mb-1">4nR8...xK2j</div>
                        <div className="text-xs text-vigil-muted">SOL → USDC swap</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm font-semibold text-vigil-red">-0.082 SOL</div>
                        <div className="text-xs text-vigil-red">Sandwiched</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-vigil-bg/50 rounded-lg border border-vigil-border-dark">
                      <div className="flex-1">
                        <div className="font-mono text-sm text-white mb-1">9mWz...pL5v</div>
                        <div className="text-xs text-vigil-muted">USDC transfer</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm font-semibold text-accent-green">0.000 SOL</div>
                        <div className="text-xs text-accent-green">Neutral</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-vigil-bg/50 rounded-lg border border-vigil-border-dark">
                      <div className="flex-1">
                        <div className="font-mono text-sm text-white mb-1">2bTf...hQ8n</div>
                        <div className="text-xs text-vigil-muted">RAY → SOL swap</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm font-semibold text-accent-yellow">-0.038 SOL</div>
                        <div className="text-xs text-accent-yellow">Frontrun</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="relative receipt-card p-8 rounded-xl border border-vigil-red/30 overflow-hidden fade-up fade-up-d2">
                  <div className="absolute inset-0 scan-line pointer-events-none"></div>
                  <div className="relative z-10 text-center space-y-4">
                    <h3 className="font-display font-bold text-2xl text-white">
                      STOP LEAKING VALUE
                    </h3>
                    <p className="text-vigil-muted max-w-md mx-auto">
                      You're losing money to MEV attacks. Activate protection to shield your transactions.
                    </p>
                    <button className="px-8 py-3 bg-accent-green hover:bg-accent-green/90 rounded-xl font-display font-semibold text-white transition">
                      ACTIVATE SHIELD
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Receipt Sidebar */}
              <div className="w-96 space-y-6">
                <div className="sticky top-32">
                  <div className="glass receipt-card p-6 rounded-xl border border-vigil-border-dark fade-up fade-up-d3">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-2xl text-vigil-accent">receipt_long</span>
                          <h3 className="font-display font-bold text-lg">MEV RECEIPT</h3>
                        </div>
                        <div className="font-mono text-xs text-vigil-muted">#VGL-2026-0406-0817</div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-vigil-muted">Scan Time</span>
                        <span className="text-white font-mono">2026-04-06 08:17 UTC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-vigil-muted">TX Hash</span>
                        <span className="text-white font-mono">7xKp...mN4q</span>
                      </div>
                    </div>

                    <div className="receipt-dashed my-6"></div>

                    {/* Fee Breakdown */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-vigil-muted">Network Fee</span>
                        <span className="text-white font-mono">0.000285 SOL</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-vigil-muted">Extraction Type</span>
                        <span className="text-vigil-red font-semibold">Sandwich Attack</span>
                      </div>
                    </div>

                    <div className="receipt-dashed my-6"></div>

                    {/* Profit Distribution */}
                    <div className="space-y-4 mb-6">
                      <div className="text-sm font-semibold text-white mb-3">Profit Distribution</div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-vigil-muted">Attacker Profit</span>
                          <span className="text-vigil-red font-mono font-semibold">0.082 SOL</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-vigil-muted">Validator Tip</span>
                          <span className="text-accent-yellow font-mono font-semibold">0.038 SOL</span>
                        </div>
                      </div>

                      {/* Bar Chart */}
                      <div className="flex h-2 rounded-full overflow-hidden">
                        <div className="bg-vigil-red" style={{ width: "68%" }}></div>
                        <div className="bg-accent-yellow" style={{ width: "32%" }}></div>
                      </div>
                    </div>

                    <div className="receipt-dashed my-6"></div>

                    {/* Total */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-display font-bold text-white">Total Extraction</span>
                      <div className="text-right">
                        <div className="font-display font-bold text-xl text-white">0.120 SOL</div>
                        <div className="text-xs text-vigil-muted">$16.32</div>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="qr-placeholder w-32 h-32 mx-auto rounded-lg mb-6"></div>

                    {/* Share Button */}
                    <button className="w-full py-3 bg-vigil-accent hover:bg-vigil-accent/90 rounded-xl font-display font-semibold text-white transition">
                      Share Receipt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
