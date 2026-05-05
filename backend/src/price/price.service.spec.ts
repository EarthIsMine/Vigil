import { PriceService } from './price.service';

describe('PriceService — fail-safe for SOL/USD', () => {
  const realFetch = global.fetch;

  afterEach(() => {
    global.fetch = realFetch;
  });

  it('starts with null (no boot-window $150 fallback)', () => {
    const svc = new PriceService();
    expect(svc.getSolUsd()).toBeNull();
    expect(svc.isReady()).toBe(false);
  });

  it('keeps null when CoinGecko fetch rejects', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network down')) as any;
    const svc = new PriceService();
    await (svc as any).refresh();
    expect(svc.getSolUsd()).toBeNull();
    expect(svc.isReady()).toBe(false);
  });

  it('keeps null when CoinGecko returns malformed body', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ unrelated: 'shape' }),
    }) as any;
    const svc = new PriceService();
    await (svc as any).refresh();
    expect(svc.getSolUsd()).toBeNull();
  });

  it('updates to fetched price on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ solana: { usd: 213.42 } }),
    }) as any;
    const svc = new PriceService();
    await (svc as any).refresh();
    expect(svc.getSolUsd()).toBe(213.42);
    expect(svc.isReady()).toBe(true);
  });

  it('preserves last good price when a later refresh fails (CoinGecko outage mid-session)', async () => {
    const svc = new PriceService();
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ solana: { usd: 200 } }),
    }) as any;
    await (svc as any).refresh();
    expect(svc.getSolUsd()).toBe(200);

    global.fetch = jest.fn().mockRejectedValue(new Error('outage')) as any;
    await (svc as any).refresh();
    expect(svc.getSolUsd()).toBe(200);
  });
});
