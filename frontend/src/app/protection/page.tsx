import ScrollDownIndicator from '@/components/ScrollDownIndicator';
import ProtectionHero from '@/components/protection/ProtectionHero';
import ProtectionStats from '@/components/protection/ProtectionStats';
import HowItWorks from '@/components/protection/HowItWorks';
import ProtectionFeatures from '@/components/protection/ProtectionFeatures';
import PricingSection from '@/components/protection/PricingSection';
import ProtectionCta from '@/components/protection/ProtectionCta';
import SiteFooter from '@/components/shared/SiteFooter';

export default function ProtectionPage() {
  return (
    <div className="bg-vigil-black min-h-screen">
      <ScrollDownIndicator sectionIds={['stats', 'how-it-works', 'features', 'pricing', 'cta']} />
      <ProtectionHero />
      <ProtectionStats />
      <HowItWorks />
      <ProtectionFeatures />
      <PricingSection />
      <ProtectionCta />
      <SiteFooter />
    </div>
  );
}
