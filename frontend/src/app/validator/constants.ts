export const TELEMETRY_DATA = [
  { time: '2026-04-07 14:23:45', type: 'Sandwich',  pool: 'Orca SOL-USDC',      tx: '5Kx...9pR', extracted: '$12,450', latency: '8ms',  status: 'success' as const },
  { time: '2026-04-07 14:23:12', type: 'Backrun',   pool: 'Raydium RAY-SOL',    tx: '7mN...2kP', extracted: '$8,230',  latency: '11ms', status: 'success' as const },
  { time: '2026-04-07 14:22:58', type: 'Sandwich',  pool: 'Meteora SOL-USDT',   tx: '3Qw...8vL', extracted: '$15,680', latency: '9ms',  status: 'success' as const },
  { time: '2026-04-07 14:22:34', type: 'Sandwich',  pool: 'Orca BONK-SOL',      tx: '9Rt...4jK', extracted: '$24,590', latency: '15ms', status: 'success' as const },
  { time: '2026-04-07 14:22:01', type: 'Sandwich',  pool: 'Lifinity mSOL-SOL',  tx: '2Yx...7nM', extracted: '$9,870',  latency: '10ms', status: 'failed' as const },
  { time: '2026-04-07 14:21:47', type: 'Backrun',   pool: 'Orca JitoSOL-SOL',   tx: '6Zp...3hT', extracted: '$5,420',  latency: '13ms', status: 'success' as const },
  { time: '2026-04-07 14:21:23', type: 'Sandwich',  pool: 'Marinade mSOL-SOL',  tx: '8Lm...5qW', extracted: '$11,340', latency: '12ms', status: 'success' as const },
  { time: '2026-04-07 14:20:59', type: 'Sandwich',  pool: 'Orca SOL-USDC',      tx: '4Bn...9xC', extracted: '$18,760', latency: '14ms', status: 'success' as const },
] as const;

export const TARGETED_POOLS = [
  { name: 'Orca SOL-USDC',    value: 1247, max: 1247, color: '#ef4444' },
  { name: 'Raydium RAY-SOL',  value: 982,  max: 1247, color: '#f97316' },
  { name: 'Meteora SOL-USDT', value: 856,  max: 1247, color: '#eab308' },
  { name: 'Orca BONK-SOL',    value: 734,  max: 1247, color: '#22c55e' },
  { name: 'Lifinity mSOL-SOL', value: 621, max: 1247, color: '#22d3ee' },
  { name: 'Orca JitoSOL-SOL', value: 543,  max: 1247, color: '#3b82f6' },
  { name: 'Marinade mSOL-SOL', value: 487, max: 1247, color: '#a855f7' },
] as const;
