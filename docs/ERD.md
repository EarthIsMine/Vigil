# Vigil Database ERD

Solana MEV 감지 플랫폼 데이터베이스 설계.
`src/lib/types.ts` 기반, PostgreSQL + Prisma 사용.

## ER Diagram

```mermaid
erDiagram
    TOKEN {
        text mint PK
        text symbol
        int decimals
        text logo_url
    }

    POOL {
        text address PK
        text token_a_mint FK
        text token_b_mint FK
        text dex
        float last_known_tvl
        float fee_rate
        timestamp tvl_updated_at
    }

    VALIDATOR {
        text identity PK
        text name
        text vote_account UK
        text client
        bigint stake
        int commission
        int active_since_epoch
        timestamp created_at
        timestamp updated_at
    }

    VALIDATOR_METRICS {
        uuid id PK
        text validator_identity FK
        float sandwich_involvement_rate
        float wide_sandwich_rate
        int consecutive_leader_abuse
        float total_extracted_sol
        float avg_extraction_per_slot
        text recent_trend
        int observed_slots
        float risk_score
        text risk_level
        timestamp measured_at
    }

    MEV_ATTACK {
        text signature PK
        text type
        bigint slot
        bigint timestamp_ms
        float extracted_usd
        float extracted_sol
        text victim_signer
        float victim_amount_in
        float victim_amount_out
        float victim_expected_amount_out
        text attacker
        text dex
        text pool FK
        text leader_identity FK
        text severity
        timestamp created_at
    }

    SANDWICH_DETAIL {
        text attack_signature PK_FK
        text frontrun_tx
        text backrun_tx
        float attacker_profit
        float attacker_profit_usd
        bigint frontrun_slot
        bigint backrun_slot
        boolean is_wide_sandwich
    }

    MEV_RECEIPT {
        uuid receipt_id PK
        text victim_tx_signature
        text attack_signature FK
        bigint timestamp_ms
        text victim_wallet
        text victim_action
        text victim_dex
        text token_in_mint FK
        text token_out_mint FK
        float amount_in
        float expected_amount_out
        float actual_amount_out
        float slippage
        boolean mev_detected
        text mev_type
        text severity
        float loss_expected_amount_out
        float loss_actual_amount_out
        float loss_amount
        float loss_usd
        float loss_percent
        text loss_confidence
        text validator_identity FK
        text protection_tool_used
        boolean was_protected
        boolean protection_failed
        text share_url
        text share_image_url
        timestamp created_at
    }

    DASHBOARD_SNAPSHOT {
        uuid id PK
        text period
        float total_mev_extracted_usd
        float total_mev_extracted_sol
        float change_percent_extracted
        int total_attacks
        float change_percent_attacks
        float avg_loss_per_tx_usd
        float change_percent_avg_loss
        int active_attackers
        text top_attacker
        timestamp snapshot_at
    }

    TIMESERIES_BUCKET {
        uuid id PK
        timestamp bucket_start
        text bucket_size
        float total_usd
        float sandwich_single_usd
        float sandwich_wide_usd
        float backrun_usd
        float other_usd
        int attack_count
    }

    PROTECTION_BENCHMARK {
        uuid id PK
        text tool
        text label
        text period
        text confidence
        text validator_identity FK
        int total_protected_tx
        int attacked_tx
        float protection_rate
        float wide_sandwich_protection_rate
        float coverage
        float avg_loss_when_failed
        float avg_tip_cost
        float cost_effectiveness_ratio
        timestamp measured_at
    }

    BENCHMARK_BY_DEX {
        uuid id PK
        uuid benchmark_id FK
        text dex
        float protection_rate
    }

    BENCHMARK_BY_HOUR {
        uuid id PK
        uuid benchmark_id FK
        int hour
        float protection_rate
        int attack_volume
    }

    TOKEN ||--o{ POOL : "token_a / token_b"
    POOL ||--o{ MEV_ATTACK : "pool"
    VALIDATOR ||--o{ VALIDATOR_METRICS : "identity"
    VALIDATOR ||--o{ MEV_ATTACK : "leader_identity"
    VALIDATOR ||--o{ MEV_RECEIPT : "validator_identity"
    MEV_ATTACK ||--o| SANDWICH_DETAIL : "signature"
    MEV_ATTACK ||--o{ MEV_RECEIPT : "attack_signature"
    TOKEN ||--o{ MEV_RECEIPT : "token_in / token_out"
    VALIDATOR ||--o{ PROTECTION_BENCHMARK : "validator_identity"
    PROTECTION_BENCHMARK ||--o{ BENCHMARK_BY_DEX : "benchmark_id"
    PROTECTION_BENCHMARK ||--o{ BENCHMARK_BY_HOUR : "benchmark_id"
```

## 테이블 설명

### 핵심 테이블

| 테이블 | 설명 |
|--------|------|
| `token` | 토큰 메타데이터 (mint 주소 기준) |
| `pool` | DEX 풀 정보 (토큰 페어 + DEX + TVL/수수료) |
| `validator` | 밸리데이터 기본 정보 |
| `validator_metrics` | 밸리데이터별 MEV 메트릭 스냅샷 (시계열) |
| `mev_attack` | 감지된 MEV 공격 이벤트 |
| `sandwich_detail` | 샌드위치 공격 상세 (frontrun/backrun tx) |
| `mev_receipt` | 피해자 관점 영수증 (지갑 조회용) |

### 집계/캐시 테이블

