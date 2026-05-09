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

export type PoolLeaderboardRange = '1h' | '24h' | '7d' | 'all';

export interface PoolLeaderboardOpts extends ApiFetchOpts {
  range?: PoolLeaderboardRange;
  limit?: number;
}

export const getPoolLeaderboard = (opts: PoolLeaderboardOpts = {}) => {
  const { range = '24h', limit = 5, revalidate } = opts;
  return apiFetch<PoolLeaderboardEntry[]>(
    `/pools/leaderboard?limit=${limit}&range=${range}`,
    undefined,
    revalidate !== undefined ? { revalidate } : undefined,
  );
};

export const getLiveFeed = (limit = 20, opts?: ApiFetchOpts) =>
  apiFetch<MevAttack[]>(`/attacks/recent?limit=${limit}`, undefined, opts);
