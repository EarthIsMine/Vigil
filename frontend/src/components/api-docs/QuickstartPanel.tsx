'use client';

import { useDocs } from '@/app/api-docs/DocsContext';

export default function QuickstartPanel() {
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
    <>
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
              if (p.pageId) setActiveDocPage(p.pageId);
              else if (p.tab) setActiveTab(p.tab);
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
    </>
  );
}
