'use client';

import type { MevAttack } from '@/lib/types';
import { useLiveAttacks } from '@/hooks/useLiveAttacks';
import DashboardLiveFeed from './DashboardLiveFeed';

export default function DashboardLiveFeedSection({
  initialAttacks,
}: {
  initialAttacks: MevAttack[];
}) {
  const attacks = useLiveAttacks(20, initialAttacks);
  return <DashboardLiveFeed attacks={attacks} />;
}
