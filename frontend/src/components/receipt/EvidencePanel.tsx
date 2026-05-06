'use client';

import { useState } from 'react';
import type {
  DetectionMethod,
  BundleProvenance,
  LossSource,
} from '@/lib/types';

interface EvidencePanelProps {
  detectionMethod: DetectionMethod | null | undefined;
  bundleProvenance: BundleProvenance | null | undefined;
  lossSource: LossSource | null | undefined;
}

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

export default function EvidencePanel({
  detectionMethod,
  bundleProvenance,
  lossSource,
}: EvidencePanelProps) {
  const [open, setOpen] = useState(false);

  if (!detectionMethod && !bundleProvenance && !lossSource) return null;

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
        </dl>
      )}
    </div>
  );
}
