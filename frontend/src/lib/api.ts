/**
 * Base API client. Reads NEXT_PUBLIC_API_URL from env.
 *
 * No runtime fallback — when the backend is unreachable callers must surface
 * a loading or error state. Mock data lives only in test fixtures.
 */

const TIMEOUT_MS = 4000;

function getApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? '';
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export type ConnectionSource = 'live' | 'offline';
type ConnectionListener = (source: ConnectionSource) => void;

const connectionListeners = new Set<ConnectionListener>();

export function subscribeConnectionSource(listener: ConnectionListener): () => void {
  connectionListeners.add(listener);
  return () => {
    connectionListeners.delete(listener);
  };
}

function emitConnectionSource(source: ConnectionSource) {
  connectionListeners.forEach((listener) => {
    listener(source);
  });
}

/**
 * apiFetch — wraps fetch with timeout + error normalisation.
 * Throws ApiError on non-2xx, timeout, or missing config.
 * Emits 'live' on success and 'offline' on failure so the UI can surface
 * connection state.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const apiBase = getApiBase();
  if (!apiBase) {
    emitConnectionSource('offline');
    throw new ApiError(0, 'NEXT_PUBLIC_API_URL is not set');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${apiBase}${path}`, {
      cache: 'no-store',
      ...init,
      signal: controller.signal,
    });

    if (!res.ok) {
      emitConnectionSource('offline');
      throw new ApiError(res.status, `API ${res.status}: ${path}`);
    }

    emitConnectionSource('live');
    return res.json() as Promise<T>;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    emitConnectionSource('offline');
    throw new ApiError(0, `Network error: ${path}`);
  } finally {
    clearTimeout(timer);
  }
}
