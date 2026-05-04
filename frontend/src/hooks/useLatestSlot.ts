'use client';

import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';
const POLL_INTERVAL = 5_000;

export function useLatestSlot(): number | null {
  const [slot, setSlot] = useState<number | null>(null);

  useEffect(() => {
    if (!API_BASE) return;

    let cancelled = false;

    async function fetchSlot() {
      try {
        const res = await fetch(`${API_BASE}/attacks/recent?limit=1`, {
          cache: 'no-store',
        });
        if (!res.ok) return;
        const attacks = await res.json();
        if (!cancelled && attacks.length > 0) {
          setSlot(attacks[0].slot);
        }
      } catch {
        // ignore
      }
    }

    fetchSlot();
    const id = setInterval(fetchSlot, POLL_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return slot;
}
