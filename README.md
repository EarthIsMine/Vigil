# Vigil — Solana Execution Quality Observatory

Solana MEV를 감지·분석·가시화하는 인프라 플랫폼.
"모든 스왑에 숨겨진 MEV 세금이 얼마인지 보여주는" 솔라나의 EigenPhi.

---

## 핵심 컨셉

BAM에 한정하지 않고 솔라나 트랜잭션 전체 라이프사이클의 **실행 품질**을 측정한다.

| # | 모듈 | 설명 | 구현 가능성 |
|---|------|------|------------|
| 1 | **TX Latency Decomposition** | TX 전송 → 블록 포함까지 단계별 지연 분해 | △ (관측 노드 필요) |
| 2 | **MEV Impact Score** | per-TX MEV 손실 계산 ("당신의 스왑에서 $2.30이 빠져나감") | ✓ 온체인 분석 |
| 3 | **Validator Execution Scorecard** | 밸리데이터별 MEV 추출 패턴, TX inclusion 공정성, 블록 빌딩 품질 | ✓ 온체인 데이터 |
| 4 | **Infrastructure Health Dashboard** | Firedancer 채택률, SWQoS 집중도, 투표 TX 비율 | ✓ 퍼블릭 데이터 |

**MVP 핵심**: [2] MEV Impact + [3] Validator Scorecard

---

## 왜 콜로세움 스케일인가

1. BAM 하나에 종속 안 됨 → 솔라나 전체를 커버하는 인프라 레이어
2. "7.2억 달러 MEV = 사용자 숨겨진 세금"을 가시화 → 유저/스테이커 모두에게 직접 가치
3. 온체인 데이터만으로 대부분 구현 가능 → BAM 오픈소스 안 기다려도 됨
4. L2Beat + MEV-Explore + validators.app의 솔라나 버전
5. 나중에 BAM/ACE/MCL 나오면 각각을 커버하는 모듈 추가 가능

---

## 아키텍처

```
[Helius gRPC] ─── 실시간 TX/블록 스트리밍
       ↓
[Nest.js Backend] ─── MEV 감지 엔진 + 데이터 저장 + API
       ↓ REST + WS
[Next.js Frontend] ─── 대시보드, MEV 영수증, 밸리데이터 스코어카드
```

| 레이어 | 경로 | 스택 |
|--------|------|------|
| Frontend | `frontend/` | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Chart.js |
| Backend | `backend/` | Nest.js, TypeScript, Helius RPC, PostgreSQL, Prisma |

---

## 데이터 소스

| 소스 | 용도 | 비용 |
|------|------|------|
| Helius gRPC | 실시간 TX/블록 스트리밍 | 무료(devnet) / 월 $99~499(mainnet) |
| Solana RPC | getBlock, getTransaction | 무료(공개) / 유료 RPC 월 $50~200 |
| Jito Bundle API | 번들 관련 데이터 | 무료 |
| Validators.app API | 밸리데이터 메타데이터 | 무료 |
| Solana on-chain votes | 투표 TX 비율 계산 | RPC로 읽기 |

---

## 기술 스택

| 레이어 | 기술 | 이유 |
|--------|------|------|
| 데이터 수집 | TypeScript / Node.js | Solana web3.js, Helius SDK 호환 |
| 분석 엔진 | TypeScript (→ Rust 부분 교체 가능) | MEV 감지 로직, 스코어 계산 |
| DB | TimescaleDB (PostgreSQL 확장) | 시계열 특화, SQL 호환 |
| API | Nest.js | 모듈화된 백엔드 구조 |
| 프론트엔드 | Next.js + Tailwind | 대시보드 UI |
| 차트 | Chart.js + react-chartjs-2 | 시계열/도넛 차트 |

---

## 핵심 기술 역량

### 필수

- **Solana TX 구조 이해**: 프로그램 ID로 DEX 스왑 식별 (Jupiter, Raydium, Orca), inner instructions 파싱, 계정 read/write 패턴
- **MEV 감지 알고리즘**: 샌드위치 공격 (buy → victim swap → sell), 프론트러닝, 백러닝, 슬리피지 초과분 계산
- **gRPC 스트리밍**: Helius/Yellowstone gRPC 연결, 블록/TX 실시간 수신 + 파싱

