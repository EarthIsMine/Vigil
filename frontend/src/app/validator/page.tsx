import ValidatorListSection from '@/components/validator/ValidatorListSection';
import ErrorBanner from '@/components/shared/ErrorBanner';
import { getValidatorLeaderboard } from '@/lib/services/dashboard';
import type { ValidatorLeaderboardEntry } from '@/lib/types';

const LIST_LIMIT = 100;
const REVALIDATE_S = 60;

export default async function ValidatorListPage() {
  let validators: ValidatorLeaderboardEntry[] = [];
  let failed = false;
  try {
    validators = await getValidatorLeaderboard(LIST_LIMIT, {
      revalidate: REVALIDATE_S,
    });
  } catch {
    failed = true;
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <main className="pt-14">
        <div className="px-6 py-10 max-w-6xl mx-auto">
          <header className="mb-10 fade-up">
            <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-3">
              Validators
            </h1>
            <p className="text-vigil-muted max-w-2xl">
              Risk-ranked by sandwich involvement, wide-sandwich rate, and MEV
              extraction. Click any row for full telemetry, attack heatmap, and
              the loss breakdown.
            </p>
          </header>

          {failed && <ErrorBanner message="Couldn't reach the API" />}

          <ValidatorListSection validators={validators} />
        </div>
      </main>
    </div>
  );
}
