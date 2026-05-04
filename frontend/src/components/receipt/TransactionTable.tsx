import type { MevReceipt } from '@/lib/types';
import { txTypeLabel } from '@/lib/format';

export default function TransactionTable({ receipts }: { receipts: MevReceipt[] }) {
  return (
    <div className="receipt-card p-6 rounded-xl border border-vigil-border-dark fade-up fade-up-d1">
      <h2 className="font-display font-bold text-lg mb-4">Recent Transactions</h2>
      <div className="space-y-3">
        {receipts.map((r) => {
          const { label, cls } = txTypeLabel(r.mevAnalysis.type);
          const lossAmt = r.mevAnalysis.loss.lossAmount;
          return (
            <div key={r.receiptId} className="flex items-center gap-4 p-3 bg-vigil-bg/50 rounded-lg border border-vigil-border-dark">
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm text-white mb-1 truncate">{r.txSignature}</div>
                <div className="text-xs text-vigil-muted">
                  swap · {r.victim.dex}
                </div>
              </div>
              <div className="text-right">
                <div className={`font-mono text-sm font-semibold ${cls}`}>
                  {lossAmt > 0 ? `-${lossAmt.toFixed(3)} SOL` : '0.000'}
                </div>
                <div className={`text-xs ${cls}`}>{label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
