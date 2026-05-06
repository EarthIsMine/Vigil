'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getValidatorLeaderboard } from '@/lib/services/dashboard';
import ErrorBanner from '@/components/shared/ErrorBanner';

/**
 * `/validator` is an alias for the top validator's detail page so the URL
 * matches the breadcrumb. On mount we fetch the leaderboard and replace
 * the route with `/validator/{topIdentity}`. Deep-link to a specific
 * validator goes through `/validator/[identity]` directly.
 */
export default function ValidatorIndexPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    getValidatorLeaderboard()
      .then((leaderboard) => {
        if (!alive) return;
        if (leaderboard.length === 0) {
          setError('No validators available yet');
          return;
        }
        router.replace(`/validator/${encodeURIComponent(leaderboard[0].identity)}`);
      })
      .catch(() => {
        if (alive) setError("Couldn't reach the API");
      });

    return () => {
      alive = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <main className="pt-14">
        <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
          {error ? (
            <ErrorBanner message={error} />
          ) : (
            <div className="text-muted font-mono text-sm py-12 text-center">
              Loading validators...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
