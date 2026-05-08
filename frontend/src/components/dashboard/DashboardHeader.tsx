'use client';

import { useConnectionStatus } from '@/components/ConnectionStatusProvider';

export default function DashboardHeader() {
  const status = useConnectionStatus();
  return (
    <header className="mb-10 fade-up">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-white mb-2">
            Dashboard
          </h1>
          <p className="text-vigil-muted">
            Last 24 hours of MEV extraction across Solana DEXs.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span
            className={[
              'w-1.5 h-1.5 rounded-full',
              status === 'live' ? 'bg-vigil-green animate-pulse' : 'bg-error',
            ].join(' ')}
            aria-hidden="true"
          />
          <span
            className={status === 'live' ? 'text-vigil-green' : 'text-error'}
          >
            {status === 'live' ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>
    </header>
  );
}
