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
              if (c.pageId) {
                setActiveDocPage(c.pageId);
                window.scrollTo({ top: 0 });
              }
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

function OverviewPage() {
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
    <article>
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
        onClick={() => {
          setActiveDocPage('gettingStarted:quickstart');
          window.scrollTo({ top: 0 });
        }}
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
    </article>
  );
}

function QuickstartPage() {
  const { lang, setActiveDocPage, setActiveTab } = useDocs();
  const isKo = lang === 'ko';

  const paths = [
    {
      pageId: 'detectorReadme:quick-start',
      icon: 'sensors',
      title: isKo ? 'MEV 모니터링하기' : 'Monitor MEV',
      description: isKo
        ? '샌드위치 감지기 CLI 또는 라이브러리로 블록을 스트리밍하며 공격을 JSON으로 출력합니다.'
        : 'Stream blocks with the sandwich-detect CLI or embed the library to emit detected attacks as JSON.',
      cta: isKo ? '감지기 빠른 시작' : 'Detector Quick Start',
    },
    {
      pageId: 'rpcReadme:quick-start',
      icon: 'shield',
      title: isKo ? '내 트랜잭션 보호하기' : 'Protect transactions',
      description: isKo
        ? '보호 RPC를 사용자와 Solana 사이에 두고 위험한 스왑을 Jito 비공개 릴레이로 라우팅합니다.'
        : 'Drop the Protection RPC between your users and Solana — risky swaps route through Jito private relay.',
      cta: isKo ? 'RPC 빠른 시작' : 'RPC Quick Start',
    },
    {
      tab: 'api-reference' as const,
      icon: 'code',
      title: isKo ? 'API로 통합하기' : 'Integrate via API',
      description: isKo
        ? 'REST 엔드포인트로 보호된 트랜잭션 전송, 영수증 조회, 보호 상태를 프로그래밍 방식으로 사용하세요.'
        : 'Use REST endpoints to send protected transactions, fetch receipts, and check protection status programmatically.',
      cta: isKo ? 'API Reference' : 'API Reference',
    },
  ];

  return (
    <article>
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-primary text-base leading-none">rocket_launch</span>
        <p className="text-xs uppercase tracking-widest text-muted font-mono">
          {isKo ? '시작하기 · 빠른 시작' : 'Getting Started · Quickstart'}
        </p>
      </div>

      <h1 className="font-display font-bold text-4xl text-on-surf mb-3">
        {isKo ? '경로 선택하기' : 'Pick your path'}
      </h1>
      <p className="text-on-surf/85 text-base leading-relaxed mb-10">
        {isKo
          ? 'Vigil은 세 가지 주된 사용 방식을 지원합니다. 가장 가까운 사용 사례를 선택해 5분 안에 첫 결과를 만들어보세요.'
          : 'Vigil supports three primary use cases. Pick the one closest to yours and ship your first result in 5 minutes.'}
      </p>

      <div className="space-y-3 mb-12">
        {paths.map((p) => (
          <button
            key={p.title}
            type="button"
            onClick={() => {
              if (p.pageId) {
                setActiveDocPage(p.pageId);
                window.scrollTo({ top: 0 });
              } else if (p.tab) {
                setActiveTab(p.tab);
              }
            }}
            className="w-full text-left flex items-start gap-4 p-5 bg-surface-200 rounded-lg border border-outline/20 hover:border-primary/40 hover:bg-surface-200/80 transition"
          >
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-primary/10 rounded">
              <span className="material-symbols-outlined text-primary text-xl leading-none">{p.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-on-surf text-base mb-1">{p.title}</h3>
              <p className="text-muted text-sm leading-relaxed mb-2">{p.description}</p>
              <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                {p.cta}
                <span className="material-symbols-outlined text-sm leading-none">arrow_forward</span>
              </span>
            </div>
          </button>
        ))}
      </div>

      <h2 className="font-display font-bold text-2xl text-on-surf mb-3">
        {isKo ? '핵심 용어' : 'Key concepts'}
      </h2>
      <div className="space-y-3">
        {[
          {
            term: isKo ? '샌드위치 공격' : 'Sandwich attack',
            def: isKo
              ? '공격자가 피해자의 스왑 앞뒤로 자신의 트랜잭션을 끼워 넣어 가격을 흔들고 차익을 추출하는 MEV 패턴.'
              : 'A MEV pattern where an attacker wraps a victim swap with their own frontrun and backrun trades to extract value from price impact.',
          },
          {
            term: isKo ? 'Frontrun · Backrun' : 'Frontrun · Backrun',
            def: isKo
              ? '피해자보다 먼저 실행되는 공격 트랜잭션이 frontrun, 직후 실행되는 회수 트랜잭션이 backrun.'
              : 'The attack tx executed before the victim is the frontrun; the closing tx executed after is the backrun.',
          },
          {
            term: isKo ? 'AMM 리플레이' : 'AMM replay',
            def: isKo
              ? '풀 상태와 스왑 곡선을 시뮬레이션해 공격이 없었을 경우의 예상 수령량(expectedAmountOut)과 실제 손실을 정밀 계산합니다.'
              : 'Simulating the pool state and curve to compute the victim\'s no-attack expectedAmountOut and the precise loss.',
          },
          {
            term: isKo ? '리스크 스코어' : 'Risk score',
            def: isKo
              ? '0~100 점수로 표현되는 밸리데이터의 MEV 연루도. 추출 빈도, 금액, 최근성을 가중 합산합니다.'
              : 'Validator MEV-involvement on a 0–100 scale, computed from extraction frequency, amounts, and recency.',
          },
        ].map((row) => (
          <div key={row.term} className="p-4 bg-surface rounded border border-outline/20">
            <p className="font-display font-semibold text-on-surf text-sm mb-1">{row.term}</p>
            <p className="text-muted text-sm leading-relaxed">{row.def}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function GettingStartedView({ pageId }: { pageId: string }) {
  const [, section] = pageId.split(':');
  if (section === 'quickstart') return <QuickstartPage />;
  return <OverviewPage />;
}
