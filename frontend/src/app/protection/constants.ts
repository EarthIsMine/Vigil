export const PROTECTION_STATS = [
  {
    title: 'Real-Time Detection',
    description:
      'Every swap is scored against pool state and searcher activity before submission.',
    delay: '',
  },
  {
    title: 'Sub-Millisecond Routing',
    description:
      'Risk scoring runs alongside your TX pipeline with no measurable round-trip overhead.',
    delay: 'float-up-d1',
  },
  {
    title: 'Jito Bundle Submission',
    description:
      'High-risk swaps are wrapped and submitted directly to the Block Engine.',
    delay: 'float-up-d2',
  },
  {
    title: 'Open Audit Trail',
    description:
      'Every blocked attack is recorded and exportable from your dashboard.',
    delay: 'float-up-d3',
  },
] as const;

export const HERO_FEATURES = [
  'Zero configuration required',
  'Sub-millisecond response times',
  'Free tier available',
] as const;

export interface HowItWorksStep {
  number: string;
  color: string;
  bgColor: string;
  borderColor: string;
  title: string;
  description: string;
  highlight: string;
  icon: 'eye' | 'route' | 'rebate';
  delay: string;
}

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    number: '1',
    color: 'text-vigil-green',
    bgColor: 'bg-vigil-green/10',
    borderColor: 'border-vigil-green',
    title: 'Real-Time TX Analysis',
    description:
      'Every swap is analyzed via Helius gRPC before submission — pool state, searcher activity, and slippage exposure are scored in under 1ms.',
    highlight: 'Pre-submission scoring',
    icon: 'eye',
    delay: '',
  },
  {
    number: '2',
    color: 'text-vigil-cyan',
    bgColor: 'bg-vigil-cyan/10',
    borderColor: 'border-vigil-cyan',
    title: 'Jito Bundle Submission',
    description:
      'High-risk TXs are wrapped in a Jito bundle and submitted directly to the Block Engine — invisible to searchers until the block is finalized.',
    highlight: 'Direct Block Engine routing',
    icon: 'route',
    delay: 'float-up-d1',
  },
  {
    number: '3',
    color: 'text-vigil-purple',
    bgColor: 'bg-vigil-purple/10',
    borderColor: 'border-vigil-purple',
    title: 'MEV Rebates',
    description:
      'Extract value from your own transactions. When MEV is available, you get the rebate instead of the attackers. Automatic distribution.',
    highlight: 'Automatic rebate distribution',
    icon: 'rebate',
    delay: 'float-up-d2',
  },
];

export interface Feature {
  color: string;
  bgColor: string;
  title: string;
  description: string;
}

export const FEATURES_LIST: Feature[] = [
  {
    color: 'text-vigil-green',
    bgColor: 'bg-vigil-green/10',
    title: 'Connection Wrapper',
    description:
      'Wrap any existing Solana Connection with Vigil in one line. Works with Phantom, Backpack, and any wallet adapter.',
  },
  {
    color: 'text-vigil-cyan',
    bgColor: 'bg-vigil-cyan/10',
    title: 'Jito Bundle Routing',
    description:
      'High-risk swaps are automatically routed through Jito Block Engine bundles, bypassing the public TX pipeline and eliminating sandwich opportunities.',
  },
  {
    color: 'text-vigil-purple',
    bgColor: 'bg-vigil-purple/10',
    title: 'Real-Time Analytics',
    description:
      'Detailed dashboards show every blocked attack, saved gas, and MEV rebates. Export reports for compliance.',
  },
  {
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    title: 'Webhook Alerts',
    description:
      'Get instant notifications when attacks are blocked. Integrate with Slack, Discord, or custom endpoints.',
  },
];

export interface PricingTier {
  name: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
  badge?: string;
  borderColor: string;
  ctaStyle: string;
  checkColor: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Community',
    price: '$0',
    priceSuffix: '/month',
    features: [
      'Up to 1,000 txs/month',
      'Core MEV protection',
      'Solana mainnet-beta',
      'Basic analytics',
      'Community support',
    ],
    cta: 'Get Started',
    href: '/dashboard',
    borderColor: 'border-vigil-border',
    ctaStyle:
      'border border-vigil-border hover:border-vigil-green/50 text-white',
    checkColor: 'text-vigil-green',
  },
  {
    name: 'Professional',
    price: '$499',
    priceSuffix: '/month',
    features: [
      'Unlimited transactions',
      'Advanced MEV rebates',
      'All networks supported',
      'Advanced analytics & reports',
      'Webhook integrations',
      'Priority support (24h)',
    ],
    cta: 'Start Free Trial',
    href: '/dashboard',
    highlighted: true,
    badge: 'MOST POPULAR',
    borderColor: 'border-vigil-green',
    ctaStyle: 'bg-vigil-green hover:bg-vigil-emerald text-white',
    checkColor: 'text-vigil-green',
  },
  {
    name: 'Sovereign',
    price: 'Custom',
    features: [
      'Dedicated relay nodes',
      'Custom SLA guarantees',
      'White-label options',
      'On-premise deployment',
      'Dedicated account manager',
      '24/7 priority support',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    borderColor: 'border-vigil-border',
    ctaStyle:
      'border border-vigil-purple hover:bg-vigil-purple/10 text-white',
    checkColor: 'text-vigil-purple',
  },
];

export interface FooterLink {
  label: string;
  href: string;
  isInternal?: boolean;
  disabled?: boolean;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export const FOOTER_LINKS: FooterLinkGroup[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Dashboard', href: '/dashboard', isInternal: true },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Documentation', href: '/docs', isInternal: true },
      { label: 'API Reference', href: '#', disabled: true },
      { label: 'SDK', href: '#', disabled: true },
      { label: 'GitHub', href: '#', disabled: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#', disabled: true },
      { label: 'Blog', href: '#', disabled: true },
      { label: 'Careers', href: '#', disabled: true },
      { label: 'Contact', href: '/contact', isInternal: true },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#', disabled: true },
      { label: 'Terms', href: '#', disabled: true },
      { label: 'Security', href: '#', disabled: true },
      { label: 'Compliance', href: '#', disabled: true },
    ],
  },
];
