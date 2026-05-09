'use client';

import { useDocs } from '@/app/api-docs/DocsContext';

interface CardLink {
  pageId?: string;
  href?: string;
  external?: boolean;
  icon: string;
  title: string;
  description: string;
}

function PageCardGrid({ cards }: { cards: CardLink[] }) {
  const { setActiveDocPage } = useDocs();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {cards.map((c) => {
        const inner = (
          <>
            <div className="w-9 h-9 flex items-center justify-center bg-primary/10 rounded mb-3">
              <span className="material-symbols-outlined text-primary text-xl leading-none">
                {c.icon}
              </span>
            </div>
            <h3 className="font-display font-semibold text-on-surf text-base mb-1">{c.title}</h3>
            <p className="text-muted text-sm leading-relaxed">{c.description}</p>
          </>
        );
        const className =
          'block text-left p-5 bg-surface-200 rounded-lg border border-outline/20 hover:border-primary/40 hover:bg-surface-200/80 transition';

        if (c.href) {
          return (
            <a
              key={c.title}
              href={c.href}
              target={c.external ? '_blank' : undefined}
              rel={c.external ? 'noopener noreferrer' : undefined}
              className={className}
            >
              {inner}
            </a>
          );
        }

        return (
          <button
            key={c.title}
            type="button"
            onClick={() => {
              if (c.pageId) setActiveDocPage(c.pageId);
            }}
            className={className}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
}

export default function OverviewPanel() {
  const { lang, setActiveTab, setActiveDocPage } = useDocs();
  const isKo = lang === 'ko';

  const cards: CardLink[] = [
    {
      pageId: 'detectorReadme:quick-start',
      icon: 'sensors',
      title: isKo ? '샌드위치 감지기' : 'Sandwich Detector',
      description: isKo
        ? 'Solana 블록 스트림에서 샌드위치 공격을 실시간 감지하는 Rust 라이브러리.'
        : 'Rust library for real-time detection of sandwich attacks across Solana blocks.',
    },
    {
      pageId: 'rpcReadme:quick-start',
      icon: 'shield',
      title: isKo ? '보호 RPC' : 'Protection RPC',
      description: isKo
        ? '샌드위치 공격으로부터 스왑 트랜잭션을 보호하는 Solana RPC 프록시.'
        : 'Solana RPC proxy that shields swap transactions from sandwich attacks.',
    },
    {
      pageId: 'detectorDesign:1-detection-model',
      icon: 'architecture',
      title: isKo ? '감지 설계' : 'Detection Design',
      description: isKo
        ? '감지 알고리즘, AMM 리플레이 정확도, 정확률 검증 방법론.'
        : 'Detection algorithm, AMM replay precision, and validation methodology.',
    },
    {
      pageId: 'gettingStarted:quickstart',
      icon: 'rocket_launch',
      title: isKo ? '빠른 시작' : 'Quickstart',
      description: isKo
        ? '5분 안에 모니터링·보호·통합 중 원하는 사용 사례 시작하기.'
        : 'Get started with monitoring, protection, or integration in 5 minutes.',
    },
  ];

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-primary text-base leading-none">menu_book</span>
        <p className="text-xs uppercase tracking-widest text-muted font-mono">
          {isKo ? '시작하기 · 개요' : 'Getting Started · Overview'}
        </p>
      </div>

      <h1 className="font-display font-bold text-4xl text-on-surf mb-3">
        {isKo ? 'Vigil 문서' : 'Vigil Documentation'}
      </h1>
      <p className="text-on-surf/85 text-base leading-relaxed mb-10">
        {isKo
          ? 'Solana MEV 투명성 인프라. 감지 라이브러리, 보호 RPC, 그리고 분석 API로 샌드위치 공격을 추적하고 방어하세요.'
          : 'Solana MEV transparency infrastructure. Track and defend against sandwich attacks with detection libraries, protection RPC, and analytics APIs.'}
      </p>

      <h2 className="font-display font-bold text-2xl text-on-surf mb-2">
        {isKo ? '바로 시작하기' : 'Developer Quickstart'}
      </h2>
      <p className="text-muted text-sm leading-relaxed mb-5">
        {isKo
          ? '플랫폼 기본을 익히고, 감지 라이브러리를 임베드하거나 보호 RPC로 트랜잭션을 라우팅해 5분 안에 첫 결과를 받아보세요.'
          : 'Learn the platform basics, embed the detection library, or route transactions through the protection RPC and see your first result in 5 minutes.'}
      </p>
      <button
        type="button"
        onClick={() => setActiveDocPage('gettingStarted:quickstart')}
        className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-on-primary bg-primary hover:bg-primary-container rounded-md transition mb-12"
      >
        {isKo ? '빠른 시작' : 'Get Started'}
        <span className="material-symbols-outlined text-base leading-none">arrow_forward</span>
      </button>

      <h2 className="font-display font-bold text-2xl text-on-surf mb-2">
        {isKo ? 'Vigil 둘러보기' : 'Get Familiar with Vigil'}
      </h2>
      <p className="text-muted text-sm leading-relaxed mb-6">
        {isKo
          ? '플랫폼의 기본 구성 요소를 살펴보고, 사용하려는 영역의 문서로 바로 이동하세요.'
          : "Explore the platform's building blocks and jump straight into the area you need."}
      </p>
      <PageCardGrid cards={cards} />

      <div className="mt-12 p-5 bg-surface rounded-lg border border-outline/20">
        <p className="text-xs uppercase tracking-widest text-muted font-mono mb-2">
          {isKo ? 'API 통합이 필요하세요?' : 'Need API integration?'}
        </p>
        <p className="text-on-surf/85 text-sm leading-relaxed mb-3">
          {isKo
            ? '엔드포인트, 인증, 응답 스키마 등 모든 REST API 정보는 API Reference 탭에서 확인할 수 있습니다.'
            : 'Endpoints, authentication, and response schemas are documented in the API Reference tab.'}
        </p>
        <button
          type="button"
          onClick={() => setActiveTab('api-reference')}
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
        >
          {isKo ? 'API Reference 보기' : 'Open API Reference'}
          <span className="material-symbols-outlined text-base leading-none">arrow_forward</span>
        </button>
      </div>
    </>
  );
}
