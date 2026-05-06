'use client';

import { useState, useEffect } from 'react';
import { getValidatorDetail } from '@/lib/services/validator';
import { getValidatorLeaderboard, getPoolLeaderboard, getLiveFeed } from '@/lib/services/dashboard';
import type { ValidatorDetail, MevAttack, PoolLeaderboardEntry } from '@/lib/types';
import { getRiskColorHex } from '@/lib/format';

export interface ValidatorDataState {
  validator: ValidatorDetail | null;
  riskColor: string;
  attacks: MevAttack[];
  pools: PoolLeaderboardEntry[];
  loading: boolean;
  error: string | null;
}

export function useValidatorData(): ValidatorDataState {
  const [validator, setValidator] = useState<ValidatorDetail | null>(null);
  const [attacks, setAttacks] = useState<MevAttack[]>([]);
  const [pools, setPools] = useState<PoolLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [leaderboardRes, poolsRes, attacksRes] = await Promise.allSettled([
        getValidatorLeaderboard(),
        getPoolLeaderboard(),
        getLiveFeed(50),
      ]);
      if (cancelled) return;

      const leaderboard = leaderboardRes.status === 'fulfilled' ? leaderboardRes.value : [];
      setPools(poolsRes.status === 'fulfilled' ? poolsRes.value : []);
      setAttacks(attacksRes.status === 'fulfilled' ? attacksRes.value : []);

      if (leaderboard.length > 0) {
        try {
          const detail = await getValidatorDetail(leaderboard[0].identity);
          if (!cancelled) setValidator(detail);
        } catch {
          /* validator detail couldn't load — leave null and surface via error below */
        }
      }

      if (!cancelled) {
        setLoading(false);
        const allFailed =
          leaderboardRes.status === 'rejected' &&
          poolsRes.status === 'rejected' &&
          attacksRes.status === 'rejected';
        setError(allFailed ? "Couldn't reach the API" : null);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const riskColor = getRiskColorHex(validator?.riskLevel ?? '');

  return { validator, riskColor, attacks, pools, loading, error };
}
