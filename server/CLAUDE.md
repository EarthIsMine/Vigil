# Vigil BE

## 절대 규칙
- `types/` 공유 타입 변경 시 FE 담당자와 반드시 동기화
- Helius API 키는 환경변수로만 관리 — 코드에 하드코딩 금지
- RPC 호출에는 반드시 rate limit + retry 적용
- 감지 로직 변경 시 기존 테스트 케이스 전부 통과 확인

## 스택
- Nest.js, TypeScript strict
- Helius RPC (Solana 데이터)
- DB: PostgreSQL
- ORM: Prisma
- WebSocket: @nestjs/websockets (Socket.IO 또는 ws)

## 폴더 구조
```
server/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/               ← 공통 유틸, 필터, 인터셉터
│   │   ├── filters/
│   │   └── interceptors/
│   ├── rpc/                  ← Helius RPC 연결 레이어
│   │   ├── rpc.module.ts
│   │   ├── rpc.service.ts    ← 슬롯 구독, tx 파싱
│   │   └── helius.client.ts  ← Helius API 래퍼
│   ├── detection/            ← MEV 감지 엔진
│   │   ├── detection.module.ts
│   │   ├── detection.service.ts
│   │   ├── sandwich.detector.ts    ← 샌드위치 감지
│   │   └── simulation.service.ts   ← expectedAmountOut 계산
│   ├── validator/            ← 밸리데이터 리스크 스코어
│   │   ├── validator.module.ts
│   │   ├── validator.service.ts
│   │   └── validator.controller.ts
│   ├── receipt/              ← 리시트 조회
│   │   ├── receipt.module.ts
│   │   ├── receipt.service.ts
│   │   └── receipt.controller.ts
│   ├── dashboard/            ← 대시보드 통계
│   │   ├── dashboard.module.ts
│   │   ├── dashboard.service.ts
│   │   └── dashboard.controller.ts
│   └── gateway/              ← WebSocket 게이트웨이
│       ├── events.gateway.ts ← 실시간 공격 피드
│       └── events.module.ts
├── prisma/
│   └── schema.prisma         ← DB 스키마 정의
├── test/
├── package.json
├── tsconfig.json
└── CLAUDE.md
```

## 핵심 모듈 역할

| 모듈 | 역할 |
|------|------|
| `rpc` | Helius 연결, 슬롯 구독, raw tx → 파싱된 구조체 변환 |
| `detection` | 파싱된 tx에서 sandwich 패턴 감지, expectedAmountOut 시뮬레이션 |
| `validator` | 밸리데이터별 MEV 메트릭 집계, 리스크 스코어 계산 |
| `receipt` | 지갑 주소 기반 MEV 피해 이력 조회 |
| `dashboard` | 전체 통계 집계 (총 추출량, 공격 수, 시계열) |
| `gateway` | WS로 실시간 공격 이벤트 브로드캐스트 |

## 데이터 흐름
```
Helius WS 구독 (슬롯)
  → rpc.service: raw tx 수신 + 파싱
  → detection.service: sandwich 패턴 매칭
  → simulation.service: expectedAmountOut 계산
  → Prisma → PostgreSQL 저장
  → gateway: WS 브로드캐스트 (실시간 피드)
```

## REST API 엔드포인트
> Global prefix: `app.setGlobalPrefix('api/v1')` — 아래 경로는 prefix 이후 상대 경로.

| Method | Path | 설명 |
|--------|------|------|
| GET | `/dashboard/stats` | 대시보드 요약 통계 |
| GET | `/dashboard/timeseries?range=` | 시계열 차트 데이터 |
| GET | `/receipts/search?wallet=&range=` | 지갑별 MEV 피해 조회 |
| GET | `/validators/leaderboard?limit=` | 밸리데이터 리스크 랭킹 |
| GET | `/validators/:identity` | 밸리데이터 상세 |
| GET | `/analytics/timeseries?range=` | 분석 시계열 |
| GET | `/analytics/protocols?limit=` | 프로토콜별 리더보드 |
| GET | `/analytics/epochs?limit=` | 에포크별 요약 |
| GET | `/attacks/recent?limit=` | 최근 공격 목록 |

## 빌드/실행
- `npm run start:dev` — 개발 서버 (watch 모드)
- `npm run build` — 프로덕션 빌드
- `npm run test` — 유닛 테스트
- `npm run test:e2e` — E2E 테스트
- `npx prisma migrate dev` — DB 마이그레이션
- `npx prisma generate` — Prisma 클라이언트 생성

## 환경변수
| 변수 | 설명 |
|------|------|
| `HELIUS_API_KEY` | Helius RPC API 키 |
| `HELIUS_WS_URL` | Helius WebSocket URL |
| `DATABASE_URL` | PostgreSQL 연결 문자열 |
| `PORT` | 서버 포트 (기본 3001) |

## 코딩 컨벤션
- Nest.js 모듈 패턴 준수 (module → controller → service)
- 비즈니스 로직은 service에만 — controller는 라우팅만
- RPC 호출은 rpc 모듈 안에서만 — 다른 모듈에서 직접 호출 금지
- DB 접근은 각 모듈 service에서 Prisma Client 주입받아 사용
- 에러 응답: `{ error: { code: string, message: string } }` 형식 통일
