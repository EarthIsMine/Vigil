import { apiFetch, type ApiFetchOpts } from '../api';
import type {
  DashboardStats,
  TimeSeriesDataPoint,
  ValidatorLeaderboardEntry,
  PoolLeaderboardEntry,
  MevAttack,
} from '../types';

export const getDashboardStats = (opts?: ApiFetchOpts) =>
  apiFetch<DashboardStats>('/dashboard/stats', undefined, opts);

export const getTimeSeries = (
  range: '1h' | '24h' | '7d' = '24h',
  opts?: ApiFetchOpts,
) =>
  apiFetch<TimeSeriesDataPoint[]>(
    `/dashboard/timeseries?range=${range}`,
    undefined,
    opts,
  );

export const getValidatorLeaderboard = (limit = 5, opts?: ApiFetchOpts) =>
  apiFetch<ValidatorLeaderboardEntry[]>(
    `/validators/leaderboard?limit=${limit}`,
    undefined,
    opts,
  );

export const getPoolLeaderboard = (opts?: ApiFetchOpts) =>
  apiFetch<PoolLeaderboardEntry[]>(
    '/pools/leaderboard?limit=5',
    undefined,
    opts,
  );

export const getLiveFeed = (limit = 20, opts?: ApiFetchOpts) =>
  apiFetch<MevAttack[]>(`/attacks/recent?limit=${limit}`, undefined, opts);
