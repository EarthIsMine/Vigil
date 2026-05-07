// Dev-only mock backend.
// Serves the FE response shapes locally so you can demo / inspect the UI
// without bringing up Postgres + the detector. Run alongside the FE:
//
//   node scripts/dev-mock-be.mjs
//   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1 pnpm --filter vigil-frontend dev
//
// ⚠️  DEMO DATA — DO NOT PUBLISH OR SCREENSHOT FOR EXTERNAL DISTRIBUTION.
//    • Validator names are real Solana brands (publicly known). Their
//      pubkeys, stake, commission, risk scores, and extraction figures
//      here are *all synthetic* — fabricated for layout testing only.
//    • The real product computes these metrics from the detector's
//      replay output against on-chain state. Do not compare these
//      synthetic scores to any real validator's behavior.
//
// Production uses the real Nest.js BE; this file is purely for local UI work.

import http from 'node:http';

const PORT = 3001;
const NOW = Date.now();

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const rndAddr = (n = 36) =>
  Array.from({ length: n }, () => B58[Math.floor(Math.random() * B58.length)]).join('');

const ATTACK_TYPES = ['sandwich_single', 'backrun', 'sandwich_single', 'sandwich_wide'];
const SEVERITIES = ['high', 'info', 'critical', 'medium'];
const CONFIDENCE_LEVELS = ['high', 'medium', 'low', 'high'];
const DETECTION_METHODS = ['header', 'cross_slot_window', 'jito_bundle', 'header'];
const BUNDLE_PROVENANCES = ['atomic', 'organic', 'tip_race', 'spanning'];
const LOSS_SOURCES = ['amm_replay', 'whirlpool_replay', 'dlmm_replay', 'pool_amount_out'];
const DEXES = ['Orca', 'Raydium', 'Meteora'];
const POOLS = ['SOL/USDC', 'RAY/SOL', 'BONK/SOL'];

const STATS = {
  totalMevExtracted24h: { usd: 4_820_000, sol: 35_400, changePercent: 12.4 },
  totalAttacks24h: { count: 1247, changePercent: 8.1 },
  averageLossPerTx: { usd: 347.21, changePercent: -5.3 },
  activeAttackers24h: { count: 38, topAttacker: 'StKH...7Qx4p' },
};

const TIMESERIES = Array.from({ length: 24 }, (_, i) => {
  const ts = NOW - (23 - i) * 3_600_000;
  const base = 150_000 + Math.sin(i / 3) * 60_000;
  return {
    timestamp: ts,
    label: new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    totalUsd: Math.round(base + Math.random() * 40_000),
    sandwichSingleUsd: Math.round(base * 0.52),
    sandwichWideUsd: Math.round(base * 0.18),
    backrunUsd: Math.round(base * 0.30),
    otherUsd: 0,
    attackCount: Math.floor(40 + Math.random() * 30),
  };
});

const SEED_VALIDATORS = [
  { identity: 'StKHse7Qx4p', name: 'Stake House Capital', client: 'Jito-Agave', riskScore: 96 },
  { identity: 'mariN4vALi9', name: 'Marinade Finance',    client: 'Jito-Agave', riskScore: 81 },
  { identity: 'J1to1abund1', name: 'Jito Labs',           client: 'Jito-Agave', riskScore: 74 },
  { identity: 'C1oRu5s1one', name: 'Chorus One',          client: 'Agave',      riskScore: 48 },
  { identity: 'Ev3Rs7take5', name: 'Everstake',           client: 'Jito-Agave', riskScore: 35 },
];

// Fictional names — keeps real validator brands off this demo data.
// Prefixed `Validator-` so screenshots can't be mistaken for real metrics
// against any actual public validator.
const FILLER_NAMES = Array.from({ length: 45 }, (_, i) =>
  `Validator-${String(i + 1).padStart(3, '0')}`,
);

const CLIENTS = ['Jito-Agave', 'Agave', 'Frankendancer', 'Firedancer'];

const B58_ID = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789';
const detIdent = (name) => {
  // deterministic-ish per name so the list stays stable across requests
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  let id = '';
  for (let i = 0; i < 11; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    id += B58_ID[h % B58_ID.length];
  }
  return id;
};

const riskLevelFor = (score) =>
  score >= 75 ? 'critical' :
  score >= 50 ? 'high' :
  score >= 25 ? 'medium' :
  score > 0   ? 'low' : 'unrated';

