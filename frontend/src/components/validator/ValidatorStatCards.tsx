import type { ValidatorDetail } from '@/lib/types';

export default function ValidatorStatCards({ validator }: { validator: ValidatorDetail | null }) {
  const stats = [
    { label: 'Total Extracted (SOL)',  value: validator ? `${validator.metricsRaw.totalExtractedSol.toLocaleString()} SOL` : '...', color: '#ef4444' },
    { label: 'Sandwich Involvement',  value: validator ? `${(validator.metricsRaw.sandwichInvolvementRate * 100).toFixed(1)}%` : '...', color: '#f97316' },
    { label: 'Wide Sandwich Rate',    value: validator ? `${(validator.metricsRaw.wideSandwichRate * 100).toFixed(1)}%` : '...', color: '#a855f7' },
    { label: 'Avg Extraction / Slot', value: validator ? `${validator.metricsRaw.avgExtractionPerSlot} SOL` : '...', color: '#22d3ee' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="bg-[#0a0e1a] border border-white/10 rounded-lg overflow-hidden">
          <div className="h-1" style={{ background: s.color }} />
          <div className="p-4">
            <div className="text-[#8892ab] text-sm mb-1">{s.label}</div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
