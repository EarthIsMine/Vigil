'use client';

import { useState, useEffect } from 'react';
import {
  getDashboardStats,
  getTimeSeries,
  getValidatorLeaderboard,
  getPoolLeaderboard,
  getLiveFeed,
} from '@/lib/services/dashboard';
import type {
  DashboardStats,
  TimeSeriesDataPoint,
  ValidatorLeaderboardEntry,
  PoolLeaderboardEntry,
  MevAttack,
} from '@/lib/types';

interface DashboardData {
  stats: DashboardStats | null;
  timeseries: TimeSeriesDataPoint[];
  validators: ValidatorLeaderboardEntry[];
  pools: PoolLeaderboardEntry[];
  liveFeed: MevAttack[];
  loading: boolean;
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    stats: null,
    timeseries: [],
    validators: [],
    pools: [],
    liveFeed: [],
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [stats, timeseries, validators, pools, liveFeed] = await Promise.all([
        getDashboardStats(),
        getTimeSeries('24h'),
        getValidatorLeaderboard(),
        getPoolLeaderboard(),
        getLiveFeed(20),
      ]);

      if (!cancelled) {
        setData({ stats, timeseries, validators, pools, liveFeed, loading: false });
      }
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
