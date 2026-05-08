/**
 * Base API client. Reads NEXT_PUBLIC_API_URL from env.
 *
 * No runtime fallback — when the backend is unreachable callers must surface
 * a loading or error state. Mock data lives only in test fixtures.
 */

const TIMEOUT_MS = 4000;

function getApiBase(): string {
  // Server fetches prefer INTERNAL_API_URL (e.g. http://backend:3001/api/v1) to
  // skip the public Cloudflare → nginx → backend round-trip. Client falls back
  // to NEXT_PUBLIC_API_URL because the browser can't resolve docker hostnames.
  if (typeof window === 'undefined') {
    return (
      process.env.INTERNAL_API_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      ''
    );
  }
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

export function emitConnectionSource(source: ConnectionSource) {
  connectionListeners.forEach((listener) => {
    listener(source);
  });
}

export interface ApiFetchOpts {
  /** Server-side ISR window in seconds. Omit on the client. */
  revalidate?: number;
}

/**
 * apiFetch — wraps fetch with timeout + error normalisation.
 * Throws ApiError on non-2xx, timeout, or missing config.
 * Emits 'live' on success and 'offline' on failure so the UI can surface
 * connection state. Pass `opts.revalidate` from RSC to enable Next fetch cache.
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  opts?: ApiFetchOpts,
): Promise<T> {
  const apiBase = getApiBase();
  if (!apiBase) {
    emitConnectionSource('offline');
    throw new ApiError(0, 'NEXT_PUBLIC_API_URL is not set');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const fetchInit: RequestInit = { ...init, signal: controller.signal };
  if (opts?.revalidate !== undefined) {
    (fetchInit as RequestInit & { next: { revalidate: number } }).next = {
      revalidate: opts.revalidate,
    };
  } else if (!init?.cache) {
    fetchInit.cache = 'no-store';
  }

  try {
    const res = await fetch(`${apiBase}${path}`, fetchInit);

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
