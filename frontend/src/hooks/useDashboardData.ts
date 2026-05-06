'use client';

import { useState, useEffect } from 'react';
import {
  getDashboardStats,
  getTimeSeries,
  getValidatorLeaderboard,
  getPoolLeaderboard,
} from '@/lib/services/dashboard';
import type {
  DashboardStats,
  TimeSeriesDataPoint,
  ValidatorLeaderboardEntry,
  PoolLeaderboardEntry,
} from '@/lib/types';

interface DashboardData {
  stats: DashboardStats | null;
  timeseries: TimeSeriesDataPoint[];
  validators: ValidatorLeaderboardEntry[];
  pools: PoolLeaderboardEntry[];
  loading: boolean;
  error: string | null;
}

function valueOr<T>(result: PromiseSettledResult<T>, fallback: T): T {
  return result.status === 'fulfilled' ? result.value : fallback;
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    stats: null,
    timeseries: [],
    validators: [],
    pools: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [stats, timeseries, validators, pools] = await Promise.allSettled([
        getDashboardStats(),
        getTimeSeries('24h'),
        getValidatorLeaderboard(),
        getPoolLeaderboard(),
      ]);

      if (cancelled) return;

      const allFailed = [stats, timeseries, validators, pools].every(
        (r) => r.status === 'rejected',
      );

      setData({
        stats: stats.status === 'fulfilled' ? stats.value : null,
        timeseries: valueOr(timeseries, []),
        validators: valueOr(validators, []),
        pools: valueOr(pools, []),
        loading: false,
        error: allFailed ? "Couldn't reach the API" : null,
      });
    }

    load();
    const id = setInterval(load, 30_000);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return data;
}
