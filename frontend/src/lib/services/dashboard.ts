import { apiFetch, withFallback } from '../api';
import {
  MOCK_DASHBOARD_STATS,
  MOCK_TIMESERIES,
  MOCK_VALIDATOR_LEADERBOARD,
  MOCK_POOL_LEADERBOARD,
  MOCK_LIVE_FEED,
} from '../mock';
import type {
  DashboardStats,
  TimeSeriesDataPoint,
  ValidatorLeaderboardEntry,
  PoolLeaderboardEntry,
  MevAttack,
} from '../types';

export const getDashboardStats = () =>
  withFallback(
    'getDashboardStats',
    () => apiFetch<DashboardStats>('/dashboard/stats'),
    MOCK_DASHBOARD_STATS,
  );

export const getTimeSeries = (range: '1h' | '24h' | '7d' = '24h') =>
  withFallback(
    'getTimeSeries',
    () => apiFetch<TimeSeriesDataPoint[]>(`/dashboard/timeseries?range=${range}`),
    MOCK_TIMESERIES,
  );

export const getValidatorLeaderboard = () =>
  withFallback(
    'getValidatorLeaderboard',
    () => apiFetch<ValidatorLeaderboardEntry[]>('/validators/leaderboard?limit=5'),
    MOCK_VALIDATOR_LEADERBOARD,
  );

export const getPoolLeaderboard = () =>
  withFallback(
    'getPoolLeaderboard',
    () => apiFetch<PoolLeaderboardEntry[]>('/pools/leaderboard?limit=5'),
    MOCK_POOL_LEADERBOARD,
  );

export const getLiveFeed = (limit = 20) =>
  withFallback(
    'getLiveFeed',
    () => apiFetch<MevAttack[]>(`/attacks/recent?limit=${limit}`),
    MOCK_LIVE_FEED,
  );
