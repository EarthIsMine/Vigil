interface StatCardProps {
  title: string;
  value: string | number;
  change?: { label: string; cls: string };
  subtitle?: string;
  className?: string;
}

export default function StatCard({ title, value, change, subtitle, className = '' }: StatCardProps) {
  return (
    <div className={`bg-surface-100 border border-outline rounded-lg p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-muted">{title}</h3>
        {change && (
          <span data-testid="stat-change" className={`text-xs font-mono ${change.cls}`}>
            {change.label}
          </span>
        )}
        {!change && subtitle && (
          <span className="text-xs font-mono text-muted">{subtitle}</span>
        )}
      </div>
      <p className="font-display text-3xl font-bold text-on-surf">{value}</p>
    </div>
  );
}
