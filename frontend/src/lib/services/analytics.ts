import { apiFetch, withFallback } from '../api';
import { MOCK_TIMESERIES, MOCK_POOL_LEADERBOARD } from '../mock';
import type { TimeSeriesDataPoint, PoolLeaderboardEntry, EpochSummary } from '../types';

export type { EpochSummary } from '../types';

const MOCK_EPOCH_SUMMARY: EpochSummary[] = [
  { epoch: 642, extracted: '$2.14M', sandwich: 847, frontrun: 312, backrun: 1204, dominantClient: 'Jito-Agave' },
  { epoch: 641, extracted: '$1.98M', sandwich: 791, frontrun: 287, backrun: 1089, dominantClient: 'Jito-Agave' },
  { epoch: 640, extracted: '$2.31M', sandwich: 903, frontrun: 341, backrun: 1347, dominantClient: 'Firedancer' },
  { epoch: 639, extracted: '$1.77M', sandwich: 712, frontrun: 263, backrun:  987, dominantClient: 'Jito-Agave' },
  { epoch: 638, extracted: '$2.05M', sandwich: 834, frontrun: 309, backrun: 1156, dominantClient: 'Agave' },
];

export const getAnalyticsTimeSeries = (range: '24h' | '7d' | '30d' = '7d') =>
  withFallback(
    'getAnalyticsTimeSeries',
    () => apiFetch<TimeSeriesDataPoint[]>(`/analytics/timeseries?range=${range}`),
    MOCK_TIMESERIES,
  );

export const getProtocolLeaderboard = () =>
  withFallback(
    'getProtocolLeaderboard',
    () => apiFetch<PoolLeaderboardEntry[]>('/analytics/protocols?limit=6'),
    MOCK_POOL_LEADERBOARD,
  );

export const getEpochSummary = () =>
  withFallback(
    'getEpochSummary',
    () => apiFetch<EpochSummary[]>('/analytics/epochs?limit=5'),
    MOCK_EPOCH_SUMMARY,
  );
