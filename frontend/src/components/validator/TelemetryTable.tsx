import type { MevAttack } from '@/lib/types';

const TYPE_LABELS: Record<string, string> = {
  sandwich_single: 'Sandwich',
  sandwich_wide: 'Wide Sandwich',
  sandwich_auth_hop: 'Auth Hop',
  backrun: 'Backrun',
  liquidation: 'Liquidation',
  jit_liquidity: 'JIT Liquidity',
};

interface Props {
  attacks: MevAttack[];
}

export default function TelemetryTable({ attacks }: Props) {
  return (
    <div className="bg-[#0a0e1a] border border-white/10 rounded-lg overflow-hidden mb-6 fade-up fade-up-d4">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold">Telemetry</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              {['Timestamp', 'Type', 'DEX / Pool', 'Victim TX', 'Loss (SOL)', 'Slot', 'Severity'].map((h) => (
                <th key={h} className={`px-6 py-3 text-xs font-medium text-[#8892ab] uppercase tracking-wider ${h === 'Loss (SOL)' || h === 'Slot' ? 'text-right' : h === 'Severity' ? 'text-center' : 'text-left'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {attacks.slice(0, 20).map((atk) => (
              <tr key={atk.signature} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-[#8892ab]">
                  {new Date(atk.timestamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    atk.type.startsWith('sandwich') ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-[#f97316]/20 text-[#f97316]'
                  }`}>{TYPE_LABELS[atk.type] ?? atk.type}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {atk.dex} — {atk.pool.slice(0, 6)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-[#22d3ee]">
                  {atk.signature.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                  {atk.extractedSol != null ? atk.extractedSol.toFixed(4) : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-[#8892ab]">
                  {atk.slot.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    atk.severity === 'critical' ? 'bg-[#ef4444]/20 text-[#ef4444]' :
                    atk.severity === 'high' ? 'bg-[#f97316]/20 text-[#f97316]' :
                    atk.severity === 'medium' ? 'bg-[#eab308]/20 text-[#eab308]' :
                    'bg-[#22c55e]/20 text-[#22c55e]'
                  }`}>
                    {atk.severity}
                  </span>
                </td>
              </tr>
            ))}
            {attacks.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-[#8892ab]">
                  No attacks detected yet. Waiting for data...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
