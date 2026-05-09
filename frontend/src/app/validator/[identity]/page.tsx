import { notFound } from 'next/navigation';
import ValidatorBreadcrumb from '@/components/validator/ValidatorBreadcrumb';
import ValidatorHeader from '@/components/validator/ValidatorHeader';
import ValidatorStatCards from '@/components/validator/ValidatorStatCards';
import EngineEvidence from '@/components/validator/EngineEvidence';
import ValidatorHeatmapSection from '@/components/validator/ValidatorHeatmapSection';
import ValidatorAttackDistribution from '@/components/validator/ValidatorAttackDistribution';
import TelemetryTable from '@/components/validator/TelemetryTable';
import ErrorBanner from '@/components/shared/ErrorBanner';
import { getValidatorDetail } from '@/lib/services/validator';
import { getPoolLeaderboard, getLiveFeed } from '@/lib/services/dashboard';
import { ApiError } from '@/lib/api';
import { getRiskColorHex } from '@/lib/format';
import type { MevAttack, PoolLeaderboardEntry, ValidatorDetail } from '@/lib/types';

const REVALIDATE_S = 30;

export default async function ValidatorIdentityPage({
  params,
}: {
  params: Promise<{ identity: string }>;
}) {
  const { identity: rawIdentity } = await params;
  const identity = decodeURIComponent(rawIdentity);

  let validator: ValidatorDetail | null = null;
  let detailError = false;
  try {
    validator = await getValidatorDetail(identity, { revalidate: REVALIDATE_S });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    detailError = true;
  }

  const [poolsR, attacksR] = await Promise.allSettled([
    getPoolLeaderboard({ leader: identity, range: 'all', revalidate: REVALIDATE_S }),
    getLiveFeed(50, { leader: identity, revalidate: REVALIDATE_S }),
  ]);
  const pools: PoolLeaderboardEntry[] =
    poolsR.status === 'fulfilled' ? poolsR.value : [];
  const attacks: MevAttack[] =
    attacksR.status === 'fulfilled' ? attacksR.value : [];

  const riskColor = getRiskColorHex(validator?.riskLevel ?? '');

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <main className="pt-14">
        <div className="px-6 py-10 max-w-6xl mx-auto">
          <ValidatorBreadcrumb name={validator?.name ?? '...'} />
          {detailError && <ErrorBanner message="Couldn't load validator" />}
          <ValidatorHeader validator={validator} riskColor={riskColor} />
          <ValidatorStatCards validator={validator} />
          <EngineEvidence attacks={attacks} />
          <ValidatorHeatmapSection attacks={attacks} />
          <ValidatorAttackDistribution
            attacksByType={validator?.attacksByType ?? {}}
            attacksTotal={validator?.attacksTotal ?? 0}
            pools={pools}
          />
          <TelemetryTable attacks={attacks} />
        </div>
      </main>
    </div>
  );
}
