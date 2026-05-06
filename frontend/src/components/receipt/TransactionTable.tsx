import type { ConfidenceLevel, MevReceipt } from '@/lib/types';
import { txTypeLabel } from '@/lib/format';

function lossDisplay(r: MevReceipt): { text: string; isUnenriched: boolean } {
  if (r.mevAnalysis.detected && r.lossSource === 'unenriched') {
    return { text: 'Loss not estimated', isUnenriched: true };
  }
  const lossAmt = r.mevAnalysis.loss.lossAmount;
  return {
    text: lossAmt > 0 ? `-${lossAmt.toFixed(3)} SOL` : '0.000 SOL',
    isUnenriched: false,
  };
}

const CONFIDENCE_DOT_HEX: Record<ConfidenceLevel, string> = {
  high: '#22c55e',
  medium: '#eab308',
  low: '#8892ab',
};

interface TransactionTableProps {
  receipts: MevReceipt[];
  selectedReceiptId?: string | null;
  onSelect?: (receiptId: string) => void;
}

export default function TransactionTable({
  receipts,
  selectedReceiptId,
  onSelect,
}: TransactionTableProps) {
  const interactive = typeof onSelect === 'function';

  return (
    <div className="receipt-card p-6 rounded-xl border border-vigil-border-dark fade-up fade-up-d1">
      <h2 className="font-display font-bold text-lg mb-4">Recent Transactions</h2>
      <div className="space-y-3">
        {receipts.map((r) => {
          const { label, cls } = txTypeLabel(r.mevAnalysis.type);
          const loss = lossDisplay(r);
          const isSelected = selectedReceiptId === r.receiptId;
          const baseClasses =
            'w-full flex items-center gap-4 p-3 bg-vigil-bg/50 rounded-lg border text-left';
          const stateClasses = isSelected
            ? 'border-vigil-accent ring-1 ring-vigil-accent/40'
            : 'border-vigil-border-dark';
          const interactiveClasses = interactive
            ? 'transition hover:border-vigil-accent/60 hover:bg-vigil-bg/70 cursor-pointer'
            : '';

          const content = (
            <>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm text-white truncate flex-1 min-w-0">
                    {r.txSignature}
                  </span>
                  {r.confidenceLevel && (
                    <span
                      data-testid="confidence-dot"
                      data-confidence={r.confidenceLevel}
                      role="img"
                      aria-label={`Detection confidence: ${r.confidenceLevel}`}
                      title={`Detection confidence: ${r.confidenceLevel}`}
                      className="inline-block w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: CONFIDENCE_DOT_HEX[r.confidenceLevel] }}
                    />
                  )}
                </div>
                <div className="text-xs text-vigil-muted truncate">
                  swap · {r.victim.dex}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-mono text-sm font-semibold ${loss.isUnenriched ? 'text-vigil-muted' : cls}`}
                  title={loss.isUnenriched ? 'CLOB attack — loss not estimated' : undefined}
                >
                  {loss.text}
                  {loss.isUnenriched && (
                    <span className="material-symbols-outlined text-sm align-middle ml-1" aria-hidden="true">
                      info
                    </span>
                  )}
                </div>
                <div className={`text-xs ${cls}`}>{label}</div>
              </div>
            </>
          );

          if (interactive) {
            return (
              <button
                type="button"
                key={r.receiptId}
                onClick={() => onSelect!(r.receiptId)}
                aria-pressed={isSelected}
                className={`${baseClasses} ${stateClasses} ${interactiveClasses}`}
              >
                {content}
              </button>
            );
          }

          return (
            <div
              key={r.receiptId}
              className={`${baseClasses} ${stateClasses}`}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
