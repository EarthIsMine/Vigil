/**
 * Resolve allowed CORS origins from `ALLOWED_ORIGINS` env (comma-separated).
 * - Production-style: `https://vigil.app,https://staging.vigil.app`
 * - Dev fallback: returns `'*'` so local FE on any port works without config,
 *   but logs a warning so misconfigured prod doesn't silently allow all.
 */
export function resolveAllowedOrigins(): string | string[] {
  const raw = process.env.ALLOWED_ORIGINS?.trim();
  if (!raw) {
    if (process.env.NODE_ENV === 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        '[Vigil] ALLOWED_ORIGINS is not set in production — falling back to "*" which lets any origin connect. Set it explicitly.',
      );
    }
    return '*';
  }
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}
