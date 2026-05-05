import { describe, it, expect, vi } from 'vitest';
import { subscribeConnectionSource, withFallback, type ConnectionSource } from '../api';

describe('withFallback', () => {
  it('emits "live" when fetcher resolves', async () => {
    const sources: ConnectionSource[] = [];
    const unsubscribe = subscribeConnectionSource((s) => sources.push(s));

    const result = await withFallback('test', async () => 'real', 'mock');

    expect(result).toBe('real');
    expect(sources).toEqual(['live']);
    unsubscribe();
  });

  it('emits "mock" and returns mock when fetcher rejects', async () => {
    const sources: ConnectionSource[] = [];
    const unsubscribe = subscribeConnectionSource((s) => sources.push(s));
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await withFallback(
      'test',
      async () => {
        throw new Error('boom');
      },
      'mock',
    );

    expect(result).toBe('mock');
    expect(sources).toEqual(['mock']);
    unsubscribe();
    warn.mockRestore();
  });

  it('stops emitting after unsubscribe', async () => {
    const sources: ConnectionSource[] = [];
    const unsubscribe = subscribeConnectionSource((s) => sources.push(s));
    unsubscribe();

    await withFallback('test', async () => 'real', 'mock');

    expect(sources).toEqual([]);
  });
});
