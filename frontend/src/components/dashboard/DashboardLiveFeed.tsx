'use client';

import LiveFeed from '@/components/LiveFeed';
import { useConnectionStatus, type ConnectionStatus } from '@/components/ConnectionStatusProvider';
import type { MevAttack } from '@/lib/types';

interface DashboardLiveFeedProps {
  attacks: MevAttack[];
}

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  live: 'Live',
  offline: 'Offline',
};

const DOT_CLASS: Record<ConnectionStatus, string> = {
  live: 'bg-vigil-green animate-pulse',
  offline: 'bg-error',
};

const TEXT_CLASS: Record<ConnectionStatus, string> = {
  live: 'text-vigil-green',
  offline: 'text-error',
};

export default function DashboardLiveFeed({ attacks }: DashboardLiveFeedProps) {
  const status = useConnectionStatus();

  return (
    <section className="fade-up fade-up-d4">
      <header className="flex items-baseline justify-between mb-5">
        <h2 className="font-display text-2xl font-bold text-white">
          Live attack feed
        </h2>
        <div
          className="flex items-center gap-2 text-xs"
          role="status"
          aria-label={`Connection status: ${STATUS_LABEL[status]}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${DOT_CLASS[status]}`} />
          <span className={TEXT_CLASS[status]}>{STATUS_LABEL[status]}</span>
        </div>
      </header>
      <LiveFeed attacks={attacks} />
    </section>
  );
}
