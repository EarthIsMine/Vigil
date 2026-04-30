import { TELEMETRY_DATA } from '@/app/validator/constants';

export default function TelemetryTable() {
  return (
    <div className="bg-[#0a0e1a] border border-white/10 rounded-lg overflow-hidden mb-6 fade-up fade-up-d4">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold">Telemetry</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              {['Timestamp', 'Type', 'Pool', 'Victim TX', 'Extracted', 'Latency', 'Status'].map((h) => (
                <th key={h} className={`px-6 py-3 text-xs font-medium text-[#8892ab] uppercase tracking-wider ${h === 'Extracted' || h === 'Latency' ? 'text-right' : h === 'Status' ? 'text-center' : 'text-left'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {TELEMETRY_DATA.map((row, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-[#8892ab]">{row.time}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    row.type === 'Sandwich' ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-[#f97316]/20 text-[#f97316]'
                  }`}>{row.type}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{row.pool}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-[#22d3ee]">{row.tx}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">{row.extracted}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-[#8892ab]">{row.latency}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                    row.status === 'success' ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                  }`}>
                    <span className="material-symbols-outlined text-xs">
                      {row.status === 'success' ? 'check_circle' : 'cancel'}
                    </span>
                    {row.status}
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
