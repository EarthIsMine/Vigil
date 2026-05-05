import { PROTECTION_STATS } from '@/app/protection/constants';

export default function ProtectionStats() {
  return (
    <section id="stats" className="py-20 relative fade-up fade-up-d1">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROTECTION_STATS.map((stat) => (
            <div
              key={stat.title}
              className={`bg-vigil-card border border-vigil-border rounded-xl p-6 card-glow float-up ${stat.delay}`}
            >
              <div className="font-display text-lg font-bold text-white mb-2">{stat.title}</div>
              <div className="text-sm text-vigil-muted leading-relaxed">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
