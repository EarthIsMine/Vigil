import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStatsGrid from '@/components/dashboard/DashboardStatsGrid';
import DashboardChart from '@/components/dashboard/DashboardChart';
import ValidatorLeaderboard from '@/components/dashboard/ValidatorLeaderboard';
import PoolLeaderboard from '@/components/dashboard/PoolLeaderboard';
import DashboardLiveFeedSection from '@/components/dashboard/DashboardLiveFeedSection';
import ErrorBanner from '@/components/shared/ErrorBanner';
import {
  getDashboardStats,
  getTimeSeries,
  getValidatorLeaderboard,
  getPoolLeaderboard,
  getLiveFeed,
} from '@/lib/services/dashboard';

const REVALIDATE_S = 30;

export default async function DashboardPage() {
  const [statsR, timeseriesR, validatorsR, poolsR, attacksR] =
    await Promise.allSettled([
      getDashboardStats({ revalidate: REVALIDATE_S }),
      getTimeSeries('24h', { revalidate: REVALIDATE_S }),
      getValidatorLeaderboard(5, { revalidate: REVALIDATE_S }),
      getPoolLeaderboard({ revalidate: REVALIDATE_S }),
      getLiveFeed(20, { revalidate: 0 }),
    ]);

  const stats = statsR.status === 'fulfilled' ? statsR.value : null;
  const timeseries = timeseriesR.status === 'fulfilled' ? timeseriesR.value : [];
  const validators = validatorsR.status === 'fulfilled' ? validatorsR.value : [];
  const pools = poolsR.status === 'fulfilled' ? poolsR.value : [];
  const initialAttacks = attacksR.status === 'fulfilled' ? attacksR.value : [];

  const allFailed = [statsR, timeseriesR, validatorsR, poolsR].every(
    (r) => r.status === 'rejected',
  );

  return (
    <div className="min-h-screen bg-surface text-white">
      <main className="pt-14">
        <div className="px-6 py-10 max-w-6xl mx-auto">
          <DashboardHeader />
          {allFailed && <ErrorBanner message="Couldn't reach the API" />}
          {stats && <DashboardStatsGrid stats={stats} />}

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 mb-14">
            <DashboardChart timeseries={timeseries} />
            <ValidatorLeaderboard validators={validators} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <PoolLeaderboard pools={pools} />
            <DashboardLiveFeedSection initialAttacks={initialAttacks} />
          </div>
        </div>
      </main>
    </div>
  );
}
