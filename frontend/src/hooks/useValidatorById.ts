'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { getValidatorDetail } from '@/lib/services/validator';
import {
  getValidatorLeaderboard,
  getPoolLeaderboard,
  getLiveFeed,
} from '@/lib/services/dashboard';
import type {
  ValidatorDetail,
  MevAttack,
  PoolLeaderboardEntry,
} from '@/lib/types';
import { IS_MOCK, ApiError, apiFetch } from '@/lib/api';
import { getRiskColorHex } from '@/lib/format';

export interface ValidatorByIdState {
  validator: ValidatorDetail | null;
  riskColor: string;
  attacks: MevAttack[];
  pools: PoolLeaderboardEntry[];
}

export function useValidatorById(identity: string): ValidatorByIdState {
  const [validator, setValidator] = useState<ValidatorDetail | null>(null);
  const [attacks, setAttacks] = useState<MevAttack[]>([]);
  const [pools, setPools] = useState<PoolLeaderboardEntry[]>([]);
  const [shouldNotFound, setShouldNotFound] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      // In mock mode the service always returns the same MOCK_VALIDATOR_DETAIL,
      // so we validate identity against the leaderboard to surface a real 404.
      if (IS_MOCK) {
        const leaderboard = await getValidatorLeaderboard();
        if (!alive) return;
        if (!leaderboard.some((v) => v.identity === identity)) {
          setShouldNotFound(true);
          return;
        }
      }

      let detail: ValidatorDetail;
      if (IS_MOCK) {
        const mock = await getValidatorDetail(identity);
        detail = { ...mock, identity };
      } else {
        try {
          detail = await apiFetch<ValidatorDetail>(
            `/validators/${encodeURIComponent(identity)}`,
          );
        } catch (err) {
          if (err instanceof ApiError && err.status === 404) {
            if (alive) setShouldNotFound(true);
            return;
          }
          // Network/other failure → fall back to mock so the page still renders.
          const mock = await getValidatorDetail(identity);
          detail = { ...mock, identity };
        }
      }

      if (!alive) return;
      setValidator(detail);

      const [poolData, attackData] = await Promise.all([
        getPoolLeaderboard(),
        getLiveFeed(50),
      ]);
      if (!alive) return;
      setPools(poolData);
      setAttacks(attackData);
    }

    load();
    return () => {
      alive = false;
    };
  }, [identity]);

  if (shouldNotFound) notFound();

  const riskColor = getRiskColorHex(validator?.riskLevel ?? '');
  return { validator, riskColor, attacks, pools };
}
