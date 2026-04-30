import type { EpochSummary } from '@/lib/services/analytics';

export default function EpochTable({ epochs }: { epochs: EpochSummary[] }) {
  return (
    <div className="receipt-card rounded-xl border border-vigil-border-dark overflow-hidden mb-8 fade-up">
      <div className="p-6 border-b border-vigil-border-dark flex items-center justify-between">
        <h2 className="font-display font-bold text-lg text-white">Epoch Summary</h2>
        <span className="text-xs font-mono text-vigil-muted">
          {epochs.length > 0
            ? `Epochs ${epochs[epochs.length - 1].epoch}–${epochs[0].epoch}`
            : 'Loading...'}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-vigil-bg/50">
            <tr>
              {['Epoch', 'Extracted', 'Sandwich', 'Frontrun', 'Backrun', 'Dominant Client'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-mono font-semibold text-vigil-muted uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-vigil-border-dark">
            {epochs.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-vigil-card-dark rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : epochs.map((row) => (
                  <tr key={row.epoch} className="hover:bg-vigil-card-dark/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm text-vigil-accent">{row.epoch}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm font-semibold text-white">{row.extracted}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm text-vigil-red">{row.sandwich}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm text-vigil-yellow">{row.frontrun}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm text-vigil-muted">{row.backrun}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 bg-vigil-accent/10 border border-vigil-accent/20 rounded text-xs font-mono text-vigil-accent">
                        {row.dominantClient}
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
