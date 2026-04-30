import type { ReceiptSearchResult } from '@/lib/types';

export default function ReceiptSummaryCards({ result }: { result: ReceiptSearchResult }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 fade-up">
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
  );
}
