import type { ReceiptSearchResult } from '@/lib/types';

function frequencyLabel(attacked: number): { label: string; cls: string } {
  if (attacked > 10) return { label: 'High frequency', cls: 'text-error' };
  if (attacked > 3) return { label: 'Medium frequency', cls: 'text-warning' };
  return { label: 'Low frequency', cls: 'text-vigil-muted' };
}

export default function ReceiptSummaryCards({ result }: { result: ReceiptSearchResult }) {
  const freq = frequencyLabel(result.totalAttacked);

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 border-y border-vigil-border py-8 fade-up">
      <div className="border-l border-vigil-border pl-4">
        <p className="text-xs text-vigil-muted mb-2">Total loss</p>
        <p className="font-display text-2xl font-bold text-white tabular-nums">
          {result.totalLossSol.toFixed(3)} SOL
        </p>
        <p className="text-xs text-vigil-muted mt-1.5">
          {result.totalLossUsd != null ? `$${result.totalLossUsd.toFixed(2)}` : '—'}
        </p>
      </div>

      <div className="border-l border-vigil-border pl-4">
        <p className="text-xs text-vigil-muted mb-2">Attack frequency</p>
        <p className="font-display text-2xl font-bold text-white tabular-nums">
          {result.totalAttacked}
          <span className="text-base text-vigil-muted font-normal">
            {' '}/ {result.totalTxScanned}
          </span>
        </p>
        <p className={`text-xs ${freq.cls} mt-1.5`}>{freq.label}</p>
      </div>

      <div className="border-l border-vigil-border pl-4">
        <p className="text-xs text-vigil-muted mb-2">Avg loss per attack</p>
        <p className="font-display text-2xl font-bold text-white tabular-nums">
          {result.avgLossPerTx != null ? `$${result.avgLossPerTx.toFixed(2)}` : '—'}
        </p>
        <p className="text-xs text-vigil-muted mt-1.5">per transaction</p>
      </div>

      <div className="border-l border-vigil-border pl-4">
        <p className="text-xs text-vigil-muted mb-2">Transactions scanned</p>
        <p className="font-display text-2xl font-bold text-white tabular-nums">
          {result.totalTxScanned}
        </p>
        <p className="text-xs text-vigil-muted mt-1.5">in selected range</p>
      </div>
    </section>
  );
}
