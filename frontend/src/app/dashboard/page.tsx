import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStatsGrid from '@/components/dashboard/DashboardStatsGrid';
import DashboardChart from '@/components/dashboard/DashboardChart';
import ValidatorLeaderboard from '@/components/dashboard/ValidatorLeaderboard';
import PoolLeaderboard from '@/components/dashboard/PoolLeaderboard';
import DashboardLiveFeed from '@/components/dashboard/DashboardLiveFeed';
import {
  getDashboardStats,
  getValidatorLeaderboard,
  getPoolLeaderboard,
} from '@/lib/services/dashboard';

export default async function DashboardPage() {
  const [stats, validators, pools] = await Promise.all([
    getDashboardStats(),
    getValidatorLeaderboard(),
    getPoolLeaderboard(),
  ]);

  return (
    <div className="min-h-screen bg-surface">
      <DashboardSidebar />
      <main className="lg:ml-56 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardHeader />
          <DashboardStatsGrid stats={stats} />
          <DashboardChart />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ValidatorLeaderboard validators={validators} />
            <PoolLeaderboard pools={pools} />
          </div>
          <DashboardLiveFeed />
        </div>
      </main>
    </div>
  );
}
