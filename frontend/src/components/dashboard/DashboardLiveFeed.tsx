'use client';

import {
  useConnectionStatus,
  type ConnectionStatus,
} from '@/components/ConnectionStatusProvider';
import type { ConfidenceLevel, MevAttack } from '@/lib/types';

interface DashboardLiveFeedProps {
  attacks: MevAttack[];
}

const TYPE_LABEL: Record<string, string> = {
  sandwich_single: 'Sandwich',
  sandwich_wide: 'Wide sandwich',
  sandwich_auth_hop: 'Auth hop',
  backrun: 'Backrun',
  liquidation: 'Liquidation',
  jit_liquidity: 'JIT',
};

// Single neutral color for type — confidence dot carries the only color signal.
const TYPE_TEXT = 'text-white';

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  live: 'Live',
  offline: 'Offline',
};

const STATUS_DOT: Record<ConnectionStatus, string> = {
  live: 'bg-vigil-green animate-pulse',
  offline: 'bg-error',
};

const STATUS_TEXT: Record<ConnectionStatus, string> = {
  live: 'text-vigil-green',
  offline: 'text-error',
};

const CONFIDENCE_HEX: Record<ConfidenceLevel, string> = {
  high: '#22c55e',
  medium: '#eab308',
  low: '#8892ab',
};

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function DashboardLiveFeed({ attacks }: DashboardLiveFeedProps) {
  const status = useConnectionStatus();

  return (
    <section className="fade-up fade-up-d3">
      <header className="flex items-baseline justify-between mb-5">
        <h2 className="font-display text-xl font-bold text-white">
          Recent attacks
        </h2>
        <div
          className="flex items-center gap-2 text-xs"
          role="status"
          aria-label={`Connection: ${STATUS_LABEL[status]}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
          <span className={STATUS_TEXT[status]}>{STATUS_LABEL[status]}</span>
        </div>
      </header>

      {attacks.length === 0 ? (
        <p className="text-sm text-vigil-muted py-6">
          No attacks detected yet. Waiting for data…
        </p>
      ) : (
        <ul className="divide-y divide-vigil-border/60">
          {attacks.slice(0, 8).map((attack) => {
            const typeLabel = TYPE_LABEL[attack.type] ?? attack.type;
            return (
              <li
                key={attack.signature}
                className="grid grid-cols-[60px_minmax(0,1fr)_72px_60px_12px] items-center gap-3 py-2.5 text-sm"
              >
                <span className="font-mono tabular-nums text-xs text-vigil-muted">
                  {formatTime(attack.timestamp)}
                </span>
                <span className={`truncate ${TYPE_TEXT}`}>{typeLabel}</span>
                <span className="text-right font-mono tabular-nums text-white">
                  {attack.extractedSol != null
                    ? `${attack.extractedSol.toFixed(3)} ◎`
                    : '—'}
                </span>
                <span className="text-right text-[10px] text-vigil-muted/60 truncate">
                  {attack.dex}
                </span>
                {attack.confidenceLevel ? (
                  <span
                    className="inline-block w-2 h-2 rounded-full justify-self-end"
                    style={{
                      backgroundColor: CONFIDENCE_HEX[attack.confidenceLevel],
                    }}
                    aria-label={`Confidence: ${attack.confidenceLevel}`}
                    title={`Confidence: ${attack.confidenceLevel}`}
                  />
                ) : (
                  <span aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
