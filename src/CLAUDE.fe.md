# Vigil FE

## 절대 규칙
- `src/lib/types.ts` 수정 시 BE 담당자와 반드시 동기화
- API 호출은 반드시 `src/lib/services/` 통해서 — 컴포넌트에서 직접 fetch 금지
- mock fallback 패턴(`withFallback`) 유지 — BE 없이도 FE 단독 실행 가능해야 함

## 스택
- Next.js 16, React 19, TypeScript strict
- Tailwind CSS 4, Chart.js + react-chartjs-2
- 주의: Next.js 버전이 최신 — `node_modules/next/dist/docs/` 확인 후 코딩

## 폴더 구조
```
src/
├── app/                  ← 페이지 (App Router)
│   ├── dashboard/        ← 대시보드
│   ├── receipt/          ← 리시트 조회
│   ├── validator/        ← 밸리데이터 상세
│   ├── analytics/        ← 분석
│   └── protection/       ← 보호 도구 벤치마크
├── components/           ← 공유 UI 컴포넌트
│   ├── Nav.tsx
│   ├── MevChart.tsx
│   ├── DonutChart.tsx
│   ├── Heatmap.tsx
│   └── LiveFeed.tsx
└── lib/
    ├── api.ts            ← apiFetch + withFallback (base client)
    ├── types.ts          ← FE↔BE 공유 타입 정의
    ├── logic.ts          ← 순수 함수 (리스크 스코어, 집계 등)
    ├── mock.ts           ← mock 데이터
    └── services/         ← API 서비스 레이어
        ├── dashboard.ts
        ├── analytics.ts
        ├── receipt.ts
        └── validator.ts
```

## 빌드/실행
- `npm run dev` — 개발 서버 (localhost:3000)
- `npm run build` — 프로덕션 빌드
- `npm run lint` — ESLint
- `NEXT_PUBLIC_API_URL` 미설정 시 자동으로 mock 데이터 사용

## API 서비스 패턴
```ts
// 모든 API 호출은 이 패턴을 따른다
export const getXxx = () =>
  withFallback('getXxx', () => apiFetch<T>('/path'), MOCK_DATA);
```

## 코딩 컨벤션
- 컴포넌트: PascalCase 파일명 (`MevChart.tsx`)
- 페이지: App Router 규칙 (`page.tsx`, `layout.tsx`)
- 상태: 서버 컴포넌트 우선, 클라이언트는 최소한으로
- 스타일: Tailwind 유틸리티 클래스, 인라인 style 지양
