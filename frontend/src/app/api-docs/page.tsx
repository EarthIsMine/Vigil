'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const NAV_SECTIONS = [
  {
    group: 'Getting Started',
    items: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'authentication', label: 'Authentication' },
    ],
  },
  {
    group: 'Core API',
    items: [
      { id: 'send-transaction', label: 'Send Transaction' },
      { id: 'mev-receipt', label: 'MEV Receipt' },
      { id: 'protection-status', label: 'Protection Status' },
    ],
  },
  {
    group: 'System',
    items: [
      { id: 'rate-limits', label: 'Rate Limits' },
      { id: 'settings', label: 'Settings' },
    ],
  },
];

function ParamRow({
  name,
  type,
  required,
  children,
  dark,
}: {
  name: string;
  type: string;
  required?: boolean;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className={`px-5 py-4 ${dark ? 'bg-surface' : 'bg-surface-100'}`}>
      <div className="flex items-center gap-2 mb-1">
        <code className="font-mono text-sm text-on-surf">{name}</code>
        {required ? (
          <span className="font-mono text-[10px] uppercase tracking-wider text-secondary font-semibold">required</span>
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-semibold">optional</span>
        )}
        <span className="font-mono text-[10px] text-muted">{type}</span>
      </div>
      <div className="text-xs text-muted leading-relaxed">{children}</div>
    </div>
  );
}

function MethodBadge({ method }: { method: 'GET' | 'POST' | 'DELETE' }) {
  const colors = {
    GET: 'bg-primary-dim text-primary',
    POST: 'bg-sec-dim text-secondary',
    DELETE: 'bg-error-dim text-error',
  };
  return (
    <span className={`font-mono text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 ${colors[method]}`}>
      {method}
    </span>
  );
}

