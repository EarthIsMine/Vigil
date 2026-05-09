'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { MevAttack } from '@/lib/types';
import { emitConnectionSource } from '@/lib/api';
import { getLiveFeed } from '@/lib/services/dashboard';

/**
 * Live feed of recent attacks.
 *
 * `initialAttacks` (optional) seeds state so RSC-prefetched data shows on the
 * first paint without a flash of empty list. The WS subscription to the
 * `/events` namespace then prepends any newly-detected attack the BE
 * broadcasts via `EventsGateway.broadcastAttack`. A 10s REST poll runs as a
 * backup in case the WS drops without firing `disconnect`.
 *
 * Connection state side-effects flow through `emitConnectionSource` so the
 * shared `ConnectionStatusProvider` reflects WS up/down without needing
 * additional HTTP probes.
 */
function getWsBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/api\/v[0-9]+\/?$/, '');
}

const POLL_MS = 10_000;

export function useLiveAttacks(
  maxItems = 20,
  initialAttacks: MevAttack[] = [],
): MevAttack[] {
  const [attacks, setAttacks] = useState<MevAttack[]>(initialAttacks.slice(0, maxItems));

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
      socket.removeAllListeners();
      // Avoid the "WebSocket is closed before the connection is established"
      // browser warning by waiting for the handshake to finish before tearing
      // it down. If already connected, disconnect immediately.
      if (socket.connected) {
        socket.disconnect();
      } else {
        socket.once('connect', () => socket.disconnect());
      }
    };
  }, [maxItems]);

  return attacks;
}
