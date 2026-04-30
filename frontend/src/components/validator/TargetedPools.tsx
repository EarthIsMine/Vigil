import { TARGETED_POOLS } from '@/app/validator/constants';

export default function TargetedPools() {
  return (
    <div className="bg-[#0a0e1a] border border-white/10 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Most Targeted Pools</h2>
      <div className="space-y-4">
        {TARGETED_POOLS.map((pool) => (
          <div key={pool.name}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>{pool.name}</span>
              <span className="font-mono text-[#8892ab]">{pool.value}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(pool.value / pool.max) * 100}%`, backgroundColor: pool.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
