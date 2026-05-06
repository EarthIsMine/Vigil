import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiFetch, subscribeConnectionSource, type ConnectionSource } from '../api';

const ORIG_FETCH = globalThis.fetch;

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://example.test');
});

afterEach(() => {
  vi.unstubAllEnvs();
  globalThis.fetch = ORIG_FETCH;
});

describe('apiFetch', () => {
  it('emits "live" and returns parsed body on 2xx', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );

    const sources: ConnectionSource[] = [];
    const unsubscribe = subscribeConnectionSource((s) => sources.push(s));

    const result = await apiFetch<{ ok: boolean }>('/x');

    expect(result).toEqual({ ok: true });
    expect(sources).toContain('live');
    unsubscribe();
  });

  it('emits "offline" and throws ApiError on non-2xx', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response('', { status: 500 }));

    const sources: ConnectionSource[] = [];
    const unsubscribe = subscribeConnectionSource((s) => sources.push(s));

    await expect(apiFetch('/x')).rejects.toBeInstanceOf(ApiError);
    expect(sources).toContain('offline');
    unsubscribe();
  });

  it('emits "offline" and throws when API_BASE is empty', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');

    const sources: ConnectionSource[] = [];
    const unsubscribe = subscribeConnectionSource((s) => sources.push(s));

    await expect(apiFetch('/x')).rejects.toBeInstanceOf(ApiError);
    expect(sources).toContain('offline');
    unsubscribe();
  });

  it('stops emitting after unsubscribe', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );

    const sources: ConnectionSource[] = [];
    const unsubscribe = subscribeConnectionSource((s) => sources.push(s));
    unsubscribe();

    await apiFetch('/x');
    expect(sources).toEqual([]);
  });
});
