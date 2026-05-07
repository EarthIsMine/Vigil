'use client';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStatsGrid from '@/components/dashboard/DashboardStatsGrid';
import DashboardChart from '@/components/dashboard/DashboardChart';
import ValidatorLeaderboard from '@/components/dashboard/ValidatorLeaderboard';
import PoolLeaderboard from '@/components/dashboard/PoolLeaderboard';
import DashboardLiveFeed from '@/components/dashboard/DashboardLiveFeed';
import ErrorBanner from '@/components/shared/ErrorBanner';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useLiveAttacks } from '@/hooks/useLiveAttacks';

export default function DashboardPage() {
  const { stats, timeseries, validators, pools, loading, error } = useDashboardData();
  const liveFeed = useLiveAttacks(20);

  return (
    <div className="min-h-screen bg-surface text-white">
      <main className="pt-14">
        <div className="px-6 py-10 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-vigil-muted font-mono text-sm py-12">
              Loading dashboard…
            </div>
          ) : (
            <>
              <DashboardHeader />
              {error && <ErrorBanner message={error} />}
              {stats && <DashboardStatsGrid stats={stats} />}

              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 mb-14">
                <DashboardChart timeseries={timeseries} />
                <ValidatorLeaderboard validators={validators} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <PoolLeaderboard pools={pools} />
                <DashboardLiveFeed attacks={liveFeed} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
