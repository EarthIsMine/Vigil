'use client';

import type { MevAttack, MevType } from '@/lib/types';

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
            <span className="font-mono text-xs text-muted">
              {new Date(attack.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
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
                  {attack.extractedSol.toFixed(4)} SOL
                </span>
                {attack.extractedUsd > 0 && (
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
