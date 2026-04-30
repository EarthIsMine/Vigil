import Link from 'next/link';
import { HERO_FEATURES } from '@/app/protection/constants';

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-vigil-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function ProtectionHero() {
  return (
    <section id="hero" className="relative pt-24 pb-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      <div className="absolute inset-0 hero-glow"></div>
      <div className="scan-line"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-vigil-card border border-vigil-green/20 rounded-full">
              <span className="pulse-dot bg-vigil-green"></span>
              <span className="text-xs font-mono text-vigil-green uppercase tracking-wider">Protection Active</span>
            </div>

            <h1 className="font-display text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-white">FRONT-RUN THE</span>
              <br />
              <span className="gradient-text">ATTACKERS</span>
            </h1>

            <p className="text-lg text-vigil-muted max-w-xl">
              Real-time MEV protection that scans, blocks, and extracts value from sandwich attacks before they happen. Sub-millisecond response times with zero configuration.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard" className="px-6 py-3 bg-vigil-green hover:bg-vigil-emerald text-white rounded-lg font-medium transition-colors">
                Start Protecting
              </Link>
              <Link href="/docs" className="px-6 py-3 border border-vigil-border hover:border-vigil-green/50 text-white rounded-lg font-medium transition-colors">
                Read Docs
              </Link>
            </div>

            <div className="space-y-3 pt-4">
              {HERO_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-vigil-muted">
                  <CheckIcon />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Code Window */}
          <div className="float-up">
            <div className="bg-vigil-card border border-vigil-border rounded-xl overflow-hidden card-glow">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-vigil-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-vigil-green/80"></div>
                </div>
                <span className="text-xs text-vigil-muted font-mono ml-2">shield.config.ts</span>
              </div>
              <div className="p-6 font-mono text-sm">
                <pre className="text-vigil-muted">
                  <code>
                    <span className="text-purple-400">import</span> <span className="text-white">{'{'} Vigil {'}'}</span> <span className="text-purple-400">from</span> <span className="text-emerald-400">&apos;@vigil/sdk&apos;</span>
                    {'\n\n'}
                    <span className="text-purple-400">const</span> <span className="text-white">vigil</span> <span className="text-purple-400">=</span> <span className="text-cyan-400">new Vigil</span>({'{'}
                    {'\n  '}
                    <span className="text-white">apiKey</span>: <span className="text-emerald-400">process.env.VIGIL_API_KEY</span>,
                    {'\n  '}
                    <span className="text-white">cluster</span>: <span className="text-emerald-400">&apos;mainnet-beta&apos;</span>,
                    {'\n  '}
                    <span className="text-white">protection</span>: <span className="text-emerald-400">&apos;maximum&apos;</span>,
                    {'\n  '}
                    <span className="text-white">mevRebates</span>: <span className="text-orange-400">true</span>,
                    {'\n  '}
                    <span className="text-white">webhook</span>: <span className="text-emerald-400">&apos;https://api.example.com/alerts&apos;</span>
                    {'\n'}{'}'});
                    {'\n\n'}
                    <span className="text-vigil-muted">{'// protected send — Jito bundle routing'}</span>
                    {'\n'}
                    <span className="text-purple-400">await</span> <span className="text-white">vigil</span>.<span className="text-yellow-400">protectedSend</span>(<span className="text-white">tx</span>);
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