const formatExtracted = (n) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` :
  n >= 1_000     ? `$${Math.round(n / 1_000)}K` :
                   `$${n}`;

const filler = FILLER_NAMES.map((name, i) => {
  // taper score 30 → 4 across the filler so distribution is realistic
  const score = Math.max(4, Math.round(30 - (i / FILLER_NAMES.length) * 26 + (Math.sin(i) * 4)));
  return {
    identity: detIdent(name),
    name,
    client: CLIENTS[i % CLIENTS.length],
    riskScore: score,
  };
});

const ALL_VALIDATORS = [...SEED_VALIDATORS, ...filler];

const VALIDATOR_LB = ALL_VALIDATORS.map((v, i) => ({
  rank: i + 1,
  identity: v.identity,
  name: v.name,
  client: v.client,
  riskScore: v.riskScore,
  riskLevel: riskLevelFor(v.riskScore),
  // taper extracted with a noisy decay; high-rank gets more
  extractedUsd: formatExtracted(
    Math.round(900_000 / Math.pow(i + 1, 0.55) + Math.sin(i * 1.7) * 30_000),
  ),
}));

const POOLS_LB = [
  { pool: 'SOL/USDC', dex: 'Orca', attacks: 342, volumeLost: '$1.2M', trend: '+15%' },
  { pool: 'RAY/SOL', dex: 'Raydium', attacks: 289, volumeLost: '$987K', trend: '+8%' },
  { pool: 'BONK/SOL', dex: 'Orca', attacks: 247, volumeLost: '$743K', trend: '+12%' },
  { pool: 'mSOL/SOL', dex: 'Meteora', attacks: 198, volumeLost: '$621K', trend: '+5%' },
  { pool: 'JitoSOL/SOL', dex: 'Orca', attacks: 156, volumeLost: '$492K', trend: '+18%' },
];

const LIVE_FEED = Array.from({ length: 8 }, (_, i) => ({
  signature: `mock-sig-${i}-${NOW}`,
  type: ATTACK_TYPES[i % 4],
  severity: SEVERITIES[i % 4],
  slot: 281_493_000 + i * 4,
  timestamp: NOW - i * 12_000,
  victim: {
    signer: rndAddr(),
    amountIn: +(Math.random() * 5 + 0.1).toFixed(3),
    amountOut: +(Math.random() * 200 + 10).toFixed(2),
    expectedAmountOut: +(Math.random() * 220 + 15).toFixed(2),
  },
  attacker: rndAddr(),
  pool: POOLS[i % 3],
  dex: DEXES[i % 3],
  extractedUsd: +(Math.random() * 800 + 20).toFixed(2),
  extractedSol: +(Math.random() * 6 + 0.1).toFixed(3),
  confidenceLevel: CONFIDENCE_LEVELS[i % 4],
  detectionMethod: DETECTION_METHODS[i % 4],
  bundleProvenance: BUNDLE_PROVENANCES[i % 4],
  lossSource: LOSS_SOURCES[i % 4],
}));

const RECEIPT_AMM_REPLAY = {
  reservesPre: [1_000_000, 200_000],
  reservesPostFront: [1_010_000, 198_020],
  reservesPostVictim: [1_015_000, 197_040],
  reservesPostBack: [1_005_000, 199_010],
  spotPricePre: 0.2,
  spotPricePostFront: 0.196,
  counterfactualVictimOut: 102.5,
  actualVictimOut: 98.2,
  feeNum: 30,
  feeDen: 10_000,
};

function makeReceipt(i, opts = {}) {
  const detected = opts.detected ?? true;
  const unenriched = opts.unenriched ?? false;
  const lossSol = unenriched ? 0 : 0.1 + i * 0.05;
  return {
    receiptId: `VGL-${i}`,
    txSignature: `${rndAddr(48)}`,
    timestamp: NOW - i * 1800_000,
    victim: {
      wallet: '7xKpmN4q' + rndAddr(8),
      action: 'swap',
      dex: DEXES[i % 3],
      tokenIn: { mint: 'So111', symbol: 'SOL', decimals: 9 },
      tokenOut: { mint: 'EPjFW', symbol: 'USDC', decimals: 6 },
      amountIn: 1.5 + i * 0.1,
      expectedAmountOut: 204.82,
      actualAmountOut: 204.82 - lossSol * 100,
      slippage: 0.5,
    },
    mevAnalysis: {
      detected,
      type: detected ? 'sandwich_single' : 'none',
      severity: detected ? 'high' : 'info',
      loss: {
        expectedAmountOut: 204.82,
        actualAmountOut: 204.82 - lossSol * 100,
        lossAmount: lossSol,
        lossUsd: lossSol * 150,
        lossPercent: (lossSol * 100) / 204.82,
        confidence: detected ? 'exact' : 'estimated',
      },
    },
    validator: { identity: 'StKHse7Qx4p', name: 'Stake House Capital', riskLevel: 'critical', riskScore: 96 },
    protection: { toolUsed: null, wasProtected: false, protectionFailed: false },
    shareUrl: '',
    shareImageUrl: '',
    confidenceLevel: detected ? CONFIDENCE_LEVELS[i % 4] : null,
    detectionMethod: detected ? DETECTION_METHODS[i % 4] : null,
    bundleProvenance: detected ? BUNDLE_PROVENANCES[i % 4] : null,
    lossSource: unenriched ? 'unenriched' : detected ? LOSS_SOURCES[i % 4] : null,
    replayTrace: detected && !unenriched && i === 0 ? { kind: 'amm', data: RECEIPT_AMM_REPLAY } : null,
    attackDetail: {
      kind: 'sandwich',
      attackerAddress: rndAddr(),
      frontrunTx: rndAddr(),
      backrunTx: rndAddr(),
      attackerProfit: lossSol * 0.7,
      attackerProfitUsd: lossSol * 0.7 * 150,
      pool: POOLS[i % 3],
      frontrunSlot: 281_493_000 + i * 4,
      backrunSlot: 281_493_002 + i * 4,
      isWideSandwich: false,
    },
  };
}

const RECEIPTS = [
  makeReceipt(0, { detected: true }),
  makeReceipt(1, { detected: true, unenriched: true }),
  makeReceipt(2, { detected: false }),
  makeReceipt(3, { detected: true }),
];

const RECEIPT_RESULT = {
  totalTxScanned: 47,
  totalAttacked: 14,
  totalLossUsd: 58.22,
  totalLossSol: 0.428,
  avgLossPerTx: 4.16,
  worstAttack: RECEIPTS[0],
  receipts: RECEIPTS,
};

// Match the leaderboard entries so /validator/[identity] from list click
// renders the same name/risk/extraction the user just saw in the row.
const VALIDATOR_DETAILS = {
  StKHse7Qx4p: {
    name: 'Stake House Capital', voteAccount: 'StKHseVote7Qx4p',
    client: 'Jito-Agave', stake: '12,345,678 SOL', commission: 5, activeSinceEpoch: 532,
    sandwichInvolvementRate: 0.42, wideSandwichRate: 0.18, consecutiveLeaderAbuse: 7,
    totalExtractedSol: 2_341, avgExtractionPerSlot: 0.000731, recentTrend: 'increasing',
    observedSlots: 12_000, riskScore: 96, riskLevel: 'critical',
  },
  mariN4vALi9: {
    name: 'Marinade Finance', voteAccount: 'mariNVote4vALi9',
    client: 'Jito-Agave', stake: '8,234,123 SOL', commission: 7, activeSinceEpoch: 489,
    sandwichInvolvementRate: 0.34, wideSandwichRate: 0.14, consecutiveLeaderAbuse: 5,
    totalExtractedSol: 1_842, avgExtractionPerSlot: 0.000523, recentTrend: 'increasing',
    observedSlots: 11_400, riskScore: 81, riskLevel: 'high',
  },
  J1to1abund1: {
    name: 'Jito Labs', voteAccount: 'J1to1Vote1bund1',
    client: 'Jito-Agave', stake: '15,789,001 SOL', commission: 4, activeSinceEpoch: 412,
    sandwichInvolvementRate: 0.29, wideSandwichRate: 0.12, consecutiveLeaderAbuse: 4,
    totalExtractedSol: 1_521, avgExtractionPerSlot: 0.000412, recentTrend: 'stable',
    observedSlots: 12_400, riskScore: 74, riskLevel: 'high',
  },
  C1oRu5s1one: {
    name: 'Chorus One', voteAccount: 'C1oRuVote5s1one',
    client: 'Agave', stake: '6,012,789 SOL', commission: 8, activeSinceEpoch: 521,
    sandwichInvolvementRate: 0.18, wideSandwichRate: 0.07, consecutiveLeaderAbuse: 2,
    totalExtractedSol: 894, avgExtractionPerSlot: 0.000236, recentTrend: 'decreasing',
    observedSlots: 10_900, riskScore: 48, riskLevel: 'medium',
  },
  Ev3Rs7take5: {
    name: 'Everstake', voteAccount: 'Ev3RsVote7take5',
    client: 'Jito-Agave', stake: '4,567,890 SOL', commission: 9, activeSinceEpoch: 480,
    sandwichInvolvementRate: 0.13, wideSandwichRate: 0.05, consecutiveLeaderAbuse: 1,
    totalExtractedSol: 612, avgExtractionPerSlot: 0.000169, recentTrend: 'stable',
    observedSlots: 11_100, riskScore: 35, riskLevel: 'medium',
  },
};

function makeValidatorDetail(identity) {
  const known = VALIDATOR_DETAILS[identity];
  // Fallback for unknown identities — keeps the page renderable rather than 404.
  const d = known ?? {
    name: `Unknown (${identity.slice(0, 6)})`,
    voteAccount: identity,
    client: 'unknown',
    stake: '0 SOL',
    commission: 0,
    activeSinceEpoch: 0,
    sandwichInvolvementRate: 0,
    wideSandwichRate: 0,
    consecutiveLeaderAbuse: 0,
    totalExtractedSol: 0,
    avgExtractionPerSlot: 0,
    recentTrend: 'stable',
    observedSlots: 0,
    riskScore: 0,
    riskLevel: 'unrated',
  };

  return {
    identity,
    name: d.name,
    voteAccount: d.voteAccount,
    client: d.client,
    stake: d.stake,
    commission: d.commission,
    activeSinceEpoch: d.activeSinceEpoch,
    metricsRaw: {
      sandwichInvolvementRate: d.sandwichInvolvementRate,
      wideSandwichRate: d.wideSandwichRate,
      consecutiveLeaderAbuse: d.consecutiveLeaderAbuse,
      totalExtractedSol: d.totalExtractedSol,
      avgExtractionPerSlot: d.avgExtractionPerSlot,
      recentTrend: d.recentTrend,
      observedSlots: d.observedSlots,
    },
    metricsNormalized: known
      ? {
          sandwichInvolvementRate: Math.min(100, Math.round(d.sandwichInvolvementRate * 200)),
          wideSandwichRate: Math.min(100, Math.round(d.wideSandwichRate * 400)),
          consecutiveLeaderAbuse: Math.min(100, d.consecutiveLeaderAbuse * 12),
          totalExtractedSol: Math.min(100, Math.round((d.totalExtractedSol / 2_500) * 100)),
          avgExtractionPerSlot: Math.min(100, Math.round((d.avgExtractionPerSlot / 0.001) * 100)),
          recentTrend: d.recentTrend,
        }
      : null,
    riskScore: d.riskScore,
    riskLevel: d.riskLevel,
    lastUpdated: NOW - 60_000,
  };
}

const EPOCHS = [
  { epoch: 642, extracted: '$2.14M', sandwich: 847, frontrun: 312, backrun: 1204, dominantClient: 'Jito-Agave' },
  { epoch: 641, extracted: '$1.98M', sandwich: 791, frontrun: 287, backrun: 1089, dominantClient: 'Jito-Agave' },
  { epoch: 640, extracted: '$2.31M', sandwich: 903, frontrun: 341, backrun: 1347, dominantClient: 'Firedancer' },
  { epoch: 639, extracted: '$1.77M', sandwich: 712, frontrun: 263, backrun: 987, dominantClient: 'Jito-Agave' },
  { epoch: 638, extracted: '$2.05M', sandwich: 834, frontrun: 309, backrun: 1156, dominantClient: 'Agave' },
];

const ROUTES = {
  '/api/v1/dashboard/stats': () => STATS,
  '/api/v1/dashboard/timeseries': () => TIMESERIES,
  '/api/v1/pools/leaderboard': () => POOLS_LB,
  '/api/v1/attacks/recent': () => LIVE_FEED,
  '/api/v1/receipts/search': () => RECEIPT_RESULT,
  '/api/v1/analytics/timeseries': () => TIMESERIES,
  '/api/v1/analytics/protocols': () => POOLS_LB.slice(0, 6),
  '/api/v1/analytics/epochs': () => EPOCHS,
};

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (ROUTES[pathname]) {
    return send(res, 200, ROUTES[pathname]());
  }

  if (pathname === '/api/v1/validators/leaderboard') {
    const limit = Math.min(Number(url.searchParams.get('limit') ?? 50), VALIDATOR_LB.length);
    return send(res, 200, VALIDATOR_LB.slice(0, limit));
  }

  const validatorMatch = pathname.match(/^\/api\/v1\/validators\/([^/]+)$/);
  if (validatorMatch) {
    return send(res, 200, makeValidatorDetail(decodeURIComponent(validatorMatch[1])));
  }

  send(res, 404, { error: { code: 'not_found', message: pathname } });
});

server.listen(PORT, () => {
  console.log(`[mock-be] listening on http://localhost:${PORT}`);
  console.log(`[mock-be] point FE: NEXT_PUBLIC_API_URL=http://localhost:${PORT}/api/v1`);
});
