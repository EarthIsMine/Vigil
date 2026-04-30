import type { ValidatorDetail } from '@/lib/types';

export default function ValidatorStatCards({ validator }: { validator: ValidatorDetail | null }) {
  const stats = [
    { label: 'Total Extracted (SOL)', value: validator ? `${validator.metricsRaw.totalExtractedSol.toLocaleString()} SOL` : '...' },
    { label: 'Sandwich Involvement', value: validator ? `${(validator.metricsRaw.sandwichInvolvementRate * 100).toFixed(1)}%` : '...' },
    { label: 'Wide Sandwich Rate', value: validator ? `${(validator.metricsRaw.wideSandwichRate * 100).toFixed(1)}%` : '...' },
    { label: 'Avg Extraction / Slot', value: validator ? `${validator.metricsRaw.avgExtractionPerSlot} SOL` : '...' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-up fade-up-d2">
      {stats.map((s) => (
        <div key={s.label} className="bg-[#111827] border border-white/[0.06] rounded-lg p-5">
          <div className="text-[#8892ab] text-xs font-mono uppercase tracking-wider mb-3">{s.label}</div>
          <div className="text-2xl font-bold text-white">{s.value}</div>
        </div>
      ))}
    </div>
  );
}
