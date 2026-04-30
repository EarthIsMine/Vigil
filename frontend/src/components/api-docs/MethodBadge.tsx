const METHOD_COLORS = {
  GET: 'bg-primary-dim text-primary',
  POST: 'bg-sec-dim text-secondary',
  DELETE: 'bg-error-dim text-error',
} as const;

export default function MethodBadge({ method }: { method: keyof typeof METHOD_COLORS }) {
  return (
    <span className={`font-mono text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 ${METHOD_COLORS[method]}`}>
      {method}
    </span>
  );
}
