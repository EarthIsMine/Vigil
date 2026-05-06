import { MevType } from '@/lib/types';
import type { ReceiptSearchResult, MevReceipt, SandwichAttackDetail } from '@/lib/types';
import { txTypeLabel, getRiskColorHex } from '@/lib/format';
import ConfidenceBadge from './ConfidenceBadge';
import EvidencePanel from './EvidencePanel';

interface ReceiptDetailCardProps {
  result: ReceiptSearchResult | null;
  featuredReceipt: MevReceipt | null;
  featuredSandwich: SandwichAttackDetail | null;
}

export default function ReceiptDetailCard({ result, featuredReceipt, featuredSandwich }: ReceiptDetailCardProps) {
  const isUnenriched = featuredReceipt?.lossSource === 'unenriched';
  const lossAmount = featuredReceipt?.mevAnalysis.loss.lossAmount;
  const lossLabel = featuredReceipt
    ? isUnenriched
      ? 'Loss not estimated'
      : typeof lossAmount === 'number' && Number.isFinite(lossAmount)
        ? `${lossAmount.toFixed(3)} SOL`
        : '—'
    : '—';
  const sandwichProfit = featuredSandwich?.attackerProfit;
  const otherProfit =
    featuredReceipt?.attackDetail.kind === 'other'
      ? featuredReceipt.attackDetail.attackerProfit
      : null;
  const profitLabel =
    typeof sandwichProfit === 'number'
      ? `${sandwichProfit.toFixed(3)} SOL`
      : typeof otherProfit === 'number'
        ? `${otherProfit.toFixed(3)} SOL`
        : '—';
  return (
    <div className="w-full lg:w-96 space-y-6">
      <div className="lg:sticky lg:top-32">
        <div className="glass receipt-card p-6 rounded-xl border border-vigil-border-dark fade-up fade-up-d3">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-2xl text-vigil-accent">receipt_long</span>
                <h3 className="font-display font-bold text-lg">MEV RECEIPT</h3>
              </div>
              <div className="font-mono text-xs text-vigil-muted truncate max-w-[280px]">
                #{featuredReceipt?.receiptId ?? '—'}
              </div>
            </div>
            <ConfidenceBadge level={featuredReceipt?.confidenceLevel ?? null} />
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
              <span className="text-white font-mono truncate max-w-[180px] inline-block align-bottom" title={featuredReceipt?.txSignature}>
                {featuredReceipt?.txSignature
                  ? `${featuredReceipt.txSignature.slice(0, 8)}...${featuredReceipt.txSignature.slice(-6)}`
                  : '—'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-vigil-muted">Validator Risk</span>
              <span className="font-mono capitalize" style={{
                color: getRiskColorHex(featuredReceipt?.validator.riskLevel ?? '')
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
                  {profitLabel}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-vigil-muted">Your Loss</span>
                <span
                  className={`font-mono font-semibold ${isUnenriched ? 'text-vigil-muted' : 'text-vigil-red'}`}
                  title={isUnenriched ? 'CLOB attack — loss not estimated' : undefined}
                >
                  {lossLabel}
                  {isUnenriched && (
                    <span
                      className="material-symbols-outlined text-sm align-middle ml-1"
                      aria-hidden="true"
                    >
                      info
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="receipt-dashed my-6"></div>

          {/* Evidence — Why we flagged this */}
          <div className="mb-6">
            <EvidencePanel
              detectionMethod={featuredReceipt?.detectionMethod ?? null}
              bundleProvenance={featuredReceipt?.bundleProvenance ?? null}
              lossSource={featuredReceipt?.lossSource ?? null}
            />
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
                {result?.totalLossUsd != null ? `$${result.totalLossUsd.toFixed(2)}` : ''}
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
  );
}
