import { getPoolLeaderboard } from '@/lib/services/dashboard';
import PoolLeaderboard from '@/components/dashboard/PoolLeaderboard';

const REVALIDATE_S = 30;

export default async function PoolLeaderboardSection() {
  let pools: Awaited<ReturnType<typeof getPoolLeaderboard>> = [];
  try {
    pools = await getPoolLeaderboard({ revalidate: REVALIDATE_S });
  } catch {
    /* empty state */
  }
  return <PoolLeaderboard pools={pools} />;
}
