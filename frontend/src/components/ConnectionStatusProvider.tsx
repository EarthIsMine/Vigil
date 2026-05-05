'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { subscribeConnectionSource, type ConnectionSource } from '@/lib/api';

export type ConnectionStatus = 'live' | 'mock' | 'offline';

const LIVE_TTL_MS = 60_000;
const RECOMPUTE_INTERVAL_MS = 5_000;

interface ConnectionStatusValue {
  status: ConnectionStatus;
}

const ConnectionStatusContext = createContext<ConnectionStatusValue>({ status: 'offline' });

export function useConnectionStatus(): ConnectionStatus {
  return useContext(ConnectionStatusContext).status;
}

interface ConnectionStatusProviderProps {
  children: ReactNode;
}

export default function ConnectionStatusProvider({ children }: ConnectionStatusProviderProps) {
  const lastLiveTsRef = useRef(0);
  const lastSourceRef = useRef<ConnectionSource | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('offline');

  const recompute = useCallback(() => {
    const now = Date.now();
    const lastLiveTs = lastLiveTsRef.current;
    const lastSource = lastSourceRef.current;

    if (lastLiveTs > 0 && now - lastLiveTs < LIVE_TTL_MS) {
      setStatus('live');
    } else if (lastSource !== null) {
      setStatus('mock');
    } else {
      setStatus('offline');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeConnectionSource((source) => {
      lastSourceRef.current = source;
      if (source === 'live') {
        lastLiveTsRef.current = Date.now();
      }
      recompute();
    });

    const interval = window.setInterval(recompute, RECOMPUTE_INTERVAL_MS);

    return () => {
      unsubscribe();
      window.clearInterval(interval);
    };
  }, [recompute]);

  return (
    <ConnectionStatusContext.Provider value={{ status }}>
      {children}
    </ConnectionStatusContext.Provider>
  );
}
