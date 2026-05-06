import { apiFetch } from '../api';
import type { TimeSeriesDataPoint, PoolLeaderboardEntry, EpochSummary } from '../types';

export type { EpochSummary } from '../types';

export const getAnalyticsTimeSeries = (range: '24h' | '7d' | '30d' = '7d') =>
  apiFetch<TimeSeriesDataPoint[]>(`/analytics/timeseries?range=${range}`);

export const getProtocolLeaderboard = () =>
  apiFetch<PoolLeaderboardEntry[]>('/analytics/protocols?limit=6');

export const getEpochSummary = () =>
  apiFetch<EpochSummary[]>('/analytics/epochs?limit=5');
