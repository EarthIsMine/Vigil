'use client';

import { useState, useEffect } from 'react';

export type AttackType = 'Sandwich' | 'Frontrun' | 'Protected' | 'Backrun';

export interface Attack {
  id: string;
  type: AttackType;
  victim: string;
  attacker: string;
  amount: string;
  time: string;
}

const ATTACK_TYPES: AttackType[] = ['Sandwich', 'Frontrun', 'Protected', 'Backrun'];
const BASE58_CHARS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function generateSolanaAddress(): string {
  const len = 32 + Math.floor(Math.random() * 12);
  return Array.from({ length: len }, () =>
    BASE58_CHARS[Math.floor(Math.random() * BASE58_CHARS.length)]
  ).join('');
}

function generateRandomAttack(): Attack {
  const type = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];
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
      second: '2-digit',
    }),
  };
}

function createInitialAttacks(): Attack[] {
  return Array.from({ length: 5 }, () => generateRandomAttack());
}

export function useLiveFeed(intervalMs = 5000, maxItems = 20): Attack[] {
  const [attacks, setAttacks] = useState<Attack[]>([]);

  useEffect(() => {
    setAttacks(createInitialAttacks());

    const interval = setInterval(() => {
      setAttacks((prev) => {
        const newAttack = generateRandomAttack();
        const updated = [newAttack, ...prev];
        return updated.slice(0, maxItems);
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, maxItems]);

  return attacks;
}
