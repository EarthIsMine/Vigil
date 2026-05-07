'use client';

import type { ConfidenceLevel, DetectionMethod, MevAttack, MevType } from '@/lib/types';

const TYPE_LABELS: Record<string, string> = {
  sandwich_single: 'Sandwich',
  sandwich_wide: 'Wide Sandwich',
  sandwich_auth_hop: 'Auth Hop',
  backrun: 'Backrun',
  liquidation: 'Liquidation',
  jit_liquidity: 'JIT Liquidity',
};

const getTypeColor = (type: MevType) => {
  switch (type) {
    case 'sandwich_single':
    case 'sandwich_wide':
    case 'sandwich_auth_hop':
      return 'text-error';
    case 'backrun':
      return 'text-primary';
    default:
      return 'text-warning';
  }
};

const CONFIDENCE_DOT_HEX: Record<ConfidenceLevel, string> = {
  high: '#22c55e',
  medium: '#eab308',
  low: '#8892ab',
};

const DETECTION_METHOD_LABEL: Record<DetectionMethod, string> = {
  header: 'Adjacent slot header',
  cross_slot_window: 'Cross-slot window match',
  jito_bundle: 'Jito bundle inspection',
};

function confidenceTooltip(level: ConfidenceLevel, method: DetectionMethod | null | undefined): string {
  const methodLabel = method ? DETECTION_METHOD_LABEL[method] : 'unknown method';
  return `Confidence: ${level} — Detected via ${methodLabel}`;
}

interface LiveFeedProps {
  attacks?: MevAttack[];
}

export default function LiveFeed({ attacks }: LiveFeedProps) {
  if (!attacks || attacks.length === 0) {
    return (
      <div className="text-center py-8 text-muted font-mono text-sm">
        No attacks detected yet. Waiting for data...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {attacks.map((attack) => (
        <div
          key={attack.signature}
          className="bg-surface-200 border border-outline rounded-lg p-4 hover:bg-surface-300 transition-colors"
        >
          <div className="flex items-start justify-between mb-2">
            <span className={`font-mono text-sm font-semibold ${getTypeColor(attack.type)}`}>
              {TYPE_LABELS[attack.type] ?? attack.type}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted">
                {new Date(attack.timestamp).toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })}
              </span>
              {attack.confidenceLevel && (
                <span
                  data-testid="confidence-dot"
                  data-confidence={attack.confidenceLevel}
                  role="img"
                  aria-label={confidenceTooltip(attack.confidenceLevel, attack.detectionMethod)}
                  title={confidenceTooltip(attack.confidenceLevel, attack.detectionMethod)}
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: CONFIDENCE_DOT_HEX[attack.confidenceLevel] }}
                />
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted">Victim:</span>
              <code className="font-mono text-xs text-on-surf bg-surface-400 px-2 py-0.5 rounded">
                {attack.victim.signer.slice(0, 10)}...{attack.victim.signer.slice(-8)}
              </code>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted">Attacker:</span>
              <code className="font-mono text-xs text-on-surf bg-surface-400 px-2 py-0.5 rounded">
                {attack.attacker.slice(0, 10)}...{attack.attacker.slice(-8)}
              </code>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted">Loss:</span>
                <span className="font-mono text-sm font-semibold text-primary">
                  {attack.extractedSol != null ? `${attack.extractedSol.toFixed(4)} SOL` : '—'}
                </span>
                {attack.extractedUsd != null && attack.extractedUsd > 0 && (
                  <span className="font-mono text-xs text-muted">
                    (${attack.extractedUsd.toFixed(2)})
                  </span>
                )}
              </div>
              <span className="font-mono text-xs text-muted">
                {attack.dex}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
