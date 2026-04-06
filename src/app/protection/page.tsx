import Link from 'next/link';

export default function ProtectionPage() {
  return (
    <div className="bg-vigil-black min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-vigil-black/80 backdrop-blur-xl border-b border-vigil-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vigil-green to-vigil-emerald flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-display text-xl font-bold text-white">Vigil</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-vigil-muted hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-vigil-muted hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-vigil-muted hover:text-white transition-colors">Pricing</a>
            <Link href="/dashboard" className="text-sm text-vigil-muted hover:text-white transition-colors">Dashboard</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-sm text-vigil-muted hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="/dashboard" className="px-4 py-2 bg-vigil-green hover:bg-vigil-emerald text-white rounded-lg text-sm font-medium transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
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
                <div className="flex items-center gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Zero configuration required</span>
                </div>
                <div className="flex items-center gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Sub-millisecond response times</span>
                </div>
                <div className="flex items-center gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Free tier available</span>
                </div>
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
                      <span className="text-purple-400">import</span> <span className="text-white">{'{'} VigilShield {'}'}</span> <span className="text-purple-400">from</span> <span className="text-emerald-400">'@vigil/shield'</span>
                      {'\n\n'}
                      <span className="text-purple-400">const</span> <span className="text-white">shield</span> <span className="text-purple-400">=</span> <span className="text-cyan-400">VigilShield</span>.<span className="text-yellow-400">configure</span>({'{'}
                      {'\n  '}
                      <span className="text-white">protection</span>: <span className="text-emerald-400">'maximum'</span>,
                      {'\n  '}
                      <span className="text-white">mevRebates</span>: <span className="text-orange-400">true</span>,
                      {'\n  '}
                      <span className="text-white">networks</span>: [
                      {'\n    '}
                      <span className="text-emerald-400">'ethereum'</span>,
                      {'\n    '}
                      <span className="text-emerald-400">'arbitrum'</span>,
                      {'\n    '}
                      <span className="text-emerald-400">'base'</span>
                      {'\n  '}],
                      {'\n  '}
                      <span className="text-white">webhook</span>: <span className="text-emerald-400">'https://api.example.com/alerts'</span>
                      {'\n'}{'}'});
                      {'\n\n'}
                      <span className="text-purple-400">export</span> <span className="text-purple-400">default</span> <span className="text-white">shield</span>;
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Protection Stats */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-vigil-card border border-vigil-border rounded-xl p-6 card-glow float-up">
              <div className="text-3xl font-display font-bold text-white mb-2">$4.21B</div>
              <div className="text-sm text-vigil-muted">Total Protected</div>
            </div>
            <div className="bg-vigil-card border border-vigil-border rounded-xl p-6 card-glow float-up float-up-d1">
              <div className="text-3xl font-display font-bold text-white mb-2">842,109</div>
              <div className="text-sm text-vigil-muted">Attacks Blocked</div>
            </div>
            <div className="bg-vigil-card border border-vigil-border rounded-xl p-6 card-glow float-up float-up-d2">
              <div className="text-3xl font-display font-bold text-white mb-2">&lt;0.4ms</div>
              <div className="text-sm text-vigil-muted">Avg Latency</div>
            </div>
            <div className="bg-vigil-card border border-vigil-border rounded-xl p-6 card-glow float-up float-up-d3">
              <div className="text-3xl font-display font-bold text-white mb-2">99.99%</div>
              <div className="text-sm text-vigil-muted">Network Health</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-lg text-vigil-muted max-w-2xl mx-auto">
              Three-layer protection system that runs in real-time with zero overhead
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Predictive Scanning */}
            <div className="relative bg-vigil-card border border-vigil-border rounded-xl p-8 card-glow float-up">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-vigil-green/20 border border-vigil-green rounded-xl flex items-center justify-center">
                <span className="font-display text-xl font-bold text-vigil-green">1</span>
              </div>
              <div className="w-12 h-12 bg-vigil-green/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-vigil-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">Predictive Scanning</h3>
              <p className="text-vigil-muted mb-6">
                AI-powered mempool analysis detects sandwich attacks before they execute. Machine learning models trained on 10M+ attack patterns.
              </p>
              <div className="pt-4 border-t border-vigil-border">
                <div className="text-sm text-vigil-muted">Detection Rate</div>
                <div className="text-2xl font-display font-bold text-vigil-green">99.8%</div>
              </div>
            </div>

            {/* Private Relay Routing */}
            <div className="relative bg-vigil-card border border-vigil-border rounded-xl p-8 card-glow float-up float-up-d1">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-vigil-cyan/20 border border-vigil-cyan rounded-xl flex items-center justify-center">
                <span className="font-display text-xl font-bold text-vigil-cyan">2</span>
              </div>
              <div className="w-12 h-12 bg-vigil-cyan/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-vigil-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">Private Relay Routing</h3>
              <p className="text-vigil-muted mb-6">
                Your transactions bypass the public mempool entirely. Direct routing to trusted block builders keeps you invisible to attackers.
              </p>
              <div className="pt-4 border-t border-vigil-border">
                <div className="text-sm text-vigil-muted">Network Nodes</div>
                <div className="text-2xl font-display font-bold text-vigil-cyan">2,847</div>
              </div>
            </div>

            {/* MEV Rebates */}
            <div className="relative bg-vigil-card border border-vigil-border rounded-xl p-8 card-glow float-up float-up-d2">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-vigil-purple/20 border border-vigil-purple rounded-xl flex items-center justify-center">
                <span className="font-display text-xl font-bold text-vigil-purple">3</span>
              </div>
              <div className="w-12 h-12 bg-vigil-purple/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-vigil-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">MEV Rebates</h3>
              <p className="text-vigil-muted mb-6">
                Extract value from your own transactions. When MEV is available, you get the rebate instead of the attackers. Automatic distribution.
              </p>
              <div className="pt-4 border-t border-vigil-border">
                <div className="text-sm text-vigil-muted">Total Rebates</div>
                <div className="text-2xl font-display font-bold text-vigil-purple">$2.4M</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Feature List */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-4xl font-bold text-white mb-4">Built For Developers</h2>
                <p className="text-lg text-vigil-muted">
                  Drop-in replacement for ethers.js and web3.js providers. No code changes required.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-vigil-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-vigil-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white mb-2">Provider Wrapper</h3>
                    <p className="text-vigil-muted">
                      Wrap any existing provider with Vigil protection in a single line of code. Works with MetaMask, WalletConnect, and more.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-vigil-cyan/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-vigil-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white mb-2">Multi-Chain Support</h3>
                    <p className="text-vigil-muted">
                      Protection across Ethereum, Arbitrum, Optimism, Base, and Polygon. Single SDK, unified protection.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-vigil-purple/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-vigil-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white mb-2">Real-Time Analytics</h3>
                    <p className="text-vigil-muted">
                      Detailed dashboards show every blocked attack, saved gas, and MEV rebates. Export reports for compliance.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white mb-2">Webhook Alerts</h3>
                    <p className="text-vigil-muted">
                      Get instant notifications when attacks are blocked. Integrate with Slack, Discord, or custom endpoints.
                    </p>
                  </div>
                </div>
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
                    <span className="text-vigil-green">Shield active on Ethereum mainnet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-vigil-muted max-w-2xl mx-auto">
              Start free, upgrade when you need more. All plans include core MEV protection.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Community */}
            <div className="bg-vigil-card border border-vigil-border rounded-xl p-8 card-glow">
              <div className="mb-6">
                <h3 className="font-display text-xl font-bold text-white mb-2">Community</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-bold text-white">$0</span>
                  <span className="text-vigil-muted">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Up to 1,000 txs/month</span>
                </li>
                <li className="flex items-start gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Core MEV protection</span>
                </li>
                <li className="flex items-start gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Ethereum mainnet</span>
                </li>
                <li className="flex items-start gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-start gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Community support</span>
                </li>
              </ul>
              <Link href="/dashboard" className="block w-full px-6 py-3 border border-vigil-border hover:border-vigil-green/50 text-white rounded-lg font-medium text-center transition-colors">
                Get Started
              </Link>
            </div>

            {/* Professional - Highlighted */}
            <div className="bg-vigil-card border-2 border-vigil-green rounded-xl p-8 card-glow relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-vigil-green text-white text-xs font-bold rounded-full">
                MOST POPULAR
              </div>
              <div className="mb-6">
                <h3 className="font-display text-xl font-bold text-white mb-2">Professional</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-bold text-white">$499</span>
                  <span className="text-vigil-muted">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Unlimited transactions</span>
                </li>
                <li className="flex items-start gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Advanced MEV rebates</span>
                </li>
                <li className="flex items-start gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>All networks supported</span>
                </li>
                <li className="flex items-start gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Advanced analytics & reports</span>
                </li>
                <li className="flex items-start gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Webhook integrations</span>
                </li>
                <li className="flex items-start gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Priority support (24h)</span>
                </li>
              </ul>
              <Link href="/dashboard" className="block w-full px-6 py-3 bg-vigil-green hover:bg-vigil-emerald text-white rounded-lg font-medium text-center transition-colors">
                Start Free Trial
              </Link>
            </div>

            {/* Sovereign */}
            <div className="bg-vigil-card border border-vigil-border rounded-xl p-8 card-glow">
              <div className="mb-6">
                <h3 className="font-display text-xl font-bold text-white mb-2">Sovereign</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-bold text-white">Custom</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-purple flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Dedicated relay nodes</span>
                </li>
                <li className="flex items-start gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-purple flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Custom SLA guarantees</span>
                </li>
                <li className="flex items-start gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-purple flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>White-label options</span>
                </li>
                <li className="flex items-start gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-purple flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>On-premise deployment</span>
                </li>
                <li className="flex items-start gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-purple flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2 text-vigil-muted">
                  <svg className="w-5 h-5 text-vigil-purple flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>24/7 priority support</span>
                </li>
              </ul>
              <Link href="/contact" className="block w-full px-6 py-3 border border-vigil-purple hover:bg-vigil-purple/10 text-white rounded-lg font-medium text-center transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="bg-vigil-card border border-vigil-border rounded-2xl p-12 text-center card-glow relative overflow-hidden">
            <div className="absolute inset-0 hero-glow opacity-30"></div>
            <div className="relative z-10">
              <h2 className="font-display text-4xl font-bold mb-4">
                <span className="text-white">Stop Losing Money to</span>
                <br />
                <span className="gradient-text">MEV Attacks Today</span>
              </h2>
              <p className="text-lg text-vigil-muted mb-8 max-w-2xl mx-auto">
                Join thousands of developers protecting their users from sandwich attacks, front-running, and MEV extraction.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/dashboard" className="px-8 py-4 bg-vigil-green hover:bg-vigil-emerald text-white rounded-lg font-medium transition-colors">
                  Start Protecting Now
                </Link>
                <Link href="/docs" className="px-8 py-4 border border-vigil-border hover:border-vigil-green/50 text-white rounded-lg font-medium transition-colors">
                  Read Documentation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-vigil-border py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Logo Column */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vigil-green to-vigil-emerald flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="font-display text-xl font-bold text-white">Vigil</span>
              </Link>
              <p className="text-sm text-vigil-muted">
                Real-time MEV protection for everyone.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-display font-bold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-sm text-vigil-muted hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-sm text-vigil-muted hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="text-sm text-vigil-muted hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/dashboard" className="text-sm text-vigil-muted hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            {/* Developers */}
            <div>
              <h4 className="font-display font-bold text-white mb-4">Developers</h4>
              <ul className="space-y-3">
                <li><Link href="/docs" className="text-sm text-vigil-muted hover:text-white transition-colors">Documentation</Link></li>
                <li><a href="#" className="text-sm text-vigil-muted hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-sm text-vigil-muted hover:text-white transition-colors">SDK</a></li>
                <li><a href="#" className="text-sm text-vigil-muted hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-display font-bold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-vigil-muted hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-vigil-muted hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-vigil-muted hover:text-white transition-colors">Careers</a></li>
                <li><Link href="/contact" className="text-sm text-vigil-muted hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-display font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-vigil-muted hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-sm text-vigil-muted hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-sm text-vigil-muted hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-sm text-vigil-muted hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-vigil-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-vigil-muted">
              © 2024 Vigil. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-vigil-muted hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-vigil-muted hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-vigil-muted hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
