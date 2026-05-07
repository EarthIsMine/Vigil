'use client';

import Link from 'next/link';
import ParamRow from './ParamRow';
import MethodBadge from './MethodBadge';
import CodeBlock from './CodeBlock';
import { TS_EXAMPLE, SEND_RESPONSE, RECEIPT_RESPONSE, RATE_LIMITS } from '@/app/api-docs/constants';
import { useDocs } from '@/app/api-docs/DocsContext';

function IntroductionSection() {
  const { t } = useDocs();
  return (
    <section className="fade-up">
      <p className="text-xs uppercase tracking-widest text-muted font-mono mb-3">
        {t.content.breadcrumb}
      </p>
      <h1 className="font-display font-bold text-4xl text-on-surf mb-2">
        {t.content.introduction.h1}
      </h1>
      <p className="text-muted text-base mb-6">{t.content.introduction.subtitle}</p>
      <p className="text-on-surf/80 text-base leading-relaxed mb-8">
        {t.content.introduction.intro}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-surface mb-8">
        <div className="bg-surface-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-secondary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-xl">bolt</span>
            </div>
            <h3 className="font-display font-semibold text-on-surf text-sm">
              {t.content.introduction.executionTitle}
            </h3>
          </div>
          <p className="text-muted text-xs leading-relaxed">
            {t.content.introduction.executionDesc}
          </p>
        </div>
        <div className="bg-surface-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">account_balance_wallet</span>
            </div>
            <h3 className="font-display font-semibold text-on-surf text-sm">
              {t.content.introduction.rebateTitle}
            </h3>
          </div>
          <p className="text-muted text-xs leading-relaxed">
            {t.content.introduction.rebateDesc}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted bg-surface px-4 py-3">
        <span className="material-symbols-outlined text-primary text-base">info</span>
        <span>
          {t.content.baseUrl}: <code className="font-mono text-primary">https://api.vigil.sh/v1</code>
        </span>
      </div>
    </section>
  );
}

function AuthenticationSection() {
  const { t } = useDocs();
  return (
    <section className="fade-up">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">lock</span>
        <h1 className="font-display font-bold text-3xl text-on-surf">
          {t.sidebar.items.authentication}
        </h1>
      </div>
      <p className="text-muted text-sm leading-relaxed mb-6">
        {t.content.authentication.bodyStart}{' '}
        <code className="font-mono text-primary text-xs bg-surface px-1.5 py-0.5">Authorization</code>{' '}
        {t.content.authentication.bodyEnd}{' '}
        <Link href="/dashboard" className="text-primary hover:underline">
          {t.content.authentication.dashboardLink}
        </Link>
        {t.content.authentication.dot}
      </p>

      <div className="bg-surface mb-4">
        <div className="px-4 py-2.5 bg-surface-100 flex items-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted font-semibold">
            {t.content.header}
          </span>
        </div>
        <pre className="px-4 py-4 overflow-x-auto">
          <code className="font-mono text-sm text-on-surf">
            Authorization: Bearer <span className="text-primary">vgl_sk_live_abc123...</span>
          </code>
        </pre>
      </div>

      <div className="flex items-start gap-2 text-xs text-warning bg-warning/5 px-4 py-3">
        <span className="material-symbols-outlined text-base mt-0.5">warning</span>
        <span>{t.content.authentication.warning}</span>
      </div>
    </section>
  );
}

function SendTransactionSection() {
  const { t } = useDocs();
  return (
    <section className="fade-up">
      <div className="flex items-center gap-3 mb-4">
        <MethodBadge method="POST" />
        <h1 className="font-display font-bold text-3xl text-on-surf">
          {t.sidebar.items['send-transaction']}
        </h1>
      </div>
      <p className="text-muted text-sm leading-relaxed mb-2">{t.content.sendTransaction.body}</p>
      <div className="font-mono text-sm text-primary bg-surface px-4 py-2.5 mb-6 inline-block">
        POST /v1/tx/send
      </div>

      <h3 id="parameters" className="font-display font-semibold text-on-surf text-base mb-3 scroll-mt-32">
        {t.content.parameters}
      </h3>
      <div className="bg-surface mb-6 divide-y divide-outline/10">
        <ParamRow name="transaction" type="string" required dark>
          {t.content.sendTransaction.param1Desc}
        </ParamRow>
        <ParamRow name="protection_level" type="enum">
          {t.content.sendTransaction.param2DescStart}{' '}
          {['standard', 'enhanced', 'maximum'].map((v) => (
            <code key={v} className="font-mono text-[11px] bg-surface text-primary px-1.5 py-0.5 mr-1">
              {v}
            </code>
          ))}
        </ParamRow>
        <ParamRow name="skip_preflight" type="boolean" dark>
          {t.content.sendTransaction.param3DescStart}{' '}
          <code className="font-mono text-primary text-[11px]">false</code>
        </ParamRow>
      </div>

      <div className="space-y-px mt-6">
        <CodeBlock lang="ts" label={t.content.sendTransaction.codeLabelTs} color="secondary">{TS_EXAMPLE}</CodeBlock>
        <CodeBlock lang="json" label={t.content.sendTransaction.codeLabel200} color="secondary">{SEND_RESPONSE}</CodeBlock>
      </div>
    </section>
  );
}

