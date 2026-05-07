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

const POLL_MS = 10_000;

export function useLiveAttacks(maxItems = 20): MevAttack[] {
  const [attacks, setAttacks] = useState<MevAttack[]>([]);

  useEffect(() => {
    let alive = true;

    const fetchFresh = () => {
      getLiveFeed(maxItems)
        .then((data) => {
          if (!alive) return;
          setAttacks((prev) => {
            // Merge: keep any WS-pushed items not present in the fresh batch
            // (they may have arrived between polls), then add the fresh batch
            // and sort by timestamp.
            const seen = new Set(data.map((a) => a.signature));
            const wsOnly = prev.filter((a) => !seen.has(a.signature));
            return [...wsOnly, ...data]
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, maxItems);
          });
        })
        .catch(() => {
          /* WS may compensate; otherwise next poll retries. */
        });
    };

    fetchFresh();
    const pollId = window.setInterval(fetchFresh, POLL_MS);

    const wsBase = getWsBase();
    if (!wsBase) {
      return () => {
        alive = false;
        window.clearInterval(pollId);
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
      window.clearInterval(pollId);
      socket.disconnect();
    };
  }, [maxItems]);

  return attacks;
}
