import { getDashboardStats } from '@/lib/services/dashboard';
import DashboardStatsGrid from '@/components/dashboard/DashboardStatsGrid';
import ErrorBanner from '@/components/shared/ErrorBanner';

const REVALIDATE_S = 30;

export default async function StatsSection() {
  try {
    const stats = await getDashboardStats({ revalidate: REVALIDATE_S });
    return <DashboardStatsGrid stats={stats} />;
  } catch {
    return <ErrorBanner message="Couldn't load stats" />;
  }
}
