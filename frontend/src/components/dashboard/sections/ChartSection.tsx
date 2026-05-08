import { getTimeSeries } from '@/lib/services/dashboard';
import DashboardChart from '@/components/dashboard/DashboardChart';

const REVALIDATE_S = 30;

export default async function ChartSection() {
  let timeseries: Awaited<ReturnType<typeof getTimeSeries>> = [];
  try {
    timeseries = await getTimeSeries('24h', { revalidate: REVALIDATE_S });
  } catch {
    /* fall through with empty data — chart renders empty state */
  }
  return <DashboardChart timeseries={timeseries} />;
}
