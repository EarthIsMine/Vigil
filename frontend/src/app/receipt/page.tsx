"use client";

import { useState } from "react";
import Link from "next/link";
import { searchReceipts } from "@/lib/services/receipt";
import { MevType } from "@/lib/types";
import type { ReceiptSearchResult, MevReceipt, SandwichAttackDetail } from "@/lib/types";

function txTypeLabel(type: MevType): { label: string; cls: string } {
  switch (type) {
    case MevType.SANDWICH_SINGLE:
    case MevType.SANDWICH_WIDE:
    case MevType.SANDWICH_AUTH_HOP:
      return { label: 'Sandwiched', cls: 'text-vigil-red' };
    case MevType.BACKRUN:
      return { label: 'Backrun',    cls: 'text-accent-yellow' };
    case MevType.JIT_LIQUIDITY:
      return { label: 'JIT',        cls: 'text-accent-yellow' };
    case MevType.LIQUIDATION:
      return { label: 'Liquidation', cls: 'text-accent-yellow' };
    default:
      return { label: 'Neutral',    cls: 'text-accent-green' };
  }
}

export default function ReceiptPage() {
  const [showResults, setShowResults] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [query,       setQuery]       = useState('');
  const [result,      setResult]      = useState<ReceiptSearchResult | null>(null);

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchReceipts(query.trim());
      setResult(data);
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  // Pick the first sandwich receipt for the sidebar detail card
  const featuredReceipt: MevReceipt | null =
    result?.receipts.find((r) => r.mevAnalysis.detected) ?? result?.receipts[0] ?? null;

  const featuredSandwich: SandwichAttackDetail | null =
    featuredReceipt?.attackDetail.kind === 'sandwich'
      ? (featuredReceipt.attackDetail as SandwichAttackDetail)
      : null;

  return (
    <div className="min-h-screen bg-vigil-bg text-white">
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
                <h1 className="font-display font-bold text-5xl tracking-tight">TRACE YOUR IMPACT</h1>
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
                <button onClick={() => setShowResults(false)} className="p-2 hover:bg-vigil-card-dark rounded-lg transition">
                  <span className="material-symbols-outlined text-xl text-vigil-muted">arrow_back</span>
                </button>
                <div className="flex-1 max-w-md">
                  <input
                    type="text"
                    value={query}
                    readOnly
                    className="w-full px-4 py-2 bg-vigil-card-dark border border-vigil-border-dark rounded-lg text-white font-mono text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="flex gap-6 p-6 max-w-7xl mx-auto">
              {/* Left Column */}
              <div className="flex-1 space-y-6">
                {/* Summary Cards */}
                {result && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 fade-up">
                    <div className="receipt-card p-4 rounded-xl border border-vigil-border-dark">
                      <div className="text-xs text-vigil-muted mb-2">Total MEV Lost</div>
                      <div className="font-display font-bold text-2xl text-white mb-1">
                        {result.totalLossSol.toFixed(3)} SOL
                      </div>
                      <div className="text-xs text-vigil-muted">${result.totalLossUsd.toFixed(2)}</div>
                    </div>
                    <div className="receipt-card p-4 rounded-xl border border-vigil-border-dark">
                      <div className="text-xs text-vigil-muted mb-2">Attack Frequency</div>
                      <div className={`font-display font-bold text-2xl mb-1 ${
                        result.totalAttacked > 10 ? 'text-vigil-red' :
                        result.totalAttacked > 3  ? 'text-accent-yellow' : 'text-accent-green'
                      }`}>
                        {result.totalAttacked > 10 ? 'HIGH' : result.totalAttacked > 3 ? 'MED' : 'LOW'}
                      </div>
                      <div className="text-xs text-vigil-muted">{result.totalAttacked}/{result.totalTxScanned} txs</div>
                    </div>
                    <div className="receipt-card p-4 rounded-xl border border-vigil-border-dark">
                      <div className="text-xs text-vigil-muted mb-2">Avg Loss / Attack</div>
                      <div className="font-display font-bold text-2xl text-accent-yellow mb-1">
                        ${result.avgLossPerTx.toFixed(2)}
                      </div>
                      <div className="text-xs text-vigil-muted">per transaction</div>
                    </div>
                    <div className="receipt-card p-4 rounded-xl border border-vigil-border-dark">
                      <div className="text-xs text-vigil-muted mb-2">TXs Scanned</div>
                      <div className="font-display font-bold text-2xl text-accent-green mb-1">
                        {result.totalTxScanned}
                      </div>
                      <div className="text-xs text-vigil-muted">total transactions</div>
                    </div>
                  </div>
                )}

                {/* Transaction Table */}
                <div className="receipt-card p-6 rounded-xl border border-vigil-border-dark fade-up fade-up-d1">
                  <h2 className="font-display font-bold text-lg mb-4">Recent Transactions</h2>
                  <div className="space-y-3">
                    {result?.receipts.map((r) => {
                      const { label, cls } = txTypeLabel(r.mevAnalysis.type);
                      const lossAmt = r.mevAnalysis.loss.lossAmount;
                      return (
                        <div key={r.receiptId} className="flex items-center gap-4 p-3 bg-vigil-bg/50 rounded-lg border border-vigil-border-dark">
                          <div className="flex-1">
                            <div className="font-mono text-sm text-white mb-1">{r.txSignature}</div>
                            <div className="text-xs text-vigil-muted">
                              {r.victim.tokenIn.symbol} → {r.victim.tokenOut.symbol} swap · {r.victim.dex}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-mono text-sm font-semibold ${cls}`}>
                              {lossAmt > 0 ? `-${lossAmt.toFixed(3)} ${r.victim.tokenOut.symbol}` : '0.000'}
                            </div>
                            <div className={`text-xs ${cls}`}>{label}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="relative receipt-card p-8 rounded-xl border border-vigil-red/30 overflow-hidden fade-up fade-up-d2">
                  <div className="absolute inset-0 scan-line pointer-events-none"></div>
                  <div className="relative z-10 text-center space-y-4">
                    <h3 className="font-display font-bold text-2xl text-white">STOP LEAKING VALUE</h3>
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
                        <div className="font-mono text-xs text-vigil-muted">
                          #{featuredReceipt?.receiptId ?? '—'}
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-vigil-muted">Scan Time</span>
                        <span className="text-white font-mono">
                          {featuredReceipt
                            ? new Date(featuredReceipt.timestamp).toUTCString().slice(5, 22) + ' UTC'
                            : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-vigil-muted">TX Hash</span>
                        <span className="text-white font-mono">{featuredReceipt?.txSignature ?? '—'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-vigil-muted">Validator Risk</span>
                        <span className="font-mono capitalize" style={{
                          color: featuredReceipt?.validator.riskLevel === 'critical' ? '#ef4444' :
                                 featuredReceipt?.validator.riskLevel === 'high'     ? '#f97316' :
                                 featuredReceipt?.validator.riskLevel === 'medium'   ? '#eab308' : '#22c55e'
                        }}>
                          {featuredReceipt?.validator.riskLevel ?? '—'}
                        </span>
                      </div>
                    </div>

                    <div className="receipt-dashed my-6"></div>

                    {/* Fee Breakdown */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-vigil-muted">Extraction Type</span>
                        <span className={`font-semibold ${txTypeLabel(featuredReceipt?.mevAnalysis.type ?? MevType.NONE).cls}`}>
                          {txTypeLabel(featuredReceipt?.mevAnalysis.type ?? MevType.NONE).label}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-vigil-muted">Confidence</span>
                        <span className="text-white font-mono capitalize">
                          {featuredReceipt?.mevAnalysis.loss.confidence ?? '—'}
                        </span>
                      </div>
                    </div>

                    <div className="receipt-dashed my-6"></div>

                    {/* Profit Distribution */}
                    <div className="space-y-4 mb-6">
                      <div className="text-sm font-semibold text-white mb-3">Extraction Detail</div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-vigil-muted">Attacker Profit</span>
                          <span className="text-vigil-red font-mono font-semibold">
                            {featuredSandwich
                              ? `${featuredSandwich.attackerProfit.toFixed(3)} SOL`
                              : featuredReceipt?.attackDetail.kind === 'other'
                                ? `${featuredReceipt.attackDetail.attackerProfit.toFixed(3)} SOL`
                                : '—'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-vigil-muted">Your Loss</span>
                          <span className="text-vigil-red font-mono font-semibold">
                            {featuredReceipt
                              ? `${featuredReceipt.mevAnalysis.loss.lossAmount.toFixed(3)} ${featuredReceipt.victim.tokenOut.symbol}`
                              : '—'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="receipt-dashed my-6"></div>

                    {/* Total */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-display font-bold text-white">Total Loss</span>
                      <div className="text-right">
                        <div className="font-display font-bold text-xl text-white">
                          {result ? `${result.totalLossSol.toFixed(3)} SOL` : '—'}
                        </div>
                        <div className="text-xs text-vigil-muted">
                          {result ? `$${result.totalLossUsd.toFixed(2)}` : ''}
                        </div>
                      </div>
                    </div>

                    {/* QR Placeholder */}
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
