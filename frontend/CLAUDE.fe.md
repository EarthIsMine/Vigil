# Vigil FE

## 절대 규칙
- `src/lib/types.ts` 수정 시 BE 담당자와 반드시 동기화
- API 호출은 반드시 `src/lib/services/` 통해서 — 컴포넌트에서 직접 fetch 금지
- 런타임 mock fallback 금지 — BE 미연결 시 명시적 loading/error/empty state로 표시. `lib/mock.ts`는 테스트 fixture 전용

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
│   ├── validator/        ← 밸리데이터 상세 (+ [identity])
│   ├── analytics/        ← 분석
│   └── protection/       ← 보호 도구 벤치마크
├── components/           ← 공유 UI 컴포넌트
│   ├── ConnectionStatusProvider.tsx  ← 'live' | 'offline' 글로벌 상태
│   ├── Nav.tsx
│   ├── LiveFeed.tsx
│   ├── DonutChart.tsx
│   ├── Heatmap.tsx
│   └── shared/
│       └── ErrorBanner.tsx
└── lib/
    ├── api.ts            ← apiFetch (base client, throws on failure)
    ├── types.ts          ← FE↔BE 공유 타입 정의
    ├── logic.ts          ← 순수 함수 (리스크 스코어, 집계 등)
    ├── mock.ts           ← 테스트 fixture (런타임 import 금지)
    └── services/         ← API 서비스 레이어
        ├── dashboard.ts
        ├── analytics.ts
        ├── receipt.ts
        └── validator.ts
```

## 빌드/실행
- `pnpm --filter vigil-frontend dev` — 개발 서버 (localhost:3000)
- `pnpm --filter vigil-frontend build` — 프로덕션 빌드
- `pnpm --filter vigil-frontend lint` — ESLint
- `NEXT_PUBLIC_API_URL` 미설정 시 모든 페이지가 error state로 표시됨 (BE 필수)

## API 서비스 패턴
```ts
// 모든 API 호출은 이 패턴을 따른다 — apiFetch가 실패 시 ApiError throw
export const getXxx = () => apiFetch<T>('/path');

// 호출자 hook에서 Promise.allSettled 또는 try/catch로 loading/error 처리
```

## 페이지 상태 처리
- **Loading**: 첫 진입 시 skeleton 또는 "Loading..." placeholder
- **Error**: `ErrorBanner` 컴포넌트로 데이터 영역 위에 표시. 가능하면 retry 버튼
- **Partial**: `Promise.allSettled`로 부분 데이터라도 받으면 표시 (allFailed일 때만 error 트리거)

## 코딩 컨벤션
- 컴포넌트: PascalCase 파일명 (`MevChart.tsx`)
- 페이지: App Router 규칙 (`page.tsx`, `layout.tsx`)
- 상태: 서버 컴포넌트 우선, 클라이언트는 최소한으로
- 스타일: Tailwind 유틸리티 클래스, 인라인 style 지양
