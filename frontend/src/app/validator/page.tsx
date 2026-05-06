'use client';

import { useEffect, useState } from 'react';
import { getValidatorLeaderboard } from '@/lib/services/dashboard';
import type { ValidatorLeaderboardEntry } from '@/lib/types';
import ValidatorList from '@/components/validator/ValidatorList';
import ErrorBanner from '@/components/shared/ErrorBanner';

const LIST_LIMIT = 50;

export default function ValidatorListPage() {
  const [validators, setValidators] = useState<ValidatorLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <main className="pt-14">
        <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h1 className="font-display font-bold text-3xl mb-2">Validators</h1>
            <p className="text-vigil-muted text-sm">
              Risk-ranked by sandwich involvement, wide-sandwich rate, and
              MEV extraction. Click any row for full telemetry, attack heatmap,
              and the loss breakdown.
            </p>
          </div>

          {error && <ErrorBanner message={error} />}

          {loading ? (
            <div className="text-muted font-mono text-sm py-12 text-center">
              Loading validators...
            </div>
          ) : (
            <ValidatorList validators={validators} />
          )}
        </div>
      </main>
    </div>
  );
}
