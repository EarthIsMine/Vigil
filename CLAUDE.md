# Vigil

Solana MEV 감지·분석 플랫폼. 샌드위치 공격을 실시간 탐지하고 밸리데이터 리스크를 평가한다.

## 절대 규칙

- 커밋/푸시/PR은 명시적 허락 없이 절대 실행 금지
- .env, API 키, 시크릿 커밋 금지
- FE↔BE 공유 타입 변경 시 양쪽 반드시 동기화
- mock 데이터는 개발 전용 — 프로덕션 빌드 포함 금지

## 아키텍처

```
[Solana RPC (Helius)]
        ↓
  [Nest.js Backend]     ← MEV 감지, 데이터 저장, API 서버
        ↓ REST + WS
  [Next.js Frontend]    ← 대시보드, 리시트 조회, 시각화
```

| 레이어 | 경로        | 스택                                    |
| ------ | ----------- | --------------------------------------- |
| FE     | `frontend/` | Next.js, TypeScript, Tailwind, Chart.js |
| BE     | `backend/`  | Nest.js, TypeScript, Helius RPC         |

## 도메인 용어

| 용어              | 설명                                              |
| ----------------- | ------------------------------------------------- |
| Sandwich Attack   | 피해자 tx를 frontrun+backrun tx로 감싸 차익 추출  |
| Wide Sandwich     | 중간에 무관한 tx를 끼워 탐지를 우회하는 변형      |
| Authority-Hop     | 토큰 authority를 중간 지갑으로 옮겨 추적을 회피   |
| Frontrun          | 피해자보다 먼저 실행되는 공격 tx                  |
| Backrun           | 피해자 직후 실행되는 공격 tx                      |
| Slot              | Solana 블록 단위 (~400ms)                         |
| Epoch             | ~432,000 슬롯 묶음 (~2일)                         |
| expectedAmountOut | 공격 없었을 때 예상 수령량 (풀 리저브 시뮬레이션) |
| Risk Score        | 밸리데이터 MEV 연루도 (0~100, 가중 합산)          |

## FE↔BE 통신 규약

- REST: 조회성 데이터 (대시보드, 리시트, 밸리데이터)
- WebSocket: 실시간 공격 피드, 대시보드 stats 갱신
- 응답 포맷: 엔드포인트가 직접 도메인 객체 반환 (예: `DashboardStats`, `MevReceipt[]`). 별도 wrapper 없음.
- 에러 포맷: `{ error: { code: string, message: string } }`
- 페이지네이션: 현재 미적용 — 향후 list 엔드포인트는 cursor 기반으로 (offset 사용 금지)

## MVP 우선순위

1. **MUST** — Receipt 조회 (지갑 주소로 MEV 피해 검색)
2. **MUST** — Validator 리더보드 (리스크 스코어 랭킹)
3. **NICE** — Dashboard (전체 통계, 차트)
4. **SKIP** — 실시간 스트리밍 (MVP 이후)

## 코딩 컨벤션

- 언어: TypeScript strict (FE, BE 모두)
- 네이밍: camelCase (변수/함수), PascalCase (타입/클래스)
- FE↔BE 공유 타입은 별도 패키지 또는 문서로 관리
- 커밋 메시지: `feat:`, `fix:`, `refactor:`, `docs:` 접두사 사용

## 상세 가이드

- FE: @frontend/CLAUDE.fe.md
- BE: @backend/CLAUDE.md

## 프론트엔드 가이드

- TDD로 개발해라
- component는 하나의 일만 해야한다.
- SOLID를 만족시키는 컴포넌트를 만들어라
- page.tsx는 렌더링하는 역할을 해야한다.
- any 타입 작성금지
