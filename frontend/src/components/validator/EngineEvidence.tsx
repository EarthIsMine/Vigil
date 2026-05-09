import type { MevAttack } from '@/lib/types';

interface Props {
  attacks: MevAttack[];
}

const REPLAY_LABEL: Record<string, string> = {
  amm_replay: 'Constant product',
  whirlpool_replay: 'Whirlpool / CLMM',
  dlmm_replay: 'Meteora DLMM',
  pool_amount_out: 'amount_out only',
  unenriched: 'Unenriched',
};

const REPLAY_COLOR: Record<string, string> = {
  amm_replay: 'bg-primary',
  whirlpool_replay: 'bg-secondary',
  dlmm_replay: 'bg-vigil-purple',
  pool_amount_out: 'bg-warning',
  unenriched: 'bg-muted/40',
};

export default function EngineEvidence({ attacks }: Props) {
  if (attacks.length === 0) return null;

  const total = attacks.length;

  const atomic = attacks.filter((a) => a.bundleProvenance === 'atomic').length;
  const sameBlock = attacks.filter((a) => a.detectionMethod === 'header').length;
  const replayEnriched = attacks.filter((a) =>
    a.lossSource === 'amm_replay' ||
    a.lossSource === 'whirlpool_replay' ||
    a.lossSource === 'dlmm_replay',
  ).length;

  // Engine flags rule-based detections where the counterfactual replay
  // shows the attacker actually lost SOL on the round-trip. We surface
  // this as the false-positive screen — Vigil's honesty differentiator.
  const counterfactualFlips = attacks.filter(
    (a) => a.victim.expectedAmountOut > 0 && a.victim.amountOut > a.victim.expectedAmountOut,
  ).length;

  const sourceCounts: Record<string, number> = {};
  for (const a of attacks) {
    sourceCounts[a.lossSource] = (sourceCounts[a.lossSource] ?? 0) + 1;
  }
  const sourceEntries = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]);

  return (
    <section className="mb-14 fade-up fade-up-d3">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-on-surf mb-1">
          Engine evidence
        </h2>
        <p className="text-sm text-muted">
          Every metric below maps 1:1 to a field the detector emits on each attack.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <EvidenceCard
          label="Atomic bundle"
          value={pct(atomic, total)}
          sub={`${atomic} / ${total} attacks`}
          hint="Attacker paid for atomicity in this leader's slot — strongest direct involvement signal."
        />
        <EvidenceCard
          label="Same-block"
          value={pct(sameBlock, total)}
          sub={`${sameBlock} of ${total} via header`}
          hint="Front+victim+back in one slot — only possible when this validator is leader."
        />
        <EvidenceCard
          label="AMM-replay coverage"
          value={pct(replayEnriched, total)}
          sub={`${replayEnriched} replays · ${total - replayEnriched} fallback`}
          hint="Loss computed from pool math, not amount_out heuristic. Carries lower/upper bounds in raw output."
        />
        <EvidenceCard
          label="Counterfactual flips"
          value={counterfactualFlips.toString()}
          sub={`of ${total} flagged`}
          hint="Rule-based said sandwich; replay says attacker took a loss. Shown so you can audit, not hidden."
          tone={counterfactualFlips > 0 ? 'warning' : 'muted'}
        />
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-muted font-mono mb-3">
          Loss source breakdown
        </p>
        <div className="flex w-full h-2 rounded overflow-hidden border border-outline/15 mb-3">
          {sourceEntries.map(([src, count]) => (
            <div
              key={src}
              className={REPLAY_COLOR[src] ?? 'bg-muted/40'}
              style={{ width: `${(count / total) * 100}%` }}
              title={`${REPLAY_LABEL[src] ?? src}: ${count}`}
            />
          ))}
        </div>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5 text-xs">
          {sourceEntries.map(([src, count]) => (
            <li key={src} className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-sm flex-shrink-0 ${REPLAY_COLOR[src] ?? 'bg-muted/40'}`}
              />
              <span className="text-on-surf/85">{REPLAY_LABEL[src] ?? src}</span>
              <span className="text-muted font-mono ml-auto tabular-nums">
                {count} · {pct(count, total)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function pct(n: number, d: number): string {
  if (d === 0) return '0%';
  return `${((n / d) * 100).toFixed(1)}%`;
}

function EvidenceCard({
  label,
  value,
  sub,
  hint,
  tone = 'default',
}: {
  label: string;
  value: string;
  sub: string;
  hint: string;
  tone?: 'default' | 'warning' | 'muted';
}) {
  const valueColor =
    tone === 'warning' ? 'text-warning' : tone === 'muted' ? 'text-muted' : 'text-on-surf';
  return (
    <div className="p-4 rounded-lg border border-outline/20 bg-surface">
      <p className="text-xs text-muted mb-2">{label}</p>
      <p className={`font-display text-2xl font-bold tabular-nums mb-1 ${valueColor}`}>{value}</p>
      <p className="text-xs text-muted font-mono mb-2">{sub}</p>
      <p className="text-[11px] text-muted leading-relaxed">{hint}</p>
    </div>
  );
}
