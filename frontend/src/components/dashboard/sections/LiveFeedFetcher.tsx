import { getLiveFeed } from '@/lib/services/dashboard';
import DashboardLiveFeedSection from '@/components/dashboard/DashboardLiveFeedSection';

export default async function LiveFeedFetcher() {
  let initialAttacks: Awaited<ReturnType<typeof getLiveFeed>> = [];
  try {
    initialAttacks = await getLiveFeed(20, { revalidate: 0 });
  } catch {
    /* empty state — WS will fill in */
  }
  return <DashboardLiveFeedSection initialAttacks={initialAttacks} />;
}