### 알면 좋음

- Jito 번들 구조 (bundle tip 계산)
- 밸리데이터 클라이언트 식별 (Firedancer vs Agave)
- SWQoS 메커니즘 이해

---

## 모듈별 구현 난이도

| 모듈 | 난이도 | 설명 |
|------|--------|------|
| [A] 데이터 수집 파이프라인 | ★★★☆ | gRPC → 파싱 → DB 저장 |
| [B] MEV 감지 엔진 | ★★★★ | 샌드위치/프론트런 탐지, per-TX MEV 손실 계산 |
| [C] Validator Scorecard | ★★☆☆ | 블록별 MEV 패턴 집계, 밸리데이터별 점수화 |
| [D] 프론트엔드 대시보드 | ★★☆☆ | Next.js + 차트 |
| [E] API 레이어 | ★★☆☆ | REST API for 외부 연동 |

---

## 인프라 비용

| 항목 | 사양 | 월 비용 |
|------|------|---------|
| DB (TimescaleDB / PostgreSQL) | 4GB RAM / 100GB SSD | $20~40 |
| Backend Server | 2 vCPU / 4GB RAM | $20~30 |
| Frontend Hosting | Vercel | 무료 |
| Redis (선택) | 캐싱, 실시간 큐 | $0~10 |
| **총** | | **$50~80** |

Railway / Fly.io 무료 티어로 시작하면 $0 가능.

---

## 외부 라이브러리

| 패키지 | 용도 |
|--------|------|
| `@solana/web3.js` | Solana RPC 클라이언트 |
| `helius-sdk` | Helius API/gRPC |
| `@jito-labs/jito-ts` | Jito 번들 관련 |
| `@coral-xyz/anchor` | 프로그램 IDL 디코딩 (선택) |
| `bs58` | Base58 인코딩 |
| `pg` / `@timescale/toolkit` | PostgreSQL/TimescaleDB |
| `bullmq` (선택) | 작업 큐 (데이터 수집 스케줄링) |

---

## 가장 어려운 부분

| 순위 | 과제 | 설명 |
|------|------|------|
| 1 | **MEV 감지 정확도** | 샌드위치는 패턴이 명확하나 프론트러닝의 의도 판단이 어려움. 80% 정확도면 이미 가치있음 |
| 2 | **데이터 볼륨** | 솔라나 TPS가 높아 전체 TX 저장 불가. DEX 관련 TX만 필터링 (Jupiter, Raydium, Orca) |
| 3 | **실시간성** | gRPC 스트리밍 끊김 시 데이터 갭 발생. 재연결 + 갭 백필 로직 필요 |

---

## MVP 빌드 순서

```
Week 1: 데이터 파이프라인
  → Helius gRPC 연결
  → DEX TX만 필터링해서 TimescaleDB에 저장

Week 2: MEV 감지
  → 샌드위치 감지 알고리즘 구현
  → per-TX MEV 손실 계산

Week 3: 밸리데이터 스코어카드
  → 블록별 MEV 패턴 집계
  → 밸리데이터별 점수화

Week 4: 프론트엔드 + 발표 준비
  → 대시보드 UI
  → API 문서화
  → 데모 시나리오
```

---

## 경쟁 환경

| 프로젝트 | 역할 | Vigil과 겹침 |
|----------|------|-------------|
| Jito Explorer | 번들/팁 데이터 조회 | 일부 겹침 |
| MEV Watch (EVM) | 이더리움 MEV 추적 | 솔라나 버전 없음 |
| EigenPhi (EVM) | EVM MEV 시각화 | 솔라나 버전 없음 |
| Dune Analytics | SQL 온체인 데이터 쿼리 | 누구나 비슷한 대시보드 생성 가능 |
| Solscan / SolanaFM | TX 익스플로러 | MEV 분석 미지원 |
| Validators.app | 밸리데이터 정보 | MEV 관점 스코어 없음 |
| Flashbots Protect (EVM) | MEV 보호 | 솔라나에 없음 |

