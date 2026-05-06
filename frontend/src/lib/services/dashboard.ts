import { apiFetch } from '../api';
import type {
  DashboardStats,
  TimeSeriesDataPoint,
  ValidatorLeaderboardEntry,
  PoolLeaderboardEntry,
  MevAttack,
} from '../types';

export const getDashboardStats = () =>
  apiFetch<DashboardStats>('/dashboard/stats');

export const getTimeSeries = (range: '1h' | '24h' | '7d' = '24h') =>
  apiFetch<TimeSeriesDataPoint[]>(`/dashboard/timeseries?range=${range}`);

export const getValidatorLeaderboard = () =>
  apiFetch<ValidatorLeaderboardEntry[]>('/validators/leaderboard?limit=5');

export const getPoolLeaderboard = () =>
  apiFetch<PoolLeaderboardEntry[]>('/pools/leaderboard?limit=5');

export const getLiveFeed = (limit = 20) =>
  apiFetch<MevAttack[]>(`/attacks/recent?limit=${limit}`);
