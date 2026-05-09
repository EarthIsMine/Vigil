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
  /** When set, scopes to attacks where this validator was the slot leader. */
  leader?: string;
}

export const getPoolLeaderboard = (opts: PoolLeaderboardOpts = {}) => {
  const { range = '24h', limit = 5, leader, revalidate } = opts;
  const params = new URLSearchParams({
    limit: String(limit),
    range,
  });
  if (leader) params.set('leader', leader);
  return apiFetch<PoolLeaderboardEntry[]>(
    `/pools/leaderboard?${params.toString()}`,
    undefined,
    revalidate !== undefined ? { revalidate } : undefined,
  );
};

export interface LiveFeedOpts extends ApiFetchOpts {
  /** When set, scopes to attacks where this validator was the slot leader. */
  leader?: string;
}

export const getLiveFeed = (limit = 20, opts?: LiveFeedOpts) => {
  const params = new URLSearchParams({ limit: String(limit) });
  if (opts?.leader) params.set('leader', opts.leader);
  const fetchOpts =
    opts?.revalidate !== undefined ? { revalidate: opts.revalidate } : undefined;
  return apiFetch<MevAttack[]>(
    `/attacks/recent?${params.toString()}`,
    undefined,
    fetchOpts,
  );
};
