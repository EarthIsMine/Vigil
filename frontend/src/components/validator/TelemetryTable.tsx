import type { MevAttack } from '@/lib/types';

const TYPE_LABELS: Record<string, string> = {
  sandwich_single: 'Sandwich',
  sandwich_wide: 'Wide sandwich',
  sandwich_auth_hop: 'Auth hop',
  backrun: 'Backrun',
  liquidation: 'Liquidation',
  jit_liquidity: 'JIT liquidity',
};

const TYPE_COLOR: Record<string, string> = {
  sandwich_single: 'text-error',
  sandwich_wide: 'text-warning',
  sandwich_auth_hop: 'text-warning',
  backrun: 'text-primary',
  liquidation: 'text-vigil-purple',
  jit_liquidity: 'text-accent-green',
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-error',
  high: 'bg-warning',
  medium: 'bg-yellow-500',
  low: 'bg-accent-green',
  info: 'bg-vigil-muted',
};

const BUNDLE_PILL: Record<string, { label: string; cls: string }> = {
  atomic:    { label: 'Atomic',    cls: 'bg-error/15 text-error' },
  spanning:  { label: 'Spanning',  cls: 'bg-warning/15 text-warning' },
  tip_race:  { label: 'Tip race',  cls: 'bg-yellow-500/15 text-yellow-500' },
  organic:   { label: 'Organic',   cls: 'bg-vigil-muted/20 text-vigil-muted' },
};

const DETECTION_LABEL: Record<string, string> = {
  header: 'Same-block',
  cross_slot_window: 'Cross-slot',
  jito_bundle: 'Bundle',
};

const LOSS_SOURCE_LABEL: Record<string, string> = {
  amm_replay: 'AMM',
  whirlpool_replay: 'Whirlpool',
  dlmm_replay: 'DLMM',
  pool_amount_out: 'amount_out',
  unenriched: 'unenriched',
};

interface Props {
  attacks: MevAttack[];
}

export default function TelemetryTable({ attacks }: Props) {
  return (
    <section className="mb-14 fade-up fade-up-d4">
      <h2 className="font-display text-2xl font-bold text-white mb-1">Recent attacks</h2>
      <p className="text-sm text-vigil-muted mb-6">
        Latest {Math.min(20, attacks.length)} events on this validator.
      </p>

      {attacks.length === 0 ? (
        <p className="text-sm text-vigil-muted py-8">
          No attacks detected yet. Waiting for data…
        </p>
      ) : (
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-vigil-muted text-left border-b border-vigil-border">
                <th className="font-normal py-3 pr-6">Time</th>
                <th className="font-normal py-3 pr-6">Type</th>
                <th className="font-normal py-3 pr-6">Pool</th>
                <th className="font-normal py-3 pr-6">Victim TX</th>
                <th className="font-normal py-3 pr-6">Bundle</th>
                <th className="font-normal py-3 pr-6">Detection</th>
                <th className="font-normal py-3 pr-6">Replay</th>
                <th className="font-normal py-3 pr-6 text-right">Loss (SOL)</th>
                <th className="font-normal py-3 pr-6 text-right">Slot</th>
                <th className="font-normal py-3 text-center">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vigil-border/60">
              {attacks.slice(0, 20).map((atk) => (
                <tr key={atk.signature} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-6 font-mono text-vigil-muted whitespace-nowrap">
                    {new Date(atk.timestamp).toLocaleString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className={`py-3 pr-6 font-medium whitespace-nowrap ${TYPE_COLOR[atk.type] ?? 'text-vigil-muted'}`}>
                    {TYPE_LABELS[atk.type] ?? atk.type}
                  </td>
                  <td className="py-3 pr-6 whitespace-nowrap text-white">
                    <span className="text-vigil-muted">{atk.dex}</span>{' '}
                    <span className="font-mono text-xs">{atk.pool.slice(0, 6)}…</span>
                  </td>
                  <td className="py-3 pr-6 font-mono text-xs text-primary whitespace-nowrap">
                    {atk.signature.slice(0, 10)}…
                  </td>
                  <td className="py-3 pr-6 whitespace-nowrap">
                    {atk.bundleProvenance ? (
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                          BUNDLE_PILL[atk.bundleProvenance]?.cls ?? 'bg-vigil-muted/20 text-vigil-muted'
                        }`}
                      >
                        {BUNDLE_PILL[atk.bundleProvenance]?.label ?? atk.bundleProvenance}
                      </span>
                    ) : (
                      <span className="text-vigil-muted text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3 pr-6 whitespace-nowrap text-xs text-vigil-muted">
                    {atk.detectionMethod ? DETECTION_LABEL[atk.detectionMethod] ?? atk.detectionMethod : '—'}
                  </td>
                  <td className="py-3 pr-6 whitespace-nowrap text-xs font-mono text-vigil-muted">
                    {LOSS_SOURCE_LABEL[atk.lossSource] ?? atk.lossSource}
                  </td>
                  <td className="py-3 pr-6 text-right tabular-nums text-white whitespace-nowrap">
                    {atk.extractedSol != null ? atk.extractedSol.toFixed(4) : '—'}
                  </td>
                  <td className="py-3 pr-6 text-right font-mono tabular-nums text-vigil-muted whitespace-nowrap">
                    {atk.slot.toLocaleString()}
                  </td>
                  <td className="py-3 text-center whitespace-nowrap">
                    <span
                      className="inline-flex items-center gap-2 text-xs text-vigil-muted"
                      title={atk.severity}
                    >
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          SEVERITY_DOT[atk.severity] ?? 'bg-vigil-muted'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="capitalize">{atk.severity}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
