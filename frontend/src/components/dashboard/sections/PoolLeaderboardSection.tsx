import { getPoolLeaderboard } from '@/lib/services/dashboard';
import PoolLeaderboardLive from '@/components/dashboard/PoolLeaderboardLive';

const REVALIDATE_S = 30;

export default async function PoolLeaderboardSection() {
  let pools: Awaited<ReturnType<typeof getPoolLeaderboard>> = [];
  try {
    pools = await getPoolLeaderboard({ revalidate: REVALIDATE_S });
  } catch {
    /* empty state — client poller will retry */
  }
  return <PoolLeaderboardLive initialPools={pools} />;
}