function CodeBlock({ lang, label, color = 'secondary', children }: { lang: string; label: string; color?: string; children: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const dotColor = color === 'secondary' ? 'bg-secondary' : 'bg-primary';

  return (
    <div className="bg-surface overflow-hidden">
      <div className="px-4 py-2.5 bg-surface-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 ${dotColor}`} />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted font-semibold">{label}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-muted hover:text-on-surf transition-colors"
        >
          <span className="material-symbols-outlined text-base">
            {copied ? 'check' : 'content_copy'}
          </span>
        </button>
      </div>
      <pre className="px-4 py-4 overflow-x-auto text-[13px] leading-7">
        <code
          className="font-mono text-on-surf"
          dangerouslySetInnerHTML={{ __html: children }}
        />
      </pre>
    </div>
  );
}

const TS_EXAMPLE = `<span class="text-primary">import</span> { <span class="text-secondary">VigilClient</span> } <span class="text-primary">from</span> <span class="text-secondary">'@vigil/sdk'</span>;

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

const SEND_RESPONSE = `{
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

const RECEIPT_RESPONSE = `{
  <span class="text-primary">"hash"</span>: <span class="text-secondary">"5UfDuX...9kPqR"</span>,
  <span class="text-primary">"mev_captured"</span>: <span class="text-warning">0.00823</span>,
  <span class="text-primary">"rebate_amount"</span>: <span class="text-warning">0.00691</span>,
  <span class="text-primary">"rebate_pct"</span>: <span class="text-warning">84</span>,
  <span class="text-primary">"settlement_status"</span>: <span class="text-secondary">"settled"</span>,
  <span class="text-primary">"rebate_tx"</span>: <span class="text-secondary">"3xRt7m...Wk2pN"</span>,
  <span class="text-primary">"settled_at"</span>: <span class="text-secondary">"2026-04-07T09:23:04Z"</span>
}`;

export default function ApiDocsPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  const sectionIds = NAV_SECTIONS.flatMap((g) => g.items.map((i) => i.id));

  useEffect(() => {
    const els = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -75%' }
    );

    els.forEach((el) => observer.observe(el));
    return () => els.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <div className="min-h-screen bg-surface-100 text-on-surf">

      <div className="flex pt-14 min-h-screen">

        {/* LEFT SIDEBAR */}
        <aside className="w-56 flex-shrink-0 bg-surface-100 fixed top-14 bottom-0 left-0 overflow-y-auto py-6 px-4 hidden lg:block">
          {NAV_SECTIONS.map((group) => (
            <div key={group.group} className="mb-6">
              <p className="text-[10px] uppercase tracking-widest text-muted font-semibold mb-2 px-3 font-mono">
                {group.group}
              </p>
              {group.items.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block text-sm px-3 py-1.5 transition-colors ${
                    activeSection === item.id
                      ? 'text-primary bg-primary-dim/40'
                      : 'text-muted hover:text-on-surf hover:bg-surface-200'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          ))}
          <div className="mt-8 mx-3 p-3 bg-surface">
            <p className="text-xs text-muted">Need help?</p>
            <a href="#" className="text-xs text-primary hover:underline mt-1 inline-block">Join Discord →</a>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 lg:ml-56">
          <div className="max-w-3xl px-6 py-12 lg:px-10">
            <div>

              {/* INTRODUCTION */}
              <section id="introduction" className="mb-16">
                <h1 className="font-display font-bold text-4xl text-on-surf mb-3">Vigil API Reference</h1>
                <p className="text-muted text-base leading-relaxed mb-8">
                  The Vigil API provides programmatic access to MEV-protected transaction submission,
                  real-time execution tracking, and rebate settlement on Solana.
                  Build with confidence — every transaction is shielded.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-surface mb-8">
                  <div className="bg-surface-200 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-secondary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-secondary text-xl">bolt</span>
                      </div>
                      <h3 className="font-display font-semibold text-on-surf text-sm">Sub-400ms Execution</h3>
                    </div>
                    <p className="text-muted text-xs leading-relaxed">
                      Optimized routing through Jito bundles and multi-path submission ensures your transactions land in under 400ms.
                    </p>
                  </div>
                  <div className="bg-surface-200 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-xl">account_balance_wallet</span>
                      </div>
                      <h3 className="font-display font-semibold text-on-surf text-sm">Rebate Settlement</h3>
                    </div>
                    <p className="text-muted text-xs leading-relaxed">
                      Automated MEV rebates returned directly to your wallet. Track captured value via the receipt endpoint.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted bg-surface px-4 py-3">
                  <span className="material-symbols-outlined text-primary text-base">info</span>
                  <span>Base URL: <code className="font-mono text-primary">https://api.vigil.sh/v1</code></span>
                </div>
              </section>

              {/* AUTHENTICATION */}
              <section id="authentication" className="mb-16">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">lock</span>
                  <h2 className="font-display font-bold text-2xl text-on-surf">Authentication</h2>
                </div>
                <p className="text-muted text-sm leading-relaxed mb-6">
                  All API requests require a Bearer token in the{' '}
                  <code className="font-mono text-primary text-xs bg-surface px-1.5 py-0.5">Authorization</code>{' '}
                  header. Generate keys from the{' '}
                  <Link href="/dashboard" className="text-primary hover:underline">Vigil Dashboard</Link>.
                </p>

                <div className="bg-surface mb-4">
                  <div className="px-4 py-2.5 bg-surface-100 flex items-center">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted font-semibold">Header</span>
                  </div>
                  <pre className="px-4 py-4 overflow-x-auto">
                    <code className="font-mono text-sm text-on-surf">
                      Authorization: Bearer <span className="text-primary">vgl_sk_live_abc123...</span>
                    </code>
                  </pre>
                </div>

                <div className="flex items-start gap-2 text-xs text-warning bg-warning/5 px-4 py-3">
                  <span className="material-symbols-outlined text-base mt-0.5">warning</span>
                  <span>Keep your secret key secure. Do not expose it in client-side code or public repositories.</span>
                </div>
              </section>

              {/* SEND TRANSACTION */}
              <section id="send-transaction" className="mb-16">
                <div className="flex items-center gap-3 mb-4">
                  <MethodBadge method="POST" />
                  <h2 className="font-display font-bold text-2xl text-on-surf">Send Transaction</h2>
                </div>
                <p className="text-muted text-sm leading-relaxed mb-2">
                  Submit a serialized transaction for MEV-protected execution. Returns a transaction hash and protection metadata.
                </p>
                <div className="font-mono text-sm text-primary bg-surface px-4 py-2.5 mb-6 inline-block">
                  POST /v1/tx/send
                </div>

                <h3 className="font-display font-semibold text-on-surf text-base mb-3">Parameters</h3>
                <div className="bg-surface mb-6 divide-y divide-outline/10">
                  <ParamRow name="transaction" type="string" required dark>
                    Base64-encoded serialized transaction. Must be a valid Solana transaction.
                  </ParamRow>
                  <ParamRow name="protection_level" type="enum">
                    Level of MEV protection.{' '}
                    {['standard', 'enhanced', 'maximum'].map((v) => (
                      <code key={v} className="font-mono text-[11px] bg-surface text-primary px-1.5 py-0.5 mr-1">{v}</code>
                    ))}
                  </ParamRow>
                  <ParamRow name="skip_preflight" type="boolean" dark>
                    Skip preflight simulation before submitting. Default:{' '}
                    <code className="font-mono text-primary text-[11px]">false</code>
                  </ParamRow>
                </div>

                <div className="space-y-px mt-6">
                  <CodeBlock lang="ts" label="TypeScript" color="secondary">{TS_EXAMPLE}</CodeBlock>
                  <CodeBlock lang="json" label="200 OK — Response" color="secondary">{SEND_RESPONSE}</CodeBlock>
                </div>
              </section>

              {/* MEV RECEIPT */}
              <section id="mev-receipt" className="mb-16">
                <div className="flex items-center gap-3 mb-4">
                  <MethodBadge method="GET" />
                  <h2 className="font-display font-bold text-2xl text-on-surf">MEV Receipt</h2>
                </div>
                <p className="text-muted text-sm leading-relaxed mb-2">
                  Retrieve the MEV protection receipt for a submitted transaction.
                  Includes captured MEV value, rebate amount, and settlement status.
                </p>
                <div className="font-mono text-sm text-primary bg-surface px-4 py-2.5 mb-6 inline-block">
                  GET /v1/tx/<span className="text-secondary">{'{hash}'}</span>/receipt
                </div>

                <h3 className="font-display font-semibold text-on-surf text-base mb-3">Path Parameters</h3>
                <div className="bg-surface mb-6">
                  <ParamRow name="hash" type="string" required dark>
                    The transaction signature returned from the send endpoint.
                  </ParamRow>
                </div>

                <h3 className="font-display font-semibold text-on-surf text-base mb-3">Response Fields</h3>
                <div className="bg-surface divide-y divide-outline/10 mb-6">
                  <ParamRow name="mev_captured" type="number" dark>Total MEV value captured (in SOL).</ParamRow>
                  <ParamRow name="rebate_amount" type="number">Rebate returned to user wallet (in SOL).</ParamRow>
                  <ParamRow name="settlement_status" type="enum" dark>
                    Current state:{' '}
                    {['pending', 'settled', 'failed'].map((v) => (
                      <code key={v} className="font-mono text-[11px] bg-surface text-primary px-1.5 py-0.5 mr-1">{v}</code>
                    ))}
                  </ParamRow>
                </div>

                <div className="mt-6">
                  <CodeBlock lang="json" label="MEV Receipt — Response" color="primary">{RECEIPT_RESPONSE}</CodeBlock>
                </div>
              </section>

              {/* PROTECTION STATUS */}
              <section id="protection-status" className="mb-16">
                <div className="flex items-center gap-3 mb-4">
                  <MethodBadge method="GET" />
                  <h2 className="font-display font-bold text-2xl text-on-surf">Protection Status</h2>
                </div>
                <p className="text-muted text-sm leading-relaxed mb-2">
                  Check the real-time status of MEV protection services, including current latency and active protection routes.
                </p>
                <div className="font-mono text-sm text-primary bg-surface px-4 py-2.5 mb-6 inline-block">
                  GET /v1/protection/status
                </div>

                <h3 className="font-display font-semibold text-on-surf text-base mb-3">Response Fields</h3>
                <div className="bg-surface divide-y divide-outline/10">
                  <ParamRow name="status" type="enum" dark>
                    Overall service health:{' '}
                    {['operational', 'degraded', 'outage'].map((v) => (
                      <code key={v} className="font-mono text-[11px] bg-surface text-primary px-1.5 py-0.5 mr-1">{v}</code>
                    ))}
                  </ParamRow>
                  <ParamRow name="jito_bundle_latency_ms" type="number">Current average Jito bundle submission latency in ms.</ParamRow>
                  <ParamRow name="active_routes" type="number" dark>Number of active protection routing paths.</ParamRow>
                </div>
              </section>

              {/* RATE LIMITS */}
              <section id="rate-limits" className="mb-16">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">speed</span>
                  <h2 className="font-display font-bold text-2xl text-on-surf">Rate Limits</h2>
                </div>
                <p className="text-muted text-sm leading-relaxed mb-6">
                  API requests are rate-limited per API key. Limits vary by plan tier.
                  Exceeded limits return <code className="font-mono text-primary text-xs bg-surface px-1.5 py-0.5">429 Too Many Requests</code>.
                </p>
                <div className="bg-surface overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-surface-200">
                        {['Plan', 'Req / min', 'Burst'].map((h) => (
                          <th key={h} className="px-5 py-3 text-left font-mono text-xs uppercase tracking-wider text-muted font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { plan: 'Community', rpm: '60', burst: '10' },
                        { plan: 'Professional', rpm: '600', burst: '50' },
                        { plan: 'Sovereign', rpm: 'Unlimited', burst: 'Custom' },
                      ].map((row, i) => (
                        <tr key={row.plan} className={`${i % 2 === 0 ? 'bg-surface-100' : 'bg-surface'} hover:bg-surface-300 transition-colors`}>
                          <td className="px-5 py-3 font-medium text-on-surf">{row.plan}</td>
                          <td className="px-5 py-3 font-mono text-on-surf">{row.rpm}</td>
                          <td className="px-5 py-3 font-mono text-on-surf">{row.burst}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* SETTINGS */}
              <section id="settings" className="mb-16">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">settings</span>
                  <h2 className="font-display font-bold text-2xl text-on-surf">Settings</h2>
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  Manage your API keys, webhook endpoints, default protection levels, and rebate wallet addresses from the{' '}
                  <Link href="/dashboard" className="text-primary hover:underline">Vigil Dashboard</Link>.
                  Programmatic configuration via API coming soon.
                </p>
              </section>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
