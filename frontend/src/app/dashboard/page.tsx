'use client';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStatsGrid from '@/components/dashboard/DashboardStatsGrid';
import DashboardChart from '@/components/dashboard/DashboardChart';
import ValidatorLeaderboard from '@/components/dashboard/ValidatorLeaderboard';
import PoolLeaderboard from '@/components/dashboard/PoolLeaderboard';
import DashboardLiveFeed from '@/components/dashboard/DashboardLiveFeed';
import ErrorBanner from '@/components/shared/ErrorBanner';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function DashboardPage() {
  const { stats, timeseries, validators, pools, liveFeed, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-muted font-mono text-sm">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardHeader />
          {error && <ErrorBanner message={error} />}
          {stats && <DashboardStatsGrid stats={stats} />}
          <DashboardChart timeseries={timeseries} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ValidatorLeaderboard validators={validators} />
            <PoolLeaderboard pools={pools} />
          </div>
          <DashboardLiveFeed attacks={liveFeed} />
        </div>
      </main>
    </div>
  );
}
