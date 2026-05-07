'use client';

import { useEffect, useMemo, useState } from 'react';
import { getValidatorLeaderboard } from '@/lib/services/dashboard';
import type { ValidatorLeaderboardEntry } from '@/lib/types';
import ValidatorList from '@/components/validator/ValidatorList';
import ErrorBanner from '@/components/shared/ErrorBanner';

const LIST_LIMIT = 100;

function parseExtracted(usd: string | null): number {
  if (!usd) return 0;
  const m = usd.match(/^\$([0-9.]+)([KMB]?)/);
  if (!m) return 0;
  const n = Number(m[1]);
  const mult = m[2] === 'M' ? 1_000_000 : m[2] === 'K' ? 1_000 : m[2] === 'B' ? 1_000_000_000 : 1;
  return n * mult;
}

function formatExtracted(total: number): string {
  if (total >= 1_000_000) return `$${(total / 1_000_000).toFixed(1)}M`;
  if (total >= 1_000) return `$${Math.round(total / 1_000)}K`;
  return `$${Math.round(total)}`;
}

export default function ValidatorListPage() {
  const [validators, setValidators] = useState<ValidatorLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let alive = true;
    getValidatorLeaderboard(LIST_LIMIT)
      .then((data) => {
        if (!alive) return;
        setValidators(data);
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setError("Couldn't reach the API");
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const summary = useMemo(() => {
    if (validators.length === 0) return null;
    const total = validators.length;
    const avgScore = Math.round(
      validators.reduce((s, v) => s + v.riskScore, 0) / total,
    );
    const totalExtracted = validators.reduce((s, v) => s + parseExtracted(v.extractedUsd), 0);
    const critical = validators.filter((v) => v.riskLevel === 'critical' || v.riskLevel === 'high').length;
    return { total, avgScore, totalExtracted, critical };
  }, [validators]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return validators;
    return validators.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.identity.toLowerCase().includes(q) ||
        v.client.toLowerCase().includes(q),
    );
  }, [validators, query]);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <main className="pt-14">
        <div className="px-6 py-10 max-w-6xl mx-auto">
          <header className="mb-10 fade-up">
            <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-3">
              Validators
            </h1>
            <p className="text-vigil-muted max-w-2xl">
              Risk-ranked by sandwich involvement, wide-sandwich rate, and MEV
              extraction. Click any row for full telemetry, attack heatmap, and
              the loss breakdown.
            </p>
          </header>

          {summary && (
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 border-y border-vigil-border py-6 mb-10 fade-up fade-up-d1">
              <Stat label="Validators ranked" value={summary.total.toLocaleString()} />
              <Stat label="High & critical" value={summary.critical.toLocaleString()} />
              <Stat label="Avg risk score" value={String(summary.avgScore)} />
              <Stat label="Total extracted" value={formatExtracted(summary.totalExtracted)} />
            </dl>
          )}

          {error && <ErrorBanner message={error} />}

          {!loading && validators.length > 0 && (
            <div className="mb-6 fade-up fade-up-d2">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by name, identity, or client"
                className="w-full sm:max-w-md px-4 py-2 bg-vigil-card-dark border border-vigil-border rounded-lg text-sm text-white placeholder:text-vigil-muted focus:outline-none focus:border-vigil-accent transition"
                aria-label="Filter validators"
              />
            </div>
          )}

          {loading ? (
            <p className="text-vigil-muted font-mono text-sm py-12">Loading validators…</p>
          ) : filtered.length === 0 && query ? (
            <p className="text-sm text-vigil-muted py-12">
              No validators match &ldquo;{query}&rdquo;.
            </p>
          ) : (
            <ValidatorList validators={filtered} />
          )}
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-vigil-muted mb-1.5">{label}</dt>
      <dd className="font-display text-2xl md:text-3xl font-bold text-white tabular-nums">
        {value}
      </dd>
    </div>
  );
}