function MevReceiptSection() {
  const { t } = useDocs();
  return (
    <section className="fade-up">
      <div className="flex items-center gap-3 mb-4">
        <MethodBadge method="GET" />
        <h1 className="font-display font-bold text-3xl text-on-surf">
          {t.sidebar.items['mev-receipt']}
        </h1>
      </div>
      <p className="text-muted text-sm leading-relaxed mb-2">{t.content.receipt.body}</p>
      <div className="font-mono text-sm text-primary bg-surface px-4 py-2.5 mb-6 inline-block">
        GET /v1/tx/<span className="text-secondary">{'{hash}'}</span>/receipt
      </div>

      <h3 id="path-parameters" className="font-display font-semibold text-on-surf text-base mb-3 scroll-mt-32">
        {t.content.pathParameters}
      </h3>
      <div className="bg-surface mb-6">
        <ParamRow name="hash" type="string" required dark>
          {t.content.receipt.hashDesc}
        </ParamRow>
      </div>

      <h3 id="response-fields" className="font-display font-semibold text-on-surf text-base mb-3 scroll-mt-32">
        {t.content.responseFields}
      </h3>
      <div className="bg-surface divide-y divide-outline/10 mb-6">
        <ParamRow name="mev_captured" type="number" dark>
          {t.content.receipt.mevDesc}
        </ParamRow>
        <ParamRow name="rebate_amount" type="number">
          {t.content.receipt.rebateDesc}
        </ParamRow>
        <ParamRow name="settlement_status" type="enum" dark>
          {t.content.receipt.statusDescStart}{' '}
          {['pending', 'settled', 'failed'].map((v) => (
            <code key={v} className="font-mono text-[11px] bg-surface text-primary px-1.5 py-0.5 mr-1">
              {v}
            </code>
          ))}
        </ParamRow>
      </div>

      <div className="mt-6">
        <CodeBlock lang="json" label={t.content.receipt.codeLabel} color="primary">{RECEIPT_RESPONSE}</CodeBlock>
      </div>
    </section>
  );
}

function ProtectionStatusSection() {
  const { t } = useDocs();
  return (
    <section className="fade-up">
      <div className="flex items-center gap-3 mb-4">
        <MethodBadge method="GET" />
        <h1 className="font-display font-bold text-3xl text-on-surf">
          {t.sidebar.items['protection-status']}
        </h1>
      </div>
      <p className="text-muted text-sm leading-relaxed mb-2">{t.content.protectionStatus.body}</p>
      <div className="font-mono text-sm text-primary bg-surface px-4 py-2.5 mb-6 inline-block">
        GET /v1/protection/status
      </div>

      <h3 id="response-fields" className="font-display font-semibold text-on-surf text-base mb-3 scroll-mt-32">
        {t.content.responseFields}
      </h3>
      <div className="bg-surface divide-y divide-outline/10">
        <ParamRow name="status" type="enum" dark>
          {t.content.protectionStatus.statusDescStart}{' '}
          {['operational', 'degraded', 'outage'].map((v) => (
            <code key={v} className="font-mono text-[11px] bg-surface text-primary px-1.5 py-0.5 mr-1">
              {v}
            </code>
          ))}
        </ParamRow>
        <ParamRow name="jito_bundle_latency_ms" type="number">
          {t.content.protectionStatus.latencyDesc}
        </ParamRow>
        <ParamRow name="active_routes" type="number" dark>
          {t.content.protectionStatus.routesDesc}
        </ParamRow>
      </div>
    </section>
  );
}

function RateLimitsSection() {
  const { t } = useDocs();
  return (
    <section className="fade-up">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">speed</span>
        <h1 className="font-display font-bold text-3xl text-on-surf">
          {t.sidebar.items['rate-limits']}
        </h1>
      </div>
      <p className="text-muted text-sm leading-relaxed mb-6">
        {t.content.rateLimits.bodyStart}{' '}
        <code className="font-mono text-primary text-xs bg-surface px-1.5 py-0.5">429 Too Many Requests</code>
        {t.content.rateLimits.bodyEnd}
      </p>
      <div className="bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-200">
              {[t.content.rateLimits.cols.plan, t.content.rateLimits.cols.rpm, t.content.rateLimits.cols.burst].map((h) => (
                <th key={h} className="px-5 py-3 text-left font-mono text-xs uppercase tracking-wider text-muted font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RATE_LIMITS.map((row, i) => (
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
  );
}

function SettingsSection() {
  const { t } = useDocs();
  return (
    <section className="fade-up">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">settings</span>
        <h1 className="font-display font-bold text-3xl text-on-surf">
          {t.sidebar.items.settings}
        </h1>
      </div>
      <p className="text-muted text-sm leading-relaxed">
        {t.content.settings.bodyStart}{' '}
        <Link href="/dashboard" className="text-primary hover:underline">
          {t.content.settings.dashboardLink}
        </Link>
        {t.content.settings.bodyEnd}
      </p>
    </section>
  );
}

const SECTION_RENDERERS: Record<string, () => React.JSX.Element> = {
  introduction: IntroductionSection,
  authentication: AuthenticationSection,
  'send-transaction': SendTransactionSection,
  'mev-receipt': MevReceiptSection,
  'protection-status': ProtectionStatusSection,
  'rate-limits': RateLimitsSection,
  settings: SettingsSection,
};

export default function DocsContent() {
  const { activeApiPage } = useDocs();
  const Renderer = SECTION_RENDERERS[activeApiPage] ?? SECTION_RENDERERS.introduction;
  return <Renderer />;
}
