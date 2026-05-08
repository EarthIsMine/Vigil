import { getValidatorLeaderboard } from '@/lib/services/dashboard';
import ValidatorLeaderboard from '@/components/dashboard/ValidatorLeaderboard';

const REVALIDATE_S = 30;

export default async function ValidatorLeaderboardSection() {
  let validators: Awaited<ReturnType<typeof getValidatorLeaderboard>> = [];
  try {
    validators = await getValidatorLeaderboard(5, { revalidate: REVALIDATE_S });
  } catch {
    /* empty state */
  }
  return <ValidatorLeaderboard validators={validators} />;
}
