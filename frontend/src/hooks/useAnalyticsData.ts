'use client';

import { useState, useEffect } from 'react';
import { getEpochSummary, getProtocolLeaderboard } from '@/lib/services/analytics';
import type { EpochSummary } from '@/lib/services/analytics';
import type { PoolLeaderboardEntry } from '@/lib/types';

export interface AnalyticsData {
  epochs: EpochSummary[];
  protocols: PoolLeaderboardEntry[];
  maxAttacks: number;
}

export function useAnalyticsData(): AnalyticsData {
  const [epochs, setEpochs] = useState<EpochSummary[]>([]);
  const [protocols, setProtocols] = useState<PoolLeaderboardEntry[]>([]);

  useEffect(() => {
    Promise.all([getEpochSummary(), getProtocolLeaderboard()]).then(([e, p]) => {
      setEpochs(e);
      setProtocols(p);
    });
  }, []);

  const maxAttacks = protocols.reduce((m, p) => Math.max(m, p.attacks), 1);

  return { epochs, protocols, maxAttacks };
}
