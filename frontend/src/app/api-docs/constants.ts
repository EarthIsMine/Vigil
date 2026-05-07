export type EndpointMethod = 'GET' | 'POST' | 'DELETE';

export interface NavItem {
  id: string;
  method?: EndpointMethod;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export const NAV_SECTIONS: readonly NavGroup[] = [
  {
    group: 'Getting Started',
    items: [
      { id: 'introduction' },
      { id: 'authentication' },
    ],
  },
  {
    group: 'Core API',
    items: [
      { id: 'send-transaction', method: 'POST' },
      { id: 'mev-receipt', method: 'GET' },
      { id: 'protection-status', method: 'GET' },
    ],
  },
  {
    group: 'System',
    items: [
      { id: 'rate-limits' },
      { id: 'settings' },
    ],
  },
] as const;

// Markdown-backed groups (auto-derived from content/index.ts > DOCS).
export const MARKDOWN_GROUPS = ['detectorReadme', 'detectorDesign', 'rpcReadme'] as const;
export type MarkdownGroupKey = (typeof MARKDOWN_GROUPS)[number];

// Curated (hand-built JSX) pages under the Getting Started group.
export const GETTING_STARTED_PAGES = ['overview', 'quickstart'] as const;
export type GettingStartedPageId = (typeof GETTING_STARTED_PAGES)[number];

// All groups, in sidebar order. Getting Started first, then markdown groups.
export const DOC_GROUPS = ['gettingStarted', ...MARKDOWN_GROUPS] as const;
export type DocGroupKey = (typeof DOC_GROUPS)[number];

// Encoded as `${docGroupKey}:${sectionId}`.
export const DEFAULT_DOC_PAGE = 'gettingStarted:overview';

export function parseDocPageId(id: string): { group: DocGroupKey; section: string } | null {
  const [group, section] = id.split(':');
  if (!group || !section) return null;
  if (!(DOC_GROUPS as readonly string[]).includes(group)) return null;
  return { group: group as DocGroupKey, section };
}

export function isMarkdownGroup(key: DocGroupKey): key is MarkdownGroupKey {
  return (MARKDOWN_GROUPS as readonly string[]).includes(key);
}

export const TS_EXAMPLE = `<span class="text-primary">import</span> { <span class="text-secondary">VigilClient</span> } <span class="text-primary">from</span> <span class="text-secondary">'@vigil/sdk'</span>;

<span class="text-primary">const</span> vigil = <span class="text-primary">new</span> <span class="text-secondary">VigilClient</span>({
  apiKey: <span class="text-secondary">'vgl_sk_live_abc123...'</span>,
  network: <span class="text-secondary">'mainnet-beta'</span>,
});

<span class="text-primary">const</span> result = <span class="text-primary">await</span> vigil.<span class="text-secondary">sendTransaction</span>({
  transaction: serializedTx,
  protectionLevel: <span class="text-secondary">'enhanced'</span>,
  skipPreflight: <span class="text-primary">false</span>,
});

<span class="text-muted">// Get MEV receipt</span>
<span class="text-primary">const</span> receipt = <span class="text-primary">await</span> vigil.<span class="text-secondary">getReceipt</span>(
  result.hash
);`;

export const SEND_RESPONSE = `{
  <span class="text-primary">"success"</span>: <span class="text-secondary">true</span>,
  <span class="text-primary">"hash"</span>: <span class="text-secondary">"5UfDuX...9kPqR"</span>,
  <span class="text-primary">"protection"</span>: {
    <span class="text-primary">"level"</span>: <span class="text-secondary">"enhanced"</span>,
    <span class="text-primary">"route"</span>: <span class="text-secondary">"jito_bundle"</span>,
    <span class="text-primary">"latency_ms"</span>: <span class="text-warning">347</span>
  },
  <span class="text-primary">"slot"</span>: <span class="text-warning">281493027</span>,
  <span class="text-primary">"timestamp"</span>: <span class="text-secondary">"2026-04-07T09:23:01Z"</span>
}`;

export const RECEIPT_RESPONSE = `{
  <span class="text-primary">"hash"</span>: <span class="text-secondary">"5UfDuX...9kPqR"</span>,
  <span class="text-primary">"mev_captured"</span>: <span class="text-warning">0.00823</span>,
  <span class="text-primary">"rebate_amount"</span>: <span class="text-warning">0.00691</span>,
  <span class="text-primary">"rebate_pct"</span>: <span class="text-warning">84</span>,
  <span class="text-primary">"settlement_status"</span>: <span class="text-secondary">"settled"</span>,
  <span class="text-primary">"rebate_tx"</span>: <span class="text-secondary">"3xRt7m...Wk2pN"</span>,
  <span class="text-primary">"settled_at"</span>: <span class="text-secondary">"2026-04-07T09:23:04Z"</span>
}`;

export const RATE_LIMITS = [
  { plan: 'Community', rpm: '60', burst: '10' },
  { plan: 'Professional', rpm: '600', burst: '50' },
  { plan: 'Sovereign', rpm: 'Unlimited', burst: 'Custom' },
] as const;
