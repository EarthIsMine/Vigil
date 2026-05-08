import { Suspense } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

// Render the page dynamically so the static shell streams immediately while
// the slow leaderboard data arrives via Suspense; the underlying fetches keep
// their per-request revalidate cache.
export const dynamic = 'force-dynamic';

import StatsSection from '@/components/dashboard/sections/StatsSection';
import ChartSection from '@/components/dashboard/sections/ChartSection';
import ValidatorLeaderboardSection from '@/components/dashboard/sections/ValidatorLeaderboardSection';
import PoolLeaderboardSection from '@/components/dashboard/sections/PoolLeaderboardSection';
import LiveFeedFetcher from '@/components/dashboard/sections/LiveFeedFetcher';
import {
  StatsGridSkeleton,
  ChartSkeleton,
  LeaderboardSkeleton,
  LiveFeedSkeleton,
} from '@/components/dashboard/sections/skeletons';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-surface text-white">
      <main className="pt-14">
        <div className="px-6 py-10 max-w-6xl mx-auto">
          <DashboardHeader />

          <Suspense fallback={<StatsGridSkeleton />}>
            <StatsSection />
          </Suspense>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 mb-14">
            <Suspense fallback={<ChartSkeleton />}>
              <ChartSection />
            </Suspense>
            <Suspense fallback={<LeaderboardSkeleton />}>
              <ValidatorLeaderboardSection />
            </Suspense>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Suspense fallback={<LeaderboardSkeleton />}>
              <PoolLeaderboardSection />
            </Suspense>
            <Suspense fallback={<LiveFeedSkeleton />}>
              <LiveFeedFetcher />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