---

## 강점

| # | 강점 | 강도 |
|---|------|------|
| 1 | **솔라나 MEV 전용 분석 도구가 아직 없다** — "솔라나의 EigenPhi" 포지션이 비어있음 | ★★★★ |
| 2 | **내러티브가 강하다** — "7.2억 달러 MEV = 사용자 숨겨진 세금" | ★★★★ |
| 3 | **스테이커 의사결정에 실질적 영향** — 밸리데이터 위임 변경 유도 | ★★★☆ |

## 약점

| # | 약점 | 심각도 |
|---|------|--------|
| 1 | **기술적 해자 부재** — 온체인 데이터는 누구나 접근 가능, 잘하는 팀이 2주면 복제 | ★★☆☆☆ |
| 2 | **Dune 대체 가능성** — Dune 대시보드로 비슷한 분석 가능 | ★★☆☆☆ |
| 3 | **수익 모델 불투명** — 대시보드는 무료 공개해야 의미 있음, API 유료화 수요 불확실 | ★★☆☆☆ |
| 4 | **감지 정확도 증명 어려움** — false positive 많으면 신뢰도 추락 | ★★★☆☆ |
| 5 | **사후 분석의 한계** — "내가 $2 뜯겼다는 걸 안다고 뭐가 달라지나?" | ★★★☆☆ |

---

## 대시보드 vs 프로덕트

> 현재 스코프대로면 **좋은 대시보드**에 가까움. 콜로세움에서 이기려면 **프로덕트**여야 함.

```
대시보드: 데이터를 보여준다 → "아 그렇구나" → 끝
프로덕트: 데이터를 보여주고 → 행동을 유도하거나 → 실제 문제를 해결한다
```

### 프로덕트 격상 옵션

| 옵션 | 설명 | 난이도 | 임팩트 |
|------|------|--------|--------|
| **A. MEV Protection Layer** | 실제 MEV를 막아주는 TX 라우팅 (Flashbots Protect 솔라나 버전) | ★★★★★ | ★★★★★ |
| **B. Stake Delegation Advisor** | 밸리데이터 스코어 기반 re-delegation TX 생성 | ★★★☆ | ★★★☆ |
| **C. MEV Alert + SDK** | dApp/월렛 통합 SDK, 스왑 전 위험도 알림 | ★★★☆ | ★★★☆ |
| **D. Per-TX MEV Receipt** | 모든 스왑에 MEV 영수증 발급, 바이럴 공유 가능 | ★★☆ | ★★★★ |

### 입상 가능성 평가

| 스코프 | 입상 가능성 | 이유 |
|--------|------------|------|
| 분석 대시보드만 | 30~40% | 기술적 깊이는 있지만 "So what?"에 대한 답이 약함 |
| + 옵션 D (MEV 영수증) | 60~70% | 유저 facing 프로덕트 + 바이럴성 + 데이터 인프라 |
| + 옵션 A (MEV Protection) | 80%+ | 실제 문제 해결. 기간 내 가능성이 관건 |

### 추천 전략

**대시보드 + 옵션 D (MEV 영수증)를 코어로 가고, 가능하면 옵션 C (SDK/API)까지.**
→ "인프라 + 프로덕트" 둘 다 확보.

---

## 빠른 시작

```bash
# Frontend
pnpm --filter vigil-frontend dev     # localhost:3000

# Backend
pnpm --filter backend dev            # localhost:3001

# Build
pnpm --filter vigil-frontend build
pnpm --filter backend build

# Test
pnpm --filter vigil-frontend test
pnpm --filter backend test
```

### 환경변수

| 변수 | 설명 |
|------|------|
| `HELIUS_API_KEY` | Helius RPC API 키 |
| `HELIUS_WS_URL` | Helius WebSocket URL |
| `DATABASE_URL` | PostgreSQL 연결 문자열 |
| `NEXT_PUBLIC_API_URL` | 백엔드 API URL (미설정 시 mock 데이터 사용) |
| `PORT` | 백엔드 서버 포트 (기본 3001) |
