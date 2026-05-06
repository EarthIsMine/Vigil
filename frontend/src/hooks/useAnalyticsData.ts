'use client';

import { useState, useEffect } from 'react';
import { getEpochSummary, getProtocolLeaderboard } from '@/lib/services/analytics';
import type { EpochSummary } from '@/lib/services/analytics';
import type { PoolLeaderboardEntry } from '@/lib/types';

export interface AnalyticsData {
  epochs: EpochSummary[];
  protocols: PoolLeaderboardEntry[];
  maxAttacks: number;
  loading: boolean;
  error: string | null;
}

export function useAnalyticsData(): AnalyticsData {
  const [epochs, setEpochs] = useState<EpochSummary[]>([]);
  const [protocols, setProtocols] = useState<PoolLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([getEpochSummary(), getProtocolLeaderboard()]).then(([eRes, pRes]) => {
      if (cancelled) return;

      setEpochs(eRes.status === 'fulfilled' ? eRes.value : []);
      setProtocols(pRes.status === 'fulfilled' ? pRes.value : []);
      setLoading(false);
      setError(
        eRes.status === 'rejected' && pRes.status === 'rejected'
          ? "Couldn't reach the API"
          : null,
      );
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const maxAttacks = protocols.reduce((m, p) => Math.max(m, p.attacks), 1);

  return { epochs, protocols, maxAttacks, loading, error };
}
