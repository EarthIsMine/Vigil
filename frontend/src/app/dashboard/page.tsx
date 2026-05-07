'use client';

import Sidebar from '@/components/Sidebar';
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
      <Sidebar />
      <main className="lg:pl-56">
        <div className="px-6 py-10 max-w-6xl mx-auto">
          {loading ? (
            <div className="text-vigil-muted font-mono text-sm py-12">
              Loading dashboard…
            </div>
          ) : (
            <>
              <DashboardHeader />
              {error && <ErrorBanner message={error} />}
              {stats && <DashboardStatsGrid stats={stats} />}

              <section className="mb-14 fade-up fade-up-d2">
                <h2 className="font-display text-2xl font-bold text-white mb-1">
                  Extraction over time
                </h2>
                <p className="text-sm text-vigil-muted mb-6">
                  Hourly buckets, stacked by attack type.
                </p>
                <DashboardChart timeseries={timeseries} />
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-14">
                <ValidatorLeaderboard validators={validators} />
                <PoolLeaderboard pools={pools} />
              </div>

              <DashboardLiveFeed attacks={liveFeed} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
