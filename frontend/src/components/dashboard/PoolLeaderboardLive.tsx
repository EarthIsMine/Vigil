'use client';

import { useEffect, useRef, useState } from 'react';
import type { PoolLeaderboardEntry } from '@/lib/types';
import { getPoolLeaderboard } from '@/lib/services/dashboard';
import PoolLeaderboard from './PoolLeaderboard';

const POLL_MS = 30_000;

export default function PoolLeaderboardLive({
  initialPools,
}: {
  initialPools: PoolLeaderboardEntry[];
}) {
  const [pools, setPools] = useState<PoolLeaderboardEntry[]>(initialPools);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;

    const tick = async () => {
      try {
        const next = await getPoolLeaderboard();
        if (aliveRef.current) setPools(next);
      } catch {
        /* keep previous values on transient failure */
      }
    };

    const id = setInterval(tick, POLL_MS);
    return () => {
      aliveRef.current = false;
      clearInterval(id);
    };
  }, []);

  return <PoolLeaderboard pools={pools} />;
}
