import Link from 'next/link';

export default function ProtectionCta() {
  return (
    <section id="cta" className="py-20 relative">
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
  );
}
