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

const STATUS_DOT_CLASS: Record<ConnectionStatus, string> = {
  live: 'w-2 h-2 rounded-full bg-secondary animate-pulse',
  offline: 'w-2 h-2 rounded-full bg-error',
};

const STATUS_TEXT_CLASS: Record<ConnectionStatus, string> = {
  live: 'text-xs font-mono text-muted',
  offline: 'text-xs font-mono text-error',
};

export default function DashboardLiveFeed({ attacks }: DashboardLiveFeedProps) {
  const status = useConnectionStatus();

  return (
    <div className="bg-surface-100 border border-outline rounded-lg p-6 fade-up fade-up-d4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-on-surf">Recent Attacks Live Feed</h2>
        <div
          className="flex items-center gap-2"
          role="status"
          aria-label={`Connection status: ${STATUS_LABEL[status]}`}
        >
          <div className={STATUS_DOT_CLASS[status]}></div>
          <span className={STATUS_TEXT_CLASS[status]}>{STATUS_LABEL[status]}</span>
        </div>
      </div>
      <LiveFeed attacks={attacks} />
    </div>
  );
}
