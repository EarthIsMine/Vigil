import { HOW_IT_WORKS_STEPS } from '@/app/protection/constants';
import type { HowItWorksStep } from '@/app/protection/constants';

function StepIcon({ icon, color }: { icon: HowItWorksStep['icon']; color: string }) {
  switch (icon) {
    case 'eye':
      return (
        <svg className={`w-6 h-6 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      );
    case 'route':
      return (
        <svg className={`w-6 h-6 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      );
    case 'rebate':
      return (
        <svg className={`w-6 h-6 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 relative fade-up fade-up-d2">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-lg text-vigil-muted max-w-2xl mx-auto">
            Three-layer protection system that runs in real-time with zero overhead
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div
              key={step.number}
              className={`relative bg-vigil-card border border-vigil-border rounded-xl p-8 card-glow float-up ${step.delay}`}
            >
              <div className={`absolute -top-4 -left-4 w-12 h-12 ${step.bgColor.replace('/10', '/20')} border ${step.borderColor} rounded-xl flex items-center justify-center`}>
                <span className={`font-display text-xl font-bold ${step.color}`}>{step.number}</span>
              </div>
              <div className={`w-12 h-12 ${step.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                <StepIcon icon={step.icon} color={step.color} />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-vigil-muted mb-6">{step.description}</p>
              <div className="pt-4 border-t border-vigil-border">
                <div className={`text-sm font-display font-bold ${step.color}`}>{step.highlight}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
