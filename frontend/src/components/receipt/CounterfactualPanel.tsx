'use client';

import { useState } from 'react';
import type {
  ReplayTrace,
  AmmReplayData,
  WhirlpoolReplayData,
  DlmmReplayData,
} from '@/lib/types';

interface CounterfactualPanelProps {
  trace: ReplayTrace | null | undefined;
}

const KIND_LABEL: Record<ReplayTrace['kind'], string> = {
  amm: 'Constant-product AMM',
  whirlpool: 'Orca Whirlpool (CLMM)',
  dlmm: 'Meteora DLMM',
};

export default function CounterfactualPanel({ trace }: CounterfactualPanelProps) {
  const [open, setOpen] = useState(false);

  if (!trace) return null;

  const counterfactual = trace.data.counterfactualVictimOut;
  const actual = trace.data.actualVictimOut;
  const extracted = Math.max(0, counterfactual - actual);

  return (
    <div className="text-xs">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-1 text-vigil-muted hover:text-white transition font-mono"
      >
        <span
          className={`material-symbols-outlined text-sm transition-transform ${open ? 'rotate-90' : ''}`}
          aria-hidden="true"
        >
          chevron_right
        </span>
        Counterfactual replay ({KIND_LABEL[trace.kind]})
      </button>

      {open && (
        <div className="mt-3 pl-5 space-y-3 font-mono">
          <div className="grid grid-cols-2 gap-3">
            <Stat label="If no attack" value={formatAmount(counterfactual)} tone="good" />
            <Stat label="Actual" value={formatAmount(actual)} tone="bad" />
          </div>
          <div className="bg-vigil-red/10 border border-vigil-red/30 rounded px-3 py-2 flex justify-between">
            <span className="text-vigil-muted">Sandwich extracted</span>
            <span className="text-vigil-red font-semibold">{formatAmount(extracted)}</span>
          </div>
          {trace.kind === 'amm' && <AmmDetail data={trace.data} />}
          {trace.kind === 'whirlpool' && <WhirlpoolDetail data={trace.data} />}
          {trace.kind === 'dlmm' && <DlmmDetail data={trace.data} />}
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'good' | 'bad';
}) {
  return (
    <div className="flex flex-col">
      <span className="text-vigil-muted text-[10px] uppercase tracking-wide">{label}</span>
      <span className={tone === 'good' ? 'text-accent-green' : 'text-vigil-red'}>{value}</span>
    </div>
  );
}

function AmmDetail({ data }: { data: AmmReplayData }) {
  const stages: { label: string; reserves: [number, number] }[] = [
    { label: 'Pre',          reserves: data.reservesPre },
    { label: 'Post-frontrun', reserves: data.reservesPostFront },
    { label: 'Post-victim',   reserves: data.reservesPostVictim },
    { label: 'Post-backrun',  reserves: data.reservesPostBack },
  ];

  return (
    <div className="space-y-2">
      <div className="text-vigil-muted text-[10px] uppercase tracking-wide">Pool reserves</div>
      <div className="space-y-1">
        {stages.map((s) => (
          <div key={s.label} className="flex justify-between gap-3">
            <span className="text-vigil-muted">{s.label}</span>
            <span className="text-white">
              {formatNum(s.reserves[0])} / {formatNum(s.reserves[1])}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between gap-3">
        <span className="text-vigil-muted">Spot price shift</span>
        <span className="text-white">
          {data.spotPricePre.toFixed(6)} → {data.spotPricePostFront.toFixed(6)}
        </span>
      </div>
    </div>
  );
}

function WhirlpoolDetail({ data }: { data: WhirlpoolReplayData }) {
  return (
    <div className="space-y-1">
      <div className="text-vigil-muted text-[10px] uppercase tracking-wide">Tick / liquidity</div>
      <div className="flex justify-between gap-3">
        <span className="text-vigil-muted">Tick</span>
        <span className="text-white">
          {data.tickCurrentPre} → {data.tickCurrentPostFront} → {data.tickCurrentPostVictim} → {data.tickCurrentPostBack}
        </span>
      </div>
      <div className="flex justify-between gap-3">
        <span className="text-vigil-muted">sqrt(price) pre</span>
        <span className="text-white truncate max-w-[180px]" title={data.sqrtPricePre}>
          {shortenBigStr(data.sqrtPricePre)}
        </span>
      </div>
      <div className="flex justify-between gap-3">
        <span className="text-vigil-muted">Liquidity pre</span>
        <span className="text-white truncate max-w-[180px]" title={data.liquidityPre}>
          {shortenBigStr(data.liquidityPre)}
        </span>
      </div>
    </div>
  );
}

function DlmmDetail({ data }: { data: DlmmReplayData }) {
  return (
    <div className="space-y-1">
      <div className="text-vigil-muted text-[10px] uppercase tracking-wide">Bin shift</div>
      <div className="flex justify-between gap-3">
        <span className="text-vigil-muted">Active id</span>
        <span className="text-white">
          {data.activeIdPre} → {data.activeIdPostFront} → {data.activeIdPostVictim} → {data.activeIdPostBack}
        </span>
      </div>
      <div className="flex justify-between gap-3">
        <span className="text-vigil-muted">Bin step</span>
        <span className="text-white">{data.binStep}</span>
      </div>
      <div className="flex justify-between gap-3">
        <span className="text-vigil-muted">Variable fee bps</span>
        <span className="text-white">
          {data.variableFeeRatePre} → {data.variableFeeRatePostFront}
        </span>
      </div>
    </div>
  );
}

function formatAmount(value: number): string {
  if (!Number.isFinite(value)) return '—';
  if (Math.abs(value) >= 1) return value.toFixed(4);
  return value.toFixed(6);
}

function formatNum(value: number): string {
  if (!Number.isFinite(value)) return '—';
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
  return value.toFixed(2);
}

function shortenBigStr(value: string): string {
  if (value.length <= 14) return value;
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}
