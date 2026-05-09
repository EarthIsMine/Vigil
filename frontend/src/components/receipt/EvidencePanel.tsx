'use client';

import { useState } from 'react';
import type {
  DetectionMethod,
  BundleProvenance,
  LossSource,
  DetectionEvidence,
} from '@/lib/types';

interface EvidencePanelProps {
  detectionMethod: DetectionMethod | null | undefined;
  bundleProvenance: BundleProvenance | null | undefined;
  lossSource: LossSource | null | undefined;
  // Engine-derived confidence interval for the victim loss (SOL).
  // Both ends present together or both null.
  victimLossSolLower?: number | null;
  victimLossSolUpper?: number | null;
  // Structured evidence (5-category taxonomy) when detector emitted it.
  evidence?: DetectionEvidence | null;
}

const CATEGORY_LABEL: Record<string, string> = {
  structural: 'Structural',
  temporal: 'Temporal',
  provenance: 'Provenance',
  economic: 'Economic',
  plausibility: 'Plausibility',
};

const DETECTION_LABEL: Record<DetectionMethod, string> = {
  header: 'Adjacent slot header',
  cross_slot_window: 'Cross-slot window match',
  jito_bundle: 'Jito bundle inspection',
};

const PROVENANCE_LABEL: Record<BundleProvenance, string> = {
  atomic: 'Atomic bundle',
  spanning: 'Spanning bundle',
  tip_race: 'Tip race',
  organic: 'Organic (no bundle)',
};

const LOSS_SOURCE_LABEL: Record<LossSource, { label: string; tooltip: string }> = {
  amm_replay: {
    label: 'Counterfactual replay (precise)',
    tooltip: 'Loss derived from constant-product AMM replay against pool reserves',
  },
  whirlpool_replay: {
    label: 'Counterfactual replay (precise)',
    tooltip: 'Loss derived from Orca Whirlpool concentrated-liquidity replay',
  },
  dlmm_replay: {
    label: 'Counterfactual replay (precise)',
    tooltip: 'Loss derived from Meteora DLMM bin replay',
  },
  pool_amount_out: {
    label: 'Pool reserve estimate',
    tooltip: 'Loss estimated from victim amount_out vs. pool reserves',
  },
  unenriched: {
    label: 'CLOB attack — loss not estimated',
    tooltip: 'Phoenix or other CLOB venue — sandwich pattern detected but loss can’t be quantified by replay',
  },
};

function categoryBreakdown(evidence: DetectionEvidence | null | undefined) {
  const signals = evidence?.signals;
  if (!Array.isArray(signals) || signals.length === 0) return null;
  const counts = new Map<string, { pass: number; fail: number; info: number }>();
  for (const s of signals) {
    const cat = typeof s.category === 'string' ? s.category : 'other';
    const verdict = s.verdict;
    const bucket = counts.get(cat) ?? { pass: 0, fail: 0, info: 0 };
    if (verdict === 'pass') bucket.pass += 1;
    else if (verdict === 'fail') bucket.fail += 1;
    else bucket.info += 1;
    counts.set(cat, bucket);
  }
  return [...counts.entries()];
}

export default function EvidencePanel({
  detectionMethod,
  bundleProvenance,
  lossSource,
  victimLossSolLower,
  victimLossSolUpper,
  evidence,
}: EvidencePanelProps) {
  const [open, setOpen] = useState(false);

  const hasInterval =
    typeof victimLossSolLower === 'number' && typeof victimLossSolUpper === 'number';
  const ensembleAgreement =
    typeof evidence?.ensembleAgreement === 'number' ? evidence.ensembleAgreement : null;
  const breakdown = categoryBreakdown(evidence);

  if (
    !detectionMethod &&
    !bundleProvenance &&
    !lossSource &&
    !hasInterval &&
    ensembleAgreement === null &&
    !breakdown
  ) {
    return null;
  }

  const lossSourceEntry = lossSource ? LOSS_SOURCE_LABEL[lossSource] : null;

  return (
    <div className="text-xs">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-1 text-vigil-muted hover:text-white transition font-mono"
      >
        <span className={`material-symbols-outlined text-sm transition-transform ${open ? 'rotate-90' : ''}`} aria-hidden="true">
          chevron_right
        </span>
        Why we flagged this
      </button>

      {open && (
        <dl className="mt-3 space-y-2 pl-5 font-mono">
          {detectionMethod && (
            <div className="flex justify-between gap-3">
              <dt className="text-vigil-muted">Detection</dt>
              <dd className="text-white text-right">{DETECTION_LABEL[detectionMethod]}</dd>
            </div>
          )}
          {bundleProvenance && (
            <div className="flex justify-between gap-3">
              <dt className="text-vigil-muted">Bundle</dt>
              <dd className="text-white text-right">{PROVENANCE_LABEL[bundleProvenance]}</dd>
            </div>
          )}
          {lossSourceEntry && (
            <div className="flex justify-between gap-3">
              <dt className="text-vigil-muted">Loss source</dt>
              <dd
                className="text-white text-right cursor-help"
                title={lossSourceEntry.tooltip}
              >
                {lossSourceEntry.label}
              </dd>
            </div>
          )}
          {hasInterval && (
            <div className="flex justify-between gap-3">
              <dt className="text-vigil-muted">Replay interval</dt>
              <dd
                className="text-white text-right tabular-nums"
                title="Per-step parser/model residual bounds from AMM replay"
              >
                [{victimLossSolLower!.toFixed(3)} – {victimLossSolUpper!.toFixed(3)}] SOL
              </dd>
            </div>
          )}
          {ensembleAgreement !== null && (
            <div className="flex justify-between gap-3">
              <dt className="text-vigil-muted">Ensemble</dt>
              <dd className="text-white text-right tabular-nums">
                {Math.round(ensembleAgreement * 5)}/5 categories pass
              </dd>
            </div>
          )}
          {breakdown && breakdown.length > 0 && (
            <div className="pt-2">
              <dt className="text-vigil-muted mb-1.5">Signal categories</dt>
              <dd className="space-y-1">
                {breakdown.map(([cat, { pass, fail, info }]) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between text-[11px]"
                  >
                    <span className="text-on-surf/85">{CATEGORY_LABEL[cat] ?? cat}</span>
                    <span className="font-mono">
                      <span className="text-accent-green">{pass}P</span>
                      {fail > 0 && <span className="text-error ml-1.5">{fail}F</span>}
                      {info > 0 && <span className="text-vigil-muted ml-1.5">{info}i</span>}
                    </span>
                  </div>
                ))}
              </dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
}
