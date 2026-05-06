'use client';

import { useParams } from 'next/navigation';
import ValidatorBreadcrumb from '@/components/validator/ValidatorBreadcrumb';
import ValidatorHeader from '@/components/validator/ValidatorHeader';
import ValidatorStatCards from '@/components/validator/ValidatorStatCards';
import ValidatorHeatmapSection from '@/components/validator/ValidatorHeatmapSection';
import ValidatorAttackDistribution from '@/components/validator/ValidatorAttackDistribution';
import TelemetryTable from '@/components/validator/TelemetryTable';
import ValidatorPagination from '@/components/validator/ValidatorPagination';
import ValidatorFooter from '@/components/validator/ValidatorFooter';
import ErrorBanner from '@/components/shared/ErrorBanner';
import { useValidatorById } from '@/hooks/useValidatorById';

export default function ValidatorIdentityPage() {
  const params = useParams<{ identity: string }>();
  const raw = params?.identity ?? '';
  const identity = decodeURIComponent(Array.isArray(raw) ? raw[0] : raw);
  const { validator, riskColor, attacks, pools, loading, error } = useValidatorById(identity);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <main className="pt-14">
        <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
          <ValidatorBreadcrumb name={validator?.name ?? '...'} />
          {error && <ErrorBanner message={error} />}
          {loading && !validator ? (
            <div className="text-muted font-mono text-sm py-12 text-center">
              Loading validator...
            </div>
          ) : (
            <>
              <ValidatorHeader validator={validator} riskColor={riskColor} />
              <ValidatorStatCards validator={validator} />
              <ValidatorHeatmapSection attacks={attacks} />
              <ValidatorAttackDistribution attacks={attacks} pools={pools} />
              <TelemetryTable attacks={attacks} />
              <ValidatorPagination total={attacks.length} shown={20} />
              <ValidatorFooter />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
