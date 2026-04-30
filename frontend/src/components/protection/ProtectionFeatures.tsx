import { FEATURES_LIST } from '@/app/protection/constants';

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  'Connection Wrapper': (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  ),
  'Jito Bundle Routing': (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  'Real-Time Analytics': (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  ),
  'Webhook Alerts': (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  ),
};

export default function ProtectionFeatures() {
  return (
    <section id="features" className="py-20 relative fade-up fade-up-d3">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Feature List */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-4xl font-bold text-white mb-4">Built For Developers</h2>
              <p className="text-lg text-vigil-muted">
                Drop-in wrapper for <code className="text-vigil-green text-base">@solana/web3.js</code>. No transaction logic changes required.
              </p>
            </div>

            <div className="space-y-6">
              {FEATURES_LIST.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <svg className={`w-6 h-6 ${feature.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {FEATURE_ICONS[feature.title]}
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-vigil-muted">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Terminal Animation */}
          <div className="float-up">
            <div className="bg-vigil-card border border-vigil-border rounded-xl overflow-hidden card-glow">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-vigil-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-vigil-green/80"></div>
                </div>
                <span className="text-xs text-vigil-muted font-mono ml-2">terminal</span>
              </div>
              <div className="p-6 font-mono text-sm space-y-2">
                <div className="text-vigil-muted">$ npm install @vigil/shield</div>
                <div className="text-vigil-green">✓ Installed @vigil/shield@2.4.0</div>
                <div className="text-vigil-muted mt-4">$ npm run build</div>
                <div className="text-vigil-cyan">› Building production bundle...</div>
                <div className="text-vigil-green">✓ Protection layer initialized</div>
                <div className="text-vigil-green">✓ Connected to relay network</div>
                <div className="text-vigil-green">✓ MEV scanner active</div>
                <div className="text-white mt-4">
                  <span className="text-vigil-purple">INFO</span> Your transactions are now protected
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="pulse-dot bg-vigil-green"></span>
                  <span className="text-vigil-green">Shield active on Solana mainnet-beta</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