| 테이블 | 설명 |
|--------|------|
| `dashboard_snapshot` | 대시보드 요약 통계 (주기적 스냅샷, period별) |
| `timeseries_bucket` | 시계열 차트용 사전 집계 버킷 |
| `protection_benchmark` | 보호 도구 벤치마크 결과 |
| `benchmark_by_dex` | 벤치마크 DEX별 분석 |
| `benchmark_by_hour` | 벤치마크 시간대별 분석 |

## 주요 인덱스

```sql
-- 지갑별 피해 조회 (Receipt 검색 핵심)
CREATE INDEX idx_receipt_victim_wallet ON mev_receipt(victim_wallet);
CREATE INDEX idx_receipt_wallet_time ON mev_receipt(victim_wallet, timestamp_ms DESC);
CREATE INDEX idx_receipt_attack ON mev_receipt(attack_signature);

-- 공격 조회 — cursor는 signature(PK) 기반
CREATE INDEX idx_attack_slot ON mev_attack(slot DESC);
CREATE INDEX idx_attack_timestamp ON mev_attack(timestamp_ms DESC);
CREATE INDEX idx_attack_attacker ON mev_attack(attacker);
CREATE INDEX idx_attack_type ON mev_attack(type);
CREATE INDEX idx_attack_pool ON mev_attack(pool);
CREATE INDEX idx_attack_leader ON mev_attack(leader_identity);

-- 밸리데이터 리더보드
CREATE INDEX idx_validator_metrics_score ON validator_metrics(risk_score DESC);
CREATE INDEX idx_validator_metrics_identity ON validator_metrics(validator_identity, measured_at DESC);

-- 시계열
CREATE INDEX idx_timeseries_bucket ON timeseries_bucket(bucket_size, bucket_start DESC);

-- 대시보드
CREATE INDEX idx_dashboard_period ON dashboard_snapshot(period, snapshot_at DESC);

-- 벤치마크
CREATE INDEX idx_benchmark_tool_period ON protection_benchmark(tool, period);
CREATE INDEX idx_benchmark_validator ON protection_benchmark(validator_identity);
```

## 설계 결정

### 1. `mev_attack` vs `mev_receipt` 분리
- **attack**: 감지 엔진 관점 — 공격 이벤트 자체
- **receipt**: 피해자 관점 — 지갑 검색/공유용
- 하나의 attack이 여러 victim을 가질 수 있음 (wide sandwich)

### 2. `mev_receipt` FK 구조: `victim_tx_signature` + `attack_signature`
- `victim_tx_signature`: 피해자 본인의 실제 트랜잭션 서명
- `attack_signature`: FK → `mev_attack.signature` (어떤 공격에 피해받았는가)
- wide sandwich에서 victim tx ≠ attack frontrun/backrun tx이므로 반드시 분리

### 3. `mev_attack.leader_identity` — 슬롯 리더 밸리데이터
- 해당 슬롯의 블록 리더 밸리데이터를 직접 저장
- `validator_metrics` 집계 시 receipt 경유 없이 attack에서 직접 집계 가능
- 인덱스: `idx_attack_leader`로 밸리데이터별 attack 카운트 빠르게 조회

### 4. `sandwich_detail` 별도 테이블
- 샌드위치 공격만 가지는 필드 (frontrun/backrun tx, slot)가 많아서 분리
- `mev_attack.type`이 sandwich 계열일 때만 JOIN
- 향후 `backrun_detail`, `liquidation_detail` 등 확장 용이

### 5. `validator_metrics` 시계열
- 리스크 스코어는 시간에 따라 변함 → 스냅샷으로 저장
- 최신 메트릭은 `measured_at DESC LIMIT 1`로 조회
- 리더보드는 최신 스냅샷 기준

### 6. timestamp는 밀리초 단위 (`timestamp_ms`)
- Solana slot timestamp는 초 단위지만, 같은 초에 여러 attack 가능
- cursor 페이지네이션 정밀도를 위해 밀리초(ms) 단위로 저장
- cursor 자체는 `signature`(PK) 기반이 가장 안전 — timestamp_ms는 정렬 기준

### 7. `dashboard_snapshot.period` — 기간 구분
- `24h`, `7d`, `30d` 등 어떤 기간 기준 스냅샷인지 명시
- `change_percent`는 해당 period의 직전 동일 기간 대비 변화율

### 8. `timeseries_bucket` — `bucket_start` + `bucket_size`
- `bucket_start`: 버킷 시작 시간 (timestamp)
- `bucket_size`: `hourly`, `daily`, `weekly` 등
- label 대신 timestamp에서 파생 가능한 구조 — redundancy 제거

### 9. cursor 기반 페이지네이션
- `mev_receipt`: `receipt_id` cursor (UUID, 정렬은 `timestamp_ms DESC`)
- `mev_attack`: `signature` cursor (정렬은 `timestamp_ms DESC`)
- CLAUDE.md 규약: offset 사용 금지

### 10. `pool` — TVL/수수료 포함
- `last_known_tvl`: 풀의 마지막 관측 유동성 규모 — 샌드위치 수익성 분석의 핵심
- `fee_rate`: 풀 수수료율 — 공격 비용 산출에 필요
- `tvl_updated_at`: TVL 갱신 시점 (stale 판정용)

### 11. `protection_benchmark` ↔ `validator` 연관
- `validator_identity` FK (nullable) — 전체 통계일 때 null, 밸리데이터별 분석일 때 지정
- 특정 밸리데이터 슬롯에서 보호 도구 효과 차이 분석 가능

### 12. TimescaleDB 전환 고려
- `mev_attack`, `validator_metrics`, `timeseries_bucket`은 hypertable 후보
- Prisma와 TimescaleDB 궁합이 애매 — raw query 필요할 수 있음
- 우선 PostgreSQL + 인덱스로 시작, 데이터량 증가 시 전환 판단
