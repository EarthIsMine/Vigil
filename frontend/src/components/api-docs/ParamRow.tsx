export default function ParamRow({
  name,
  type,
  required,
  children,
  dark,
}: {
  name: string;
  type: string;
  required?: boolean;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className={`px-5 py-4 ${dark ? 'bg-surface' : 'bg-surface-100'}`}>
      <div className="flex items-center gap-2 mb-1">
        <code className="font-mono text-sm text-on-surf">{name}</code>
        {required ? (
          <span className="font-mono text-[10px] uppercase tracking-wider text-secondary font-semibold">required</span>
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-semibold">optional</span>
        )}
        <span className="font-mono text-[10px] text-muted">{type}</span>
      </div>
      <div className="text-xs text-muted leading-relaxed">{children}</div>
    </div>
  );
}
