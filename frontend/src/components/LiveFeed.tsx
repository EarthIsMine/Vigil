'use client';

import type { Attack, AttackType } from '@/hooks/useLiveFeed';
import { useLiveFeed } from '@/hooks/useLiveFeed';

const getAttackColor = (type: AttackType) => {
  switch (type) {
    case 'Sandwich':
      return 'text-error';
    case 'Frontrun':
      return 'text-warning';
    case 'Protected':
      return 'text-secondary';
    case 'Backrun':
      return 'text-primary';
    default:
      return 'text-on-surf';
  }
};

interface LiveFeedProps {
  attacks?: Attack[];
}

export default function LiveFeed({ attacks: externalAttacks }: LiveFeedProps) {
  const generatedAttacks = useLiveFeed();
  const attacks = externalAttacks ?? generatedAttacks;

  return (
    <div className="space-y-3">
      {attacks.map((attack) => (
        <div
          key={attack.id}
          className="bg-surface-200 border border-outline rounded-lg p-4 hover:bg-surface-300 transition-colors"
        >
          <div className="flex items-start justify-between mb-2">
            <span className={`font-mono text-sm font-semibold ${getAttackColor(attack.type)}`}>
              {attack.type}
            </span>
            <span className="font-mono text-xs text-muted">
              {attack.time}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted">Victim:</span>
              <code className="font-mono text-xs text-on-surf bg-surface-400 px-2 py-0.5 rounded">
                {attack.victim.slice(0, 10)}...{attack.victim.slice(-8)}
              </code>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted">Attacker:</span>
              <code className="font-mono text-xs text-on-surf bg-surface-400 px-2 py-0.5 rounded">
                {attack.attacker.slice(0, 10)}...{attack.attacker.slice(-8)}
              </code>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="font-mono text-xs text-muted">Amount:</span>
              <span className="font-mono text-sm font-semibold text-primary">
                {attack.amount}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
