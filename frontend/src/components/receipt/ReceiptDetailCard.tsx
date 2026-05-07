import { MevType } from '@/lib/types';
import type { ReceiptSearchResult, MevReceipt, SandwichAttackDetail } from '@/lib/types';
import { txTypeLabel, getRiskColorHex } from '@/lib/format';
import ConfidenceBadge from './ConfidenceBadge';
import EvidencePanel from './EvidencePanel';
import CounterfactualPanel from './CounterfactualPanel';

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
        <div className="border-l border-vigil-border pl-6 fade-up fade-up-d3">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-2xl text-white mb-1">
                MEV receipt
              </h3>
              <p
                className="font-mono text-xs text-vigil-muted truncate max-w-[280px]"
                title={featuredReceipt?.receiptId}
              >
                {featuredReceipt?.receiptId ?? '—'}
              </p>
            </div>
            <ConfidenceBadge level={featuredReceipt?.confidenceLevel ?? null} />
          </div>

          {/* Details */}
          <dl className="space-y-2.5 mb-6 text-sm">
            <Row label="Scan time">
              <span className="text-white font-mono">
                {featuredReceipt
                  ? new Date(featuredReceipt.timestamp).toUTCString().slice(5, 22) + ' UTC'
                  : '—'}
              </span>
            </Row>
            <Row label="Tx hash">
              <span
                className="text-white font-mono truncate max-w-[180px] inline-block align-bottom"
                title={featuredReceipt?.txSignature}
              >
                {featuredReceipt?.txSignature
                  ? `${featuredReceipt.txSignature.slice(0, 8)}…${featuredReceipt.txSignature.slice(-6)}`
                  : '—'}
              </span>
            </Row>
            <Row label="Validator risk">
              <span
                className="font-mono capitalize"
                style={{
                  color: getRiskColorHex(featuredReceipt?.validator.riskLevel ?? ''),
                }}
              >
                {featuredReceipt?.validator.riskLevel ?? '—'}
              </span>
            </Row>
            <Row label="Extraction type">
              <span className={`${txTypeLabel(featuredReceipt?.mevAnalysis.type ?? MevType.NONE).cls}`}>
                {txTypeLabel(featuredReceipt?.mevAnalysis.type ?? MevType.NONE).label}
              </span>
            </Row>
            <Row label="Loss confidence">
              <span className="text-white font-mono capitalize">
                {featuredReceipt?.mevAnalysis.loss.confidence ?? '—'}
              </span>
            </Row>
          </dl>

          <div className="border-t border-vigil-border/40 my-6" />

          {/* Profit Distribution */}
          <p className="text-xs text-vigil-muted mb-3">Extraction detail</p>
          <dl className="space-y-2.5 mb-6 text-sm">
            <Row label="Attacker profit">
              <span className="text-vigil-red font-mono font-semibold">
                {profitLabel}
              </span>
            </Row>
            <Row label="Your loss">
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
            </Row>
          </dl>

          <div className="border-t border-vigil-border/40 my-6" />

          {/* Counterfactual replay — concrete loss derivation */}
          <div className="mb-4">
            <CounterfactualPanel trace={featuredReceipt?.replayTrace ?? null} />
          </div>

          {/* Evidence — Why we flagged this */}
          <div className="mb-6">
            <EvidencePanel
              detectionMethod={featuredReceipt?.detectionMethod ?? null}
              bundleProvenance={featuredReceipt?.bundleProvenance ?? null}
              lossSource={featuredReceipt?.lossSource ?? null}
            />
          </div>

          <div className="border-t border-vigil-border/40 my-6" />

          {/* Total */}
          <div className="flex justify-between items-baseline mb-6">
            <span className="font-display font-bold text-white">Total loss</span>
            <div className="text-right">
              <div className="font-display font-bold text-xl text-white tabular-nums">
                {result ? `${result.totalLossSol.toFixed(3)} SOL` : '—'}
              </div>
              <div className="text-xs text-vigil-muted">
                {result?.totalLossUsd != null ? `$${result.totalLossUsd.toFixed(2)}` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-baseline">
      <dt className="text-vigil-muted">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
