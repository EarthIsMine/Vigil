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
import {
  MOCK_DASHBOARD_STATS,
  MOCK_TIMESERIES,
  MOCK_VALIDATOR_LEADERBOARD,
  MOCK_POOL_LEADERBOARD,
} from '@/lib/mock';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === '1';

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

const MOCK_STATE: DashboardData = {
  stats: MOCK_DASHBOARD_STATS,
  timeseries: MOCK_TIMESERIES,
  validators: MOCK_VALIDATOR_LEADERBOARD,
  pools: MOCK_POOL_LEADERBOARD,
  loading: false,
  error: null,
};

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>(
    USE_MOCK
      ? MOCK_STATE
      : {
          stats: null,
          timeseries: [],
          validators: [],
          pools: [],
          loading: true,
          error: null,
        }
  );

  useEffect(() => {
    if (USE_MOCK) return;

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
