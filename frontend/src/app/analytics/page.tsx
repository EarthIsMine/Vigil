'use client';

import IconSidebar from '@/components/shared/IconSidebar';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import AnalyticsStatsGrid from '@/components/analytics/AnalyticsStatsGrid';
import AnalyticsChart from '@/components/analytics/AnalyticsChart';
import AttackTypeBreakdown from '@/components/analytics/AttackTypeBreakdown';
import ProtocolLeaderboard from '@/components/analytics/ProtocolLeaderboard';
import EpochTable from '@/components/analytics/EpochTable';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

export default function AnalyticsPage() {
  const { epochs, protocols, maxAttacks } = useAnalyticsData();

  return (
    <div className="min-h-screen bg-vigil-bg text-white">
      <IconSidebar activePath="/analytics" />
      <main className="ml-16 pt-14">
        <div className="p-6 max-w-7xl mx-auto">
          <AnalyticsHeader />
          <AnalyticsStatsGrid epochs={epochs} />
          <AnalyticsChart />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AttackTypeBreakdown />
            <ProtocolLeaderboard protocols={protocols} maxAttacks={maxAttacks} />
          </div>
          <EpochTable epochs={epochs} />
        </div>
      </main>
    </div>
  );
}
