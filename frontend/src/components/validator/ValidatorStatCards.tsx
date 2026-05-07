import type { ValidatorDetail } from '@/lib/types';

function formatAvgPerSlot(value: number): string {
  if (!Number.isFinite(value)) return '—';
  if (value === 0) return '0';
  // SOL down to lamport precision (1e-9). Avoid scientific notation.
  const fixed = Math.abs(value) >= 1 ? value.toFixed(4) : value.toFixed(9);
  return fixed.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
}

function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

interface Stat {
  label: string;
  value: string;
  unit?: string;
}

export default function ValidatorStatCards({ validator }: { validator: ValidatorDetail | null }) {
  const stats: Stat[] = validator
    ? [
        { label: 'Total extracted', value: validator.metricsRaw.totalExtractedSol.toLocaleString(), unit: 'SOL' },
        { label: 'Sandwich involvement', value: formatPercent(validator.metricsRaw.sandwichInvolvementRate) },
        { label: 'Wide sandwich rate', value: formatPercent(validator.metricsRaw.wideSandwichRate) },
        { label: 'Avg per slot', value: formatAvgPerSlot(validator.metricsRaw.avgExtractionPerSlot), unit: 'SOL' },
      ]
    : [
        { label: 'Total extracted', value: '—' },
        { label: 'Sandwich involvement', value: '—' },
        { label: 'Wide sandwich rate', value: '—' },
        { label: 'Avg per slot', value: '—' },
      ];

  return (
    <section className="mb-14 fade-up fade-up-d2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
        {stats.map((s) => (
          <div key={s.label} className="border-l border-vigil-border pl-4">
            <p className="text-xs text-vigil-muted mb-2">{s.label}</p>
            <p className="font-display text-3xl font-bold text-white tabular-nums">
              {s.value}
              {s.unit && (
                <span className="text-base text-vigil-muted font-normal ml-1.5">{s.unit}</span>
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
