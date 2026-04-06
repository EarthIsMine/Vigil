'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function ApiDocsPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  const introRef = useRef<HTMLElement>(null);
  const authRef = useRef<HTMLElement>(null);
  const sendTxRef = useRef<HTMLElement>(null);
  const receiptRef = useRef<HTMLElement>(null);
  const statusRef = useRef<HTMLElement>(null);
  const rateLimitsRef = useRef<HTMLElement>(null);
  const settingsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -66%',
        threshold: 0,
      }
    );

    const refs = [introRef, authRef, sendTxRef, receiptRef, statusRef, rateLimitsRef, settingsRef];
    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-vigil-bg text-vigil-text">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-vigil-bg/90 backdrop-blur border-b border-vigil-border-dark z-50">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vigil-accent-purple to-vigil-cyan flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-bold">VIGIL</div>
                <div className="text-xs text-vigil-muted">API Reference</div>
              </div>
            </Link>
            <span className="px-2 py-1 text-xs rounded-md bg-vigil-surface border border-vigil-border-dark">
              v1.0.0
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-vigil-muted hover:text-vigil-text transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard" className="px-4 py-2 text-sm rounded-lg bg-vigil-accent-purple hover:bg-vigil-accent-light transition-colors">
              Get API Key
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex">
        {/* Left Sidebar */}
        <aside className="hidden md:block w-60 fixed left-0 top-16 bottom-0 border-r border-vigil-border-dark overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <div className="text-xs font-semibold text-vigil-muted mb-3 uppercase tracking-wider">
                Getting Started
              </div>
              <div className="space-y-1">
                <a
                  href="#introduction"
                  className={`api-sidebar-link ${activeSection === 'introduction' ? 'active' : ''}`}
                >
                  Introduction
                </a>
                <a
                  href="#authentication"
                  className={`api-sidebar-link ${activeSection === 'authentication' ? 'active' : ''}`}
                >
                  Authentication
                </a>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-vigil-muted mb-3 uppercase tracking-wider">
                Core API
              </div>
              <div className="space-y-1">
                <a
                  href="#send-transaction"
                  className={`api-sidebar-link ${activeSection === 'send-transaction' ? 'active' : ''}`}
                >
                  Send Transaction
                </a>
                <a
                  href="#mev-receipt"
                  className={`api-sidebar-link ${activeSection === 'mev-receipt' ? 'active' : ''}`}
                >
                  MEV Receipt
                </a>
                <a
                  href="#protection-status"
                  className={`api-sidebar-link ${activeSection === 'protection-status' ? 'active' : ''}`}
                >
                  Protection Status
                </a>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-vigil-muted mb-3 uppercase tracking-wider">
                System
              </div>
              <div className="space-y-1">
                <a
                  href="#rate-limits"
                  className={`api-sidebar-link ${activeSection === 'rate-limits' ? 'active' : ''}`}
                >
                  Rate Limits
                </a>
                <a
                  href="#settings"
                  className={`api-sidebar-link ${activeSection === 'settings' ? 'active' : ''}`}
                >
                  Settings
                </a>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-lg bg-vigil-surface border border-vigil-border-dark">
              <div className="text-sm font-semibold mb-2">Need help?</div>
              <p className="text-xs text-vigil-muted mb-3">
                Join our Discord community for support and updates.
              </p>
              <a
                href="https://discord.gg/vigil"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-vigil-accent-purple hover:text-vigil-accent-light transition-colors"
              >
                Join Discord →
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-60 xl:mr-[420px] max-w-2xl mx-auto px-6 py-12">
          {/* Introduction */}
          <section id="introduction" ref={introRef} className="mb-16">
            <h1 className="text-4xl font-bold mb-4">API Reference</h1>
            <p className="text-lg text-vigil-muted mb-8">
              Welcome to the VIGIL API documentation. Our API enables you to protect transactions from MEV attacks and receive rebates on captured value.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="feature-card">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-vigil-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 className="font-semibold">Sub-400ms Execution</h3>
                </div>
                <p className="text-sm text-vigil-muted">
                  Lightning-fast transaction protection with minimal latency impact.
                </p>
              </div>

              <div className="feature-card">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-vigil-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold">Rebate Settlement</h3>
                </div>
                <p className="text-sm text-vigil-muted">
                  Automatic MEV value capture and rebate distribution to users.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-vigil-surface border border-vigil-border-dark">
              <div className="text-sm font-semibold mb-2">Base URL</div>
              <code className="text-sm text-vigil-accent-purple">https://api.vigil.sh</code>
            </div>
          </section>

          {/* Authentication */}
          <section id="authentication" ref={authRef} className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Authentication</h2>
            <p className="text-vigil-muted mb-6">
              All API requests require authentication using a Bearer token in the Authorization header.
            </p>

            <div className="p-4 rounded-lg bg-vigil-code border border-vigil-border-dark mb-6">
              <code className="text-sm">
                <span className="text-vigil-muted">Authorization:</span>{' '}
                <span className="text-vigil-accent-purple">Bearer YOUR_API_KEY</span>
              </code>
            </div>

            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <div className="text-sm font-semibold text-amber-300 mb-1">Keep your API key secret</div>
                  <div className="text-sm text-amber-200/80">
                    Never expose your API key in client-side code or public repositories.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Send Transaction */}
          <section id="send-transaction" ref={sendTxRef} className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Send Transaction</h2>
            <p className="text-vigil-muted mb-6">
              Submit a transaction with MEV protection and receive a transaction hash.
            </p>

            <div className="flex items-center gap-3 mb-4">
              <span className="method-badge bg-vigil-green/20 text-vigil-green border-vigil-green/30">
                POST
              </span>
              <code className="text-sm">/v1/tx/send</code>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Parameters</h3>
              <div className="border border-vigil-border-dark rounded-lg overflow-hidden">
                <div className="param-row">
                  <div className="flex-1">
                    <div className="font-mono text-sm text-vigil-accent-purple">transaction</div>
                    <div className="text-xs text-vigil-muted mt-1">string</div>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                      required
                    </span>
                  </div>
                  <div className="flex-[2]">
                    <div className="text-sm text-vigil-muted">
                      Signed transaction data (hex-encoded)
                    </div>
                  </div>
                </div>

                <div className="param-row">
                  <div className="flex-1">
                    <div className="font-mono text-sm text-vigil-accent-purple">protection_level</div>
                    <div className="text-xs text-vigil-muted mt-1">enum</div>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs px-2 py-1 rounded bg-vigil-surface text-vigil-muted border border-vigil-border-dark">
                      optional
                    </span>
                  </div>
                  <div className="flex-[2]">
                    <div className="text-sm text-vigil-muted mb-2">
                      Level of MEV protection (default: standard)
                    </div>
                    <code className="text-xs text-vigil-accent-light">standard | aggressive</code>
                  </div>
                </div>

                <div className="param-row border-b-0">
                  <div className="flex-1">
                    <div className="font-mono text-sm text-vigil-accent-purple">skip_preflight</div>
                    <div className="text-xs text-vigil-muted mt-1">boolean</div>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs px-2 py-1 rounded bg-vigil-surface text-vigil-muted border border-vigil-border-dark">
                      optional
                    </span>
                  </div>
                  <div className="flex-[2]">
                    <div className="text-sm text-vigil-muted">
                      Skip simulation checks (default: false)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* MEV Receipt */}
          <section id="mev-receipt" ref={receiptRef} className="mb-16">
            <h2 className="text-3xl font-bold mb-4">MEV Receipt</h2>
            <p className="text-vigil-muted mb-6">
              Retrieve MEV capture details and rebate information for a transaction.
            </p>

            <div className="flex items-center gap-3 mb-4">
              <span className="method-badge bg-blue-500/20 text-blue-400 border-blue-500/30">
                GET
              </span>
              <code className="text-sm">/v1/tx/{'{hash}'}/receipt</code>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Path Parameters</h3>
              <div className="border border-vigil-border-dark rounded-lg overflow-hidden">
                <div className="param-row border-b-0">
                  <div className="flex-1">
                    <div className="font-mono text-sm text-vigil-accent-purple">hash</div>
                    <div className="text-xs text-vigil-muted mt-1">string</div>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                      required
                    </span>
                  </div>
                  <div className="flex-[2]">
                    <div className="text-sm text-vigil-muted">
                      Transaction hash (0x-prefixed hex string)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Response Fields</h3>
              <div className="border border-vigil-border-dark rounded-lg overflow-hidden">
                <div className="param-row">
                  <div className="flex-1">
                    <div className="font-mono text-sm text-vigil-accent-purple">mev_captured</div>
                    <div className="text-xs text-vigil-muted mt-1">string</div>
                  </div>
                  <div className="flex-[2]">
                    <div className="text-sm text-vigil-muted">
                      Total MEV value captured (in ETH)
                    </div>
                  </div>
                </div>

                <div className="param-row">
                  <div className="flex-1">
                    <div className="font-mono text-sm text-vigil-accent-purple">rebate_amount</div>
                    <div className="text-xs text-vigil-muted mt-1">string</div>
                  </div>
                  <div className="flex-[2]">
                    <div className="text-sm text-vigil-muted">
                      Rebate amount distributed to user (in ETH)
                    </div>
                  </div>
                </div>

                <div className="param-row border-b-0">
                  <div className="flex-1">
                    <div className="font-mono text-sm text-vigil-accent-purple">settlement_status</div>
                    <div className="text-xs text-vigil-muted mt-1">enum</div>
                  </div>
                  <div className="flex-[2]">
                    <div className="text-sm text-vigil-muted mb-2">
                      Status of rebate settlement
                    </div>
                    <code className="text-xs text-vigil-accent-light">pending | completed | failed</code>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Protection Status */}
          <section id="protection-status" ref={statusRef} className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Protection Status</h2>
            <p className="text-vigil-muted mb-6">
              Check the current status of the VIGIL protection network and your account limits.
            </p>

            <div className="flex items-center gap-3 mb-4">
              <span className="method-badge bg-blue-500/20 text-blue-400 border-blue-500/30">
                GET
              </span>
              <code className="text-sm">/v1/protection/status</code>
            </div>

            <div className="p-4 rounded-lg bg-vigil-surface border border-vigil-border-dark">
              <p className="text-sm text-vigil-muted">
                Returns real-time information about network health, protection coverage, and your current usage statistics.
              </p>
            </div>
          </section>

          {/* Rate Limits */}
          <section id="rate-limits" ref={rateLimitsRef} className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Rate Limits</h2>
            <p className="text-vigil-muted mb-6">
              API rate limits vary by plan tier. Exceeding limits will result in 429 responses.
            </p>

            <div className="border border-vigil-border-dark rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-vigil-surface">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Plan</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Requests/min</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Burst</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-vigil-border-dark">
                  <tr>
                    <td className="px-4 py-3 text-sm">Free</td>
                    <td className="px-4 py-3 text-sm text-vigil-muted">10</td>
                    <td className="px-4 py-3 text-sm text-vigil-muted">20</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm">Pro</td>
                    <td className="px-4 py-3 text-sm text-vigil-muted">100</td>
                    <td className="px-4 py-3 text-sm text-vigil-muted">200</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm">Enterprise</td>
                    <td className="px-4 py-3 text-sm text-vigil-muted">Custom</td>
                    <td className="px-4 py-3 text-sm text-vigil-muted">Custom</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Settings */}
          <section id="settings" ref={settingsRef} className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Settings</h2>
            <p className="text-vigil-muted mb-6">
              Configure your VIGIL protection preferences, notification settings, and account details in the dashboard.
            </p>

            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-2 text-vigil-accent-purple hover:text-vigil-accent-light transition-colors"
            >
              <span>View Settings</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </section>
        </main>

        {/* Right Code Panel */}
        <aside className="hidden xl:block w-[420px] fixed right-0 top-16 bottom-0 border-l border-vigil-border-dark overflow-y-auto code-panel">
          <div className="p-6 space-y-6">
            {/* TypeScript SDK Example */}
            <div>
              <div className="flex items-center justify-between px-4 py-2 bg-vigil-code-header rounded-t-lg border border-vigil-border-dark border-b-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-sm font-medium">TypeScript SDK</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`import { VigilClient } from '@vigil/sdk';

const vigil = new VigilClient({
  apiKey: process.env.VIGIL_API_KEY
});

// Send protected transaction
const result = await vigil.sendTransaction({
  transaction: '0x...',
  protectionLevel: 'standard'
});

console.log('Tx hash:', result.hash);

// Get MEV receipt
const receipt = await vigil.getReceipt(result.hash);
console.log('MEV captured:', receipt.mev_captured);`)}
                  className="text-vigil-muted hover:text-vigil-text transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <div className="p-4 bg-vigil-code rounded-b-lg border border-vigil-border-dark font-mono text-sm overflow-x-auto">
                <pre>
                  <code>
                    <span className="text-purple-400">import</span> {'{'}
                    <span className="text-blue-300"> VigilClient </span>
                    {'}'} <span className="text-purple-400">from</span>{' '}
                    <span className="text-green-300">'@vigil/sdk'</span>;{'\n\n'}
                    <span className="text-purple-400">const</span>{' '}
                    <span className="text-blue-300">vigil</span> ={' '}
                    <span className="text-purple-400">new</span>{' '}
                    <span className="text-yellow-300">VigilClient</span>({'{'}
                    {'\n  '}
                    <span className="text-blue-300">apiKey</span>:{' '}
                    <span className="text-cyan-300">process</span>.
                    <span className="text-cyan-300">env</span>.
                    <span className="text-blue-300">VIGIL_API_KEY</span>
                    {'\n'});{'\n\n'}
                    <span className="text-vigil-muted">// Send protected transaction</span>
                    {'\n'}
                    <span className="text-purple-400">const</span>{' '}
                    <span className="text-blue-300">result</span> ={' '}
                    <span className="text-purple-400">await</span>{' '}
                    <span className="text-cyan-300">vigil</span>.
                    <span className="text-yellow-300">sendTransaction</span>({'{'}
                    {'\n  '}
                    <span className="text-blue-300">transaction</span>:{' '}
                    <span className="text-green-300">'0x...'</span>,{'\n  '}
                    <span className="text-blue-300">protectionLevel</span>:{' '}
                    <span className="text-green-300">'standard'</span>
                    {'\n'});{'\n\n'}
                    <span className="text-cyan-300">console</span>.
                    <span className="text-yellow-300">log</span>(
                    <span className="text-green-300">'Tx hash:'</span>,{' '}
                    <span className="text-cyan-300">result</span>.
                    <span className="text-blue-300">hash</span>);{'\n\n'}
                    <span className="text-vigil-muted">// Get MEV receipt</span>
                    {'\n'}
                    <span className="text-purple-400">const</span>{' '}
                    <span className="text-blue-300">receipt</span> ={' '}
                    <span className="text-purple-400">await</span>{' '}
                    <span className="text-cyan-300">vigil</span>.
                    <span className="text-yellow-300">getReceipt</span>(
                    <span className="text-cyan-300">result</span>.
                    <span className="text-blue-300">hash</span>);{'\n'}
                    <span className="text-cyan-300">console</span>.
                    <span className="text-yellow-300">log</span>(
                    <span className="text-green-300">'MEV captured:'</span>,{' '}
                    <span className="text-cyan-300">receipt</span>.
                    <span className="text-blue-300">mev_captured</span>);
                  </code>
                </pre>
              </div>
            </div>

            {/* Send Transaction Response */}
            <div>
              <div className="flex items-center justify-between px-4 py-2 bg-vigil-code-header rounded-t-lg border border-vigil-border-dark border-b-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-vigil-green"></div>
                  <span className="text-sm font-medium">200 OK - Send Transaction</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`{
  "hash": "0xabcdef1234567890...",
  "status": "pending",
  "protection_level": "standard",
  "estimated_confirmation": "12s"
}`)}
                  className="text-vigil-muted hover:text-vigil-text transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <div className="p-4 bg-vigil-code rounded-b-lg border border-vigil-border-dark font-mono text-sm overflow-x-auto">
                <pre>
                  <code>
                    {'{'}
                    {'\n  '}<span className="text-blue-300">"hash"</span>:{' '}
                    <span className="text-green-300">"0xabcdef1234567890..."</span>,
                    {'\n  '}<span className="text-blue-300">"status"</span>:{' '}
                    <span className="text-green-300">"pending"</span>,
                    {'\n  '}<span className="text-blue-300">"protection_level"</span>:{' '}
                    <span className="text-green-300">"standard"</span>,
                    {'\n  '}<span className="text-blue-300">"estimated_confirmation"</span>:{' '}
                    <span className="text-green-300">"12s"</span>
                    {'\n'}
                    {'}'}
                  </code>
                </pre>
              </div>
            </div>

            {/* MEV Receipt Response */}
            <div>
              <div className="flex items-center justify-between px-4 py-2 bg-vigil-code-header rounded-t-lg border border-vigil-border-dark border-b-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-vigil-cyan"></div>
                  <span className="text-sm font-medium">MEV Receipt Response</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`{
  "hash": "0xabcdef1234567890...",
  "mev_captured": "0.0234",
  "rebate_amount": "0.0187",
  "settlement_status": "completed",
  "settlement_tx": "0xfedcba0987654321...",
  "timestamp": "2024-01-15T10:30:00Z"
}`)}
                  className="text-vigil-muted hover:text-vigil-text transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <div className="p-4 bg-vigil-code rounded-b-lg border border-vigil-border-dark font-mono text-sm overflow-x-auto">
                <pre>
                  <code>
                    {'{'}
                    {'\n  '}<span className="text-blue-300">"hash"</span>:{' '}
                    <span className="text-green-300">"0xabcdef1234567890..."</span>,
                    {'\n  '}<span className="text-blue-300">"mev_captured"</span>:{' '}
                    <span className="text-green-300">"0.0234"</span>,
                    {'\n  '}<span className="text-blue-300">"rebate_amount"</span>:{' '}
                    <span className="text-green-300">"0.0187"</span>,
                    {'\n  '}<span className="text-blue-300">"settlement_status"</span>:{' '}
                    <span className="text-green-300">"completed"</span>,
                    {'\n  '}<span className="text-blue-300">"settlement_tx"</span>:{' '}
                    <span className="text-green-300">"0xfedcba0987654321..."</span>,
                    {'\n  '}<span className="text-blue-300">"timestamp"</span>:{' '}
                    <span className="text-green-300">"2024-01-15T10:30:00Z"</span>
                    {'\n'}
                    {'}'}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
