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
}

export function useValidatorData(): ValidatorDataState {
  const [validator, setValidator] = useState<ValidatorDetail | null>(null);
  const [attacks, setAttacks] = useState<MevAttack[]>([]);
  const [pools, setPools] = useState<PoolLeaderboardEntry[]>([]);

  useEffect(() => {
    async function load() {
      const [leaderboard, poolData, attackData] = await Promise.all([
        getValidatorLeaderboard(),
        getPoolLeaderboard(),
        getLiveFeed(50),
      ]);

      setPools(poolData);
      setAttacks(attackData);

      if (leaderboard.length > 0) {
        const detail = await getValidatorDetail(leaderboard[0].identity);
        setValidator(detail);
      }
    }
    load();
  }, []);

  const riskColor = getRiskColorHex(validator?.riskLevel ?? '');

  return { validator, riskColor, attacks, pools };
}
