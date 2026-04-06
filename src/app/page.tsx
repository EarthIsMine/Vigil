import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-surface px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-5xl font-bold text-on-surf mb-3">
          VIGIL
        </h1>
        <p className="font-body text-xl text-muted mb-12">
          Solana MEV Transparency Infrastructure — UI Prototype Pages
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/dashboard"
            className="group block bg-[#171b28] border-l-4 border-primary rounded-lg p-6 transition-all hover:bg-surface-300 hover:border-l-[6px] hover:shadow-lg"
          >
            <h2 className="font-display text-2xl font-semibold text-on-surf mb-3 group-hover:text-primary transition-colors">
              Main Dashboard
            </h2>
            <p className="font-body text-muted mb-4 leading-relaxed">
              Network-wide MEV monitoring. Hero stats, extraction chart, risky validators leaderboard, targeted pools, and live attack feed.
            </p>
            <span className="inline-block bg-surface-100 text-primary font-mono text-xs px-3 py-1 rounded">
              Page 1 — Dashboard
            </span>
          </Link>

          <Link
            href="/validator"
            className="group block bg-[#171b28] border-l-4 border-primary rounded-lg p-6 transition-all hover:bg-surface-300 hover:border-l-[6px] hover:shadow-lg"
          >
            <h2 className="font-display text-2xl font-semibold text-on-surf mb-3 group-hover:text-primary transition-colors">
              Validator Detail
            </h2>
            <p className="font-body text-muted mb-4 leading-relaxed">
              Individual validator MEV behavior analysis. Risk score, attack heatmap, attack vectors donut chart, targeted pools breakdown.
            </p>
            <span className="inline-block bg-surface-100 text-primary font-mono text-xs px-3 py-1 rounded">
              Page 2 — Validator
            </span>
          </Link>

          <Link
            href="/protection"
            className="group block bg-[#171b28] border-l-4 border-primary rounded-lg p-6 transition-all hover:bg-surface-300 hover:border-l-[6px] hover:shadow-lg"
          >
            <h2 className="font-display text-2xl font-semibold text-on-surf mb-3 group-hover:text-primary transition-colors">
              MEV Protection
            </h2>
            <p className="font-body text-muted mb-4 leading-relaxed">
              Product landing page. Hero section, code example, how-it-works, live protection stats, pricing tiers.
            </p>
            <span className="inline-block bg-surface-100 text-primary font-mono text-xs px-3 py-1 rounded">
              Page 3 — Protection
            </span>
          </Link>

          <Link
            href="/receipt"
            className="group block bg-[#171b28] border-l-4 border-primary rounded-lg p-6 transition-all hover:bg-surface-300 hover:border-l-[6px] hover:shadow-lg"
          >
            <h2 className="font-display text-2xl font-semibold text-on-surf mb-3 group-hover:text-primary transition-colors">
              MEV Receipt
            </h2>
            <p className="font-body text-muted mb-4 leading-relaxed">
              Per-user/per-TX MEV damage report. Search, wallet summary, transaction table, shareable receipt card.
            </p>
            <span className="inline-block bg-surface-100 text-primary font-mono text-xs px-3 py-1 rounded">
              Page 4 — Receipt
            </span>
          </Link>

          <Link
            href="/api-docs"
            className="group block bg-[#171b28] border-l-4 border-primary rounded-lg p-6 transition-all hover:bg-surface-300 hover:border-l-[6px] hover:shadow-lg"
          >
            <h2 className="font-display text-2xl font-semibold text-on-surf mb-3 group-hover:text-primary transition-colors">
              API Documentation
            </h2>
            <p className="font-body text-muted mb-4 leading-relaxed">
              Stripe-style API docs. Endpoints, parameters, code examples in TypeScript/Python, response samples.
            </p>
            <span className="inline-block bg-surface-100 text-primary font-mono text-xs px-3 py-1 rounded">
              Page 5 — API Docs
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
