'use client';

import { useState, useEffect } from 'react';

type AttackType = 'Sandwich' | 'Frontrun' | 'Protected' | 'Backrun';

interface Attack {
  id: string;
  type: AttackType;
  victim: string;
  attacker: string;
  amount: string;
  time: string;
}

const attackTypes: AttackType[] = ['Sandwich', 'Frontrun', 'Protected', 'Backrun'];

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

const BASE58_CHARS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

const generateSolanaAddress = () => {
  const len = 32 + Math.floor(Math.random() * 12);
  return Array.from({ length: len }, () =>
    BASE58_CHARS[Math.floor(Math.random() * BASE58_CHARS.length)]
  ).join('');
};

const generateRandomAttack = (): Attack => {
  const type = attackTypes[Math.floor(Math.random() * attackTypes.length)];
  const amount = (Math.random() * 8 + 0.05).toFixed(3);
  const now = new Date();

  return {
    id: Date.now().toString() + Math.random(),
    type,
    victim: generateSolanaAddress(),
    attacker: generateSolanaAddress(),
    amount: amount + ' SOL',
    time: now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
  };
};

export default function LiveFeed() {
  const [attacks, setAttacks] = useState<Attack[]>([]);

  useEffect(() => {
    // Initialize with some attacks
    const initialAttacks = Array.from({ length: 5 }, () => generateRandomAttack());
    setAttacks(initialAttacks);

    // Add new attack every 5 seconds
    const interval = setInterval(() => {
      setAttacks((prev) => {
        const newAttack = generateRandomAttack();
        const updated = [newAttack, ...prev];
        return updated.slice(0, 20); // Keep max 20 items
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
