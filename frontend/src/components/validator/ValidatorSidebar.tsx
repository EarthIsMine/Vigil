import Link from 'next/link';
import type { ValidatorDetail } from '@/lib/types';

interface ValidatorSidebarProps {
  validator: ValidatorDetail | null;
  riskColor: string;
}

export default function ValidatorSidebar({ validator, riskColor }: ValidatorSidebarProps) {
  return (
    <aside className="fixed left-0 top-14 w-[220px] h-[calc(100vh-3.5rem)] bg-[#0a0e1a] border-r border-white/10 flex flex-col">
      <div className="flex-1 p-4">
        <div className="mb-6">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded mb-4">
            <span className="material-symbols-outlined text-lg" style={{ color: riskColor }}>warning</span>
            <span className="font-medium text-sm">{validator?.name ?? '...'}</span>
          </div>
        </div>
        <nav className="space-y-1">
          <Link href="#overview" className="block px-3 py-2 text-sm text-white bg-white/5 rounded">Overview</Link>
          <Link href="#attack-vectors" className="block px-3 py-2 text-sm text-[#8892ab] hover:text-white hover:bg-white/5 rounded transition-colors">Attack Vectors</Link>
          <Link href="#targeted-pools" className="block px-3 py-2 text-sm text-[#8892ab] hover:text-white hover:bg-white/5 rounded transition-colors">Targeted Pools</Link>
          <Link href="#telemetry" className="block px-3 py-2 text-sm text-[#8892ab] hover:text-white hover:bg-white/5 rounded transition-colors">Telemetry</Link>
        </nav>
      </div>
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-[#8892ab] mb-2">Risk Assessment</div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold" style={{ color: riskColor }}>
            {validator?.riskScore ?? '—'}
          </span>
          <span className="text-sm text-[#8892ab]">/100</span>
        </div>
        <div className="h-2 bg-[#0a0e1a] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: validator ? `${validator.riskScore}%` : '0%',
              background: `linear-gradient(to right, ${riskColor}, ${riskColor}aa)`,
            }}
          />
        </div>
      </div>
    </aside>
  );
}
