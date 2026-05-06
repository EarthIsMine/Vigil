'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { MevAttack } from '@/lib/types';
import { emitConnectionSource } from '@/lib/api';
import { getLiveFeed } from '@/lib/services/dashboard';

/**
 * Live feed of recent attacks.
 *
 * Initial render loads the last `maxItems` via REST so the page has data even
 * before the WS handshake completes. The WS subscription to the `/events`
 * namespace then prepends any newly-detected attack the BE broadcasts via
 * `EventsGateway.broadcastAttack`.
 *
 * Connection state side-effects flow through `emitConnectionSource` so the
 * shared `ConnectionStatusProvider` reflects WS up/down without needing
 * additional HTTP probes.
 */
function getWsBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/api\/v[0-9]+\/?$/, '');
}

export function useLiveAttacks(maxItems = 20): MevAttack[] {
  const [attacks, setAttacks] = useState<MevAttack[]>([]);

  useEffect(() => {
    let alive = true;

    getLiveFeed(maxItems)
      .then((data) => {
        if (alive) setAttacks(data.slice(0, maxItems));
      })
      .catch(() => {
        // WS will populate when connected; leave empty on REST failure.
      });

    const wsBase = getWsBase();
    if (!wsBase) {
      return () => {
        alive = false;
      };
    }

    const socket = io(`${wsBase}/events`, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 2_000,
    });

    socket.on('connect', () => emitConnectionSource('live'));
    socket.on('disconnect', () => emitConnectionSource('offline'));
    socket.on('connect_error', () => emitConnectionSource('offline'));
    socket.on('new_attack', (attack: MevAttack) => {
      setAttacks((prev) => {
        if (prev.some((a) => a.signature === attack.signature)) return prev;
        return [attack, ...prev].slice(0, maxItems);
      });
    });

    return () => {
      alive = false;
      socket.disconnect();
    };
  }, [maxItems]);

  return attacks;
}
