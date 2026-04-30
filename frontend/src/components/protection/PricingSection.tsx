import Link from 'next/link';
import { PRICING_TIERS } from '@/app/protection/constants';

function CheckIcon({ color }: { color: string }) {
  return (
    <svg className={`w-5 h-5 ${color} flex-shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-vigil-muted max-w-2xl mx-auto">
            Start free, upgrade when you need more. All plans include core MEV protection.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`bg-vigil-card ${tier.highlighted ? 'border-2' : 'border'} ${tier.borderColor} rounded-xl p-8 card-glow ${tier.highlighted ? 'relative' : ''}`}
            >
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-vigil-green text-white text-xs font-bold rounded-full">
                  {tier.badge}
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-display text-xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-bold text-white">{tier.price}</span>
                  {tier.priceSuffix && <span className="text-vigil-muted">{tier.priceSuffix}</span>}
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-vigil-muted">
                    <CheckIcon color={tier.checkColor} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`block w-full px-6 py-3 ${tier.ctaStyle} rounded-lg font-medium text-center transition-colors`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
