import { resolveAllowedOrigins } from './cors';

describe('resolveAllowedOrigins', () => {
  const ORIG = process.env.ALLOWED_ORIGINS;
  const ORIG_NODE_ENV = process.env.NODE_ENV;

  afterEach(() => {
    if (ORIG === undefined) delete process.env.ALLOWED_ORIGINS;
    else process.env.ALLOWED_ORIGINS = ORIG;
    if (ORIG_NODE_ENV === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = ORIG_NODE_ENV;
  });

  it('returns "*" when env unset (dev convenience)', () => {
    delete process.env.ALLOWED_ORIGINS;
    process.env.NODE_ENV = 'development';
    expect(resolveAllowedOrigins()).toBe('*');
  });

  it('parses single origin', () => {
    process.env.ALLOWED_ORIGINS = 'https://vigil.app';
    expect(resolveAllowedOrigins()).toEqual(['https://vigil.app']);
  });

  it('parses comma-separated list and trims whitespace', () => {
    process.env.ALLOWED_ORIGINS = 'https://vigil.app,  https://staging.vigil.app  ,https://demo.vigil.app';
    expect(resolveAllowedOrigins()).toEqual([
      'https://vigil.app',
      'https://staging.vigil.app',
      'https://demo.vigil.app',
    ]);
  });

  it('drops empty entries from trailing/duplicate commas', () => {
    process.env.ALLOWED_ORIGINS = 'https://a.com,,https://b.com,';
    expect(resolveAllowedOrigins()).toEqual(['https://a.com', 'https://b.com']);
  });

  it('warns when prod is missing the env (still returns "*")', () => {
    delete process.env.ALLOWED_ORIGINS;
    process.env.NODE_ENV = 'production';
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(resolveAllowedOrigins()).toBe('*');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('ALLOWED_ORIGINS is not set in production'),
    );

    warnSpy.mockRestore();
  });
});
