// ============================================
// Vigil Frontend Logic — 테스트
// ============================================
// 실행: npx tsx test/test.ts

import { MevType, Severity, MevAttack, ValidatorMetricsRaw, NormalizationBounds, RISK_SCORE_CONFIG } from './types';
import {
  classifySeverity,
  aggregateStats,
  bucketByTime,
  formatTimestamp,
  getRiskLevel,
  getGrade,
  shortenAddress,
  formatUsd,
  formatSol,
  timeAgo,
  slotToEstimatedTime,
  trendIcon,
  trendColor,
  calcLossPercent,
  normalizeMinMax,
  normalizeLog,
  normalizeMetrics,
  calculateRiskScore,
} from './logic';

// --- 테스트 헬퍼 ---

let passed = 0;
let failed = 0;

function assert(condition: boolean, name: string) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${name}`);
  } else {
    failed++;
    console.log(`  ❌ ${name}`);
  }
}

function assertEqual<T>(actual: T, expected: T, name: string) {
  const ok = actual === expected;
  if (!ok) {
    failed++;
    console.log(`  ❌ ${name} — expected: ${JSON.stringify(expected)}, got: ${JSON.stringify(actual)}`);
  } else {
    passed++;
    console.log(`  ✅ ${name}`);
  }
}

function section(title: string) {
  console.log(`\n━━━ ${title} ━━━`);
}

// --- Mock 데이터 ---

function makeMockAttack(overrides: Partial<MevAttack> = {}): MevAttack {
  return {
    signature: 'sig_' + Math.random().toString(36).slice(2, 10),
    type: MevType.SANDWICH_SINGLE,
    timestamp: Date.now() - 3_600_000, // 1시간 전
    slot: 300_000_000,
    extractedUsd: 50,
    extractedSol: 0.5,
    victim: {
      signer: 'VicT1m1234567890abcdefghijklmnopqrstuvwxyz',
      amountIn: 1000,
      amountOut: 950,
      expectedAmountOut: 1000,
    },
    attacker: 'ATK1234567890abcdefghijklmnopqrstuvwxyz1234',
    dex: 'jupiter',
    pool: 'pool_abc123',
    severity: Severity.HIGH,
    ...overrides,
  };
}

// ================================================
// 테스트 시작
// ================================================

console.log('\n🔬 Vigil Frontend Logic 테스트\n');

// --- 1. classifySeverity ---
section('1. classifySeverity');

assertEqual(classifySeverity(-5), Severity.INFO, '음수 → INFO');
assertEqual(classifySeverity(0), Severity.INFO, '0 → INFO');
assertEqual(classifySeverity(0.5), Severity.LOW, '$0.5 → LOW');
assertEqual(classifySeverity(0.99), Severity.LOW, '$0.99 → LOW');
assertEqual(classifySeverity(1), Severity.MEDIUM, '$1 → MEDIUM');
assertEqual(classifySeverity(9.99), Severity.MEDIUM, '$9.99 → MEDIUM');
assertEqual(classifySeverity(10), Severity.HIGH, '$10 → HIGH');
assertEqual(classifySeverity(99.99), Severity.HIGH, '$99.99 → HIGH');
assertEqual(classifySeverity(100), Severity.CRITICAL, '$100 → CRITICAL');
assertEqual(classifySeverity(10000), Severity.CRITICAL, '$10000 → CRITICAL');

// 경계값 테스트
assertEqual(classifySeverity(1), Severity.MEDIUM, '경계: $1은 MEDIUM (< 아닌 <=)');
assertEqual(classifySeverity(10), Severity.HIGH, '경계: $10은 HIGH');
assertEqual(classifySeverity(100), Severity.CRITICAL, '경계: $100은 CRITICAL');

// --- 2. aggregateStats ---
section('2. aggregateStats');

{
  const now = Date.now();

  // 현재 기간 (1시간 내) 공격 3건
  const currentAttacks = [
    makeMockAttack({ timestamp: now - 1_000, extractedUsd: 100, extractedSol: 1, attacker: 'A' }),
    makeMockAttack({ timestamp: now - 2_000, extractedUsd: 200, extractedSol: 2, attacker: 'B' }),
    makeMockAttack({ timestamp: now - 3_000, extractedUsd: 50, extractedSol: 0.5, attacker: 'A' }),
  ];

  // 이전 기간 (1~2시간 전) 공격 2건
  const previousAttacks = [
    makeMockAttack({ timestamp: now - 4_000_000, extractedUsd: 100, extractedSol: 1, attacker: 'C' }),
    makeMockAttack({ timestamp: now - 5_000_000, extractedUsd: 100, extractedSol: 1, attacker: 'C' }),
  ];

  const allAttacks = [...currentAttacks, ...previousAttacks];
  const stats = aggregateStats(allAttacks, '1h');

  assertEqual(stats.totalMevExtracted24h.usd, 350, '총 추출 USD = 350');
  assertEqual(stats.totalMevExtracted24h.sol, 3.5, '총 추출 SOL = 3.5');
  assertEqual(stats.totalMevExtracted24h.changePercent, 75, '변화율 = (350-200)/200*100 = 75%');
  assertEqual(stats.totalAttacks24h.count, 3, '공격 횟수 = 3');
  assertEqual(stats.activeAttackers24h.count, 2, '고유 공격자 수 = 2 (A, B)');
  assertEqual(stats.activeAttackers24h.topAttacker, 'B', 'top 공격자 = B (A=150, B=200)');
  // 수정: A = 100+50 = 150, B = 200, top은 B
}

{
  // 이전 기간 데이터 없을 때 changePercent = null
  const now = Date.now();
  const attacks = [
    makeMockAttack({ timestamp: now - 1_000, extractedUsd: 100, extractedSol: 1 }),
  ];
  const stats = aggregateStats(attacks, '1h');
  assertEqual(stats.totalMevExtracted24h.changePercent, null, '이전 데이터 없으면 changePercent = null');
}

// --- 3. bucketByTime ---
section('3. bucketByTime');

{
  const baseTime = 1_712_500_800_000; // 고정 시간

  const attacks = [
    makeMockAttack({ timestamp: baseTime, extractedUsd: 100, type: MevType.SANDWICH_SINGLE }),
    makeMockAttack({ timestamp: baseTime + 100_000, extractedUsd: 50, type: MevType.BACKRUN }),
    // 2시간 뒤 (빈 버킷 1개가 사이에 있어야 함)
    makeMockAttack({ timestamp: baseTime + 7_200_000, extractedUsd: 200, type: MevType.SANDWICH_WIDE }),
  ];

  const buckets = bucketByTime(attacks, '1h');

  assert(buckets.length === 3, '1h 간격: 3개 버킷 (빈 버킷 1개 포함)');
  assertEqual(buckets[0].attackCount, 2, '첫 버킷: 공격 2건');
  assertEqual(buckets[0].sandwichSingleUsd, 100, '첫 버킷: sandwich_single = 100');
  assertEqual(buckets[0].backrunUsd, 50, '첫 버킷: backrun = 50');
  assertEqual(buckets[1].attackCount, 0, '두번째 버킷: 빈 버킷 (공격 0건)');
  assertEqual(buckets[1].totalUsd, 0, '두번째 버킷: totalUsd = 0');
  assertEqual(buckets[2].sandwichWideUsd, 200, '세번째 버킷: sandwich_wide = 200');
}

{
  // 빈 배열
  const buckets = bucketByTime([], '1h');
  assertEqual(buckets.length, 0, '빈 배열 → 빈 결과');
}

// --- 4. getRiskLevel ---
section('4. getRiskLevel');

assertEqual(getRiskLevel(0), 'low', '0 → low');
assertEqual(getRiskLevel(24), 'low', '24 → low');
assertEqual(getRiskLevel(25), 'medium', '25 → medium');
assertEqual(getRiskLevel(49), 'medium', '49 → medium');
assertEqual(getRiskLevel(50), 'high', '50 → high');
assertEqual(getRiskLevel(74), 'high', '74 → high');
assertEqual(getRiskLevel(75), 'critical', '75 → critical');
assertEqual(getRiskLevel(100), 'critical', '100 → critical');

// --- 5. getGrade ---
section('5. getGrade');

assertEqual(getGrade(95), 'A', '95 → A');
assertEqual(getGrade(100), 'A', '100 → A');
assertEqual(getGrade(85), 'B', '85 → B');
assertEqual(getGrade(94), 'B', '94 → B');
assertEqual(getGrade(70), 'C', '70 → C');
assertEqual(getGrade(50), 'D', '50 → D');
assertEqual(getGrade(49), 'F', '49 → F');
assertEqual(getGrade(0), 'F', '0 → F');

// --- 6. 유틸리티 함수 ---
section('6. shortenAddress');

assertEqual(
  shortenAddress('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'),
  '7xKX...gAsU',
  '44자 주소 축약 (앞4 + 뒤4)'
);
assertEqual(
  shortenAddress('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', 6),
  '7xKXtg...osgAsU',
  'chars=6: 앞6 + 뒤6'
);

// 짧은 주소
assertEqual(shortenAddress('abc', 4), 'abc', '짧은 주소는 그대로');

section('7. formatUsd');

assertEqual(formatUsd(0.5), '$0.50', '$0.50');
assertEqual(formatUsd(999), '$999.00', '$999.00');
assertEqual(formatUsd(1000), '$1.00K', '$1K');
assertEqual(formatUsd(1500), '$1.50K', '$1.5K');
assertEqual(formatUsd(1_000_000), '$1.00M', '$1M');
assertEqual(formatUsd(2_500_000), '$2.50M', '$2.5M');

section('8. formatSol');

assertEqual(formatSol(1_000_000_000), '1.0000 SOL', '1 SOL');
assertEqual(formatSol(500_000_000), '0.5000 SOL', '0.5 SOL');
assertEqual(formatSol(100_000), '0.0001 SOL', '0.0001 SOL');

section('9. slotToEstimatedTime');

assertEqual(slotToEstimatedTime(1), 400, '1 slot = 400ms');
assertEqual(slotToEstimatedTime(10), 4000, '10 slots = 4000ms');
assertEqual(slotToEstimatedTime(0), 0, '0 slots = 0ms');

section('10. trendIcon');

assertEqual(trendIcon(10), '↑', '10% → ↑');
assertEqual(trendIcon(-10), '↓', '-10% → ↓');
assertEqual(trendIcon(3), '→', '3% → →');
assertEqual(trendIcon(0), '→', '0% → →');
assertEqual(trendIcon(5), '→', '5% → → (경계: >5 아님)');
assertEqual(trendIcon(5.01), '↑', '5.01% → ↑');

section('11. trendColor');

assertEqual(trendColor(-10), '#4ae176', 'MEV 감소(invertGood=true) → 초록');
assertEqual(trendColor(10), '#ff5252', 'MEV 증가(invertGood=true) → 빨강');
assertEqual(trendColor(10, false), '#4ae176', 'invertGood=false, 증가 → 초록');
assertEqual(trendColor(-10, false), '#ff5252', 'invertGood=false, 감소 → 빨강');
assertEqual(trendColor(0), '#ff5252', '0% → 빨강 (< 0이 아니므로)');

section('12. calcLossPercent');

assertEqual(calcLossPercent(100, 90), 10, '(100-90)/100*100 = 10%');
assertEqual(calcLossPercent(100, 100), 0, '손실 없음 = 0%');
assertEqual(calcLossPercent(0, 50), 0, 'expected=0 → 0% (0 나누기 방지)');
assertEqual(calcLossPercent(1000, 950), 5, '5% 손실');

section('13. formatTimestamp');

{
  // 2024-04-07 14:00:00 UTC
  const ts = new Date('2024-04-07T14:00:00Z').getTime();
  const label1d = formatTimestamp(ts, '1d');
  const label1h = formatTimestamp(ts, '1h');
  assert(label1d.includes('/'), '1d 포맷: MM/DD 형식');
  assert(label1h.includes(':'), '1h 포맷: HH:MM 포함');
}

// --- 14. 정규화 함수 ---
section('14. normalizeMinMax');

assertEqual(normalizeMinMax(50, 0, 100), 50, '중간값 → 50');
assertEqual(normalizeMinMax(0, 0, 100), 0, '최소값 → 0');
assertEqual(normalizeMinMax(100, 0, 100), 100, '최대값 → 100');
assertEqual(normalizeMinMax(150, 0, 100), 100, '초과값 → 100 (클램프)');
assertEqual(normalizeMinMax(-10, 0, 100), 0, '미만값 → 0 (클램프)');
assertEqual(normalizeMinMax(5, 5, 5), 0, 'min===max → 0');

section('15. normalizeLog');

assertEqual(normalizeLog(0, 1000), 0, '0 → 0');
assertEqual(normalizeLog(-5, 1000), 0, '음수 → 0');
assert(normalizeLog(10, 1000) > 0, '양수 → 양수');
assert(normalizeLog(10, 1000) < normalizeLog(100, 1000), '10 < 100 (단조 증가)');
assert(normalizeLog(1000, 1000) <= 100, 'max값 → 100 이하');
// log scale 특성: 극단값이 눌림
{
  const half = normalizeLog(500, 1000);
  assert(half > 50, 'log(500) > 선형 50% (log scale 특성: 중간값이 선형보다 높음)');
}

// --- 16. calculateRiskScore ---
section('16. calculateRiskScore — Cold Start');

{
  const bounds: NormalizationBounds = {
    consecutiveLeaderAbuse: { min: 0, max: 50 },
    avgExtractionPerSlot: { min: 0, max: 1 },
    totalExtractedSol: { max: 10000 },
  };

  // Cold start: 관측 슬롯 < 100
  const coldRaw: ValidatorMetricsRaw = {
    sandwichInvolvementRate: 0.5,
    wideSandwichRate: 0.3,
    consecutiveLeaderAbuse: 10,
    totalExtractedSol: 100,
    avgExtractionPerSlot: 0.5,
    recentTrend: 'increasing',
    observedSlots: 50,  // < 100
  };
  const coldResult = calculateRiskScore(coldRaw, bounds);
  assertEqual(coldResult.score, null, 'cold start → score = null');
  assertEqual(coldResult.level, 'unrated', 'cold start → unrated');
  assertEqual(coldResult.normalized, null, 'cold start → normalized = null');
}

section('17. calculateRiskScore — 정상 계산');

{
  const bounds: NormalizationBounds = {
    consecutiveLeaderAbuse: { min: 0, max: 50 },
    avgExtractionPerSlot: { min: 0, max: 1 },
    totalExtractedSol: { max: 10000 },
  };

  // 악성 밸리데이터: 높은 지표
  const evilRaw: ValidatorMetricsRaw = {
    sandwichInvolvementRate: 0.8,   // 80%
    wideSandwichRate: 0.9,          // 90%
    consecutiveLeaderAbuse: 40,     // 높음
    totalExtractedSol: 5000,        // 높음
    avgExtractionPerSlot: 0.8,      // 높음
    recentTrend: 'increasing',
    observedSlots: 500,
  };
  const evilResult = calculateRiskScore(evilRaw, bounds);
  assert(evilResult.score !== null, '악성 밸리데이터 → score !== null');
  assert(evilResult.score! >= 75, `악성 밸리데이터 → critical (score=${evilResult.score})`);
  assertEqual(evilResult.level, 'critical', '악성 밸리데이터 → critical level');

  // 선량한 밸리데이터: 낮은 지표
  const goodRaw: ValidatorMetricsRaw = {
    sandwichInvolvementRate: 0.02,  // 2%
    wideSandwichRate: 0.01,         // 1%
    consecutiveLeaderAbuse: 0,
    totalExtractedSol: 5,
    avgExtractionPerSlot: 0.01,
    recentTrend: 'decreasing',
    observedSlots: 1000,
  };
  const goodResult = calculateRiskScore(goodRaw, bounds);
  assert(goodResult.score !== null, '선량한 밸리데이터 → score !== null');
  assert(goodResult.score! < 25, `선량한 밸리데이터 → low (score=${goodResult.score})`);
  assertEqual(goodResult.level, 'low', '선량한 밸리데이터 → low level');
}

section('18. calculateRiskScore — 트렌드 승수 효과');

{
  const bounds: NormalizationBounds = {
    consecutiveLeaderAbuse: { min: 0, max: 50 },
    avgExtractionPerSlot: { min: 0, max: 1 },
    totalExtractedSol: { max: 10000 },
  };

  const baseRaw: ValidatorMetricsRaw = {
    sandwichInvolvementRate: 0.4,
    wideSandwichRate: 0.5,
    consecutiveLeaderAbuse: 20,
    totalExtractedSol: 500,
    avgExtractionPerSlot: 0.4,
    recentTrend: 'stable',
    observedSlots: 300,
  };

  const stableResult = calculateRiskScore(baseRaw, bounds);

  const increasingRaw = { ...baseRaw, recentTrend: 'increasing' as const };
  const increasingResult = calculateRiskScore(increasingRaw, bounds);

  const decreasingRaw = { ...baseRaw, recentTrend: 'decreasing' as const };
  const decreasingResult = calculateRiskScore(decreasingRaw, bounds);

  assert(
    increasingResult.score! > stableResult.score!,
    `increasing(${increasingResult.score}) > stable(${stableResult.score})`
  );
  assert(
    stableResult.score! > decreasingResult.score!,
    `stable(${stableResult.score}) > decreasing(${decreasingResult.score})`
  );

  // 승수 비율 검증 (±15%)
  const ratio = increasingResult.score! / decreasingResult.score!;
  assert(
    ratio > 1.2 && ratio < 1.5,
    `increasing/decreasing 비율 = ${ratio.toFixed(2)} (1.15/0.85 ≈ 1.35 예상)`
  );
}

section('19. calculateRiskScore — 가중치 우선순위 검증');

{
  const bounds: NormalizationBounds = {
    consecutiveLeaderAbuse: { min: 0, max: 50 },
    avgExtractionPerSlot: { min: 0, max: 1 },
    totalExtractedSol: { max: 10000 },
  };

  const base: ValidatorMetricsRaw = {
    sandwichInvolvementRate: 0,
    wideSandwichRate: 0,
    consecutiveLeaderAbuse: 0,
    totalExtractedSol: 0,
    avgExtractionPerSlot: 0,
    recentTrend: 'stable',
    observedSlots: 500,
  };

  // wideSandwichRate만 최대 (30%)
  const wideOnly = calculateRiskScore({ ...base, wideSandwichRate: 1.0 }, bounds);
  // sandwichInvolvementRate만 최대 (15%)
  const invOnly = calculateRiskScore({ ...base, sandwichInvolvementRate: 1.0 }, bounds);
  // totalExtractedSol만 최대 (10%, log)
  const solOnly = calculateRiskScore({ ...base, totalExtractedSol: 10000 }, bounds);

  assert(
    wideOnly.score! > invOnly.score!,
    `wideSandwich(${wideOnly.score}) > involvement(${invOnly.score}) — 30% vs 15%`
  );
  assert(
    invOnly.score! > solOnly.score!,
    `involvement(${invOnly.score}) > totalExtracted(${solOnly.score}) — 15% vs 10%`
  );
}

section('20. getRiskLevel — unrated');

assertEqual(getRiskLevel(null), 'unrated', 'null → unrated');

// ================================================
// 결과 요약
// ================================================

console.log('\n━━━━━━━━━━━━━━━━━━━━━');
console.log(`\n총 ${passed + failed}개 테스트: ✅ ${passed} passed, ❌ ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}
