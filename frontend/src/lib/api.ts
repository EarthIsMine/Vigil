/**
 * Base API client.
 * Reads NEXT_PUBLIC_API_URL from env. Falls back to mock data when
 * the backend is unreachable or returns a non-2xx response.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';
const TIMEOUT_MS = 4000;

export const IS_MOCK = !API_BASE;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/**
 * apiFetch — wraps fetch with timeout + error normalisation.
 * Throws ApiError on non-2xx or timeout so service layer can catch and fallback.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE) {
    throw new ApiError(0, 'No API_URL configured — using mock data');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      cache: 'no-store',
      ...init,
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new ApiError(res.status, `API ${res.status}: ${path}`);
    }

    return res.json() as Promise<T>;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    // AbortError or network failure
    throw new ApiError(0, `Network error: ${path}`);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * withFallback — wraps a service call so mock is returned on any failure.
 * Pass `label` for a console.warn in dev so you know when mock kicks in.
 */
export async function withFallback<T>(
  label: string,
  fetcher: () => Promise<T>,
  mock: T,
): Promise<T> {
  try {
    return await fetcher();
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[Vigil] ${label} — using mock data (${msg})`);
    }
    return mock;
  }
}
