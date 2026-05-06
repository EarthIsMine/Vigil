'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { getValidatorDetail } from '@/lib/services/validator';
import {
  getPoolLeaderboard,
  getLiveFeed,
} from '@/lib/services/dashboard';
import type {
  ValidatorDetail,
  MevAttack,
  PoolLeaderboardEntry,
} from '@/lib/types';
import { ApiError } from '@/lib/api';
import { getRiskColorHex } from '@/lib/format';

export interface ValidatorByIdState {
  validator: ValidatorDetail | null;
  riskColor: string;
  attacks: MevAttack[];
  pools: PoolLeaderboardEntry[];
  loading: boolean;
  error: string | null;
}

export function useValidatorById(identity: string): ValidatorByIdState {
  const [validator, setValidator] = useState<ValidatorDetail | null>(null);
  const [attacks, setAttacks] = useState<MevAttack[]>([]);
  const [pools, setPools] = useState<PoolLeaderboardEntry[]>([]);
  const [shouldNotFound, setShouldNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const detail = await getValidatorDetail(identity);
        if (!alive) return;
        setValidator(detail);
      } catch (err) {
        if (!alive) return;
        if (err instanceof ApiError && err.status === 404) {
          setShouldNotFound(true);
          return;
        }
        setError("Couldn't load validator");
      }

      const [poolRes, attackRes] = await Promise.allSettled([
        getPoolLeaderboard(),
        getLiveFeed(50),
      ]);
      if (!alive) return;
      setPools(poolRes.status === 'fulfilled' ? poolRes.value : []);
      setAttacks(attackRes.status === 'fulfilled' ? attackRes.value : []);
      setLoading(false);
    }

    load();
    return () => {
      alive = false;
    };
  }, [identity]);

  if (shouldNotFound) notFound();

  const riskColor = getRiskColorHex(validator?.riskLevel ?? '');
  return { validator, riskColor, attacks, pools, loading, error };
}
