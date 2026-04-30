import type { ValidatorDetail } from '@/lib/types';

interface ValidatorHeaderProps {
  validator: ValidatorDetail | null;
  riskColor: string;
}

export default function ValidatorHeader({ validator, riskColor }: ValidatorHeaderProps) {
  return (
    <div
      className="bg-[#0a0e1a] rounded-lg p-6 mb-6 relative overflow-hidden border"
      style={{ borderColor: `${riskColor}4d` }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: `${riskColor}0d` }} />
      <div className="relative">
        {validator === null ? (
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 rounded-lg" />
              <div className="space-y-2">
                <div className="h-6 w-48 bg-white/10 rounded" />
                <div className="h-4 w-32 bg-white/10 rounded" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ background: `${riskColor}33` }}>
                  <span className="material-symbols-outlined text-3xl" style={{ color: riskColor }}>gpp_bad</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">{validator.name}</h1>
                    <span className="px-2 py-1 rounded text-xs font-bold" style={{ background: `${riskColor}33`, color: riskColor }}>
                      {validator.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#8892ab]">Vote Account:</span>
                      <span className="font-mono">{validator.voteAccount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#8892ab]">Identity:</span>
                      <span className="font-mono">{validator.identity}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded transition-colors">
                  <span className="material-symbols-outlined text-sm">share</span>
                </button>
                <button className="px-4 py-2 hover:opacity-80 rounded transition-colors" style={{ background: `${riskColor}33`, color: riskColor }}>
                  <span className="material-symbols-outlined text-sm">flag</span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="px-3 py-1 bg-white/5 rounded text-sm">
                <span className="text-[#8892ab]">Stake:</span> <span className="font-medium">{validator.stake}</span>
              </div>
              <div className="px-3 py-1 bg-white/5 rounded text-sm">
                <span className="text-[#8892ab]">Client:</span> <span className="font-medium">{validator.client}</span>
              </div>
              <div className="px-3 py-1 bg-white/5 rounded text-sm">
                <span className="text-[#8892ab]">Commission:</span> <span className="font-medium">{validator.commission}%</span>
              </div>
              <div className="px-3 py-1 bg-white/5 rounded text-sm">
                <span className="text-[#8892ab]">Active since:</span> <span className="font-medium">Epoch {validator.activeSinceEpoch}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
