import { MevType } from './types';

export { formatUsd, formatSol, shortenAddress, timeAgo } from './logic';

export function fmtChange(pct: number | null): { label: string; cls: string } {
  if (pct === null) return { label: 'N/A', cls: 'text-muted' };
  const sign = pct >= 0 ? '+' : '';
  return {
    label: `${sign}${pct.toFixed(1)}%`,
    cls: pct >= 0 ? 'text-secondary' : 'text-error',
  };
}

export function txTypeLabel(type: MevType): { label: string; cls: string } {
  switch (type) {
    case MevType.SANDWICH_SINGLE:
    case MevType.SANDWICH_WIDE:
    case MevType.SANDWICH_AUTH_HOP:
      return { label: 'Sandwiched', cls: 'text-vigil-red' };
    case MevType.BACKRUN:
      return { label: 'Backrun', cls: 'text-accent-yellow' };
    case MevType.JIT_LIQUIDITY:
      return { label: 'JIT', cls: 'text-accent-yellow' };
    case MevType.LIQUIDATION:
      return { label: 'Liquidation', cls: 'text-accent-yellow' };
    default:
      return { label: 'Neutral', cls: 'text-accent-green' };
  }
}

const RISK_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

export function getRiskColorHex(level: string): string {
  return RISK_COLORS[level] ?? '#8892ab';
}
