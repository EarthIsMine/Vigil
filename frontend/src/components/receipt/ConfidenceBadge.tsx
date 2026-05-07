import type { ConfidenceLevel } from '@/lib/types';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel | null | undefined;
}

const LEVEL_STYLE: Record<
  ConfidenceLevel,
  { label: string; icon: string; cls: string }
> = {
  high: {
    label: 'Verified',
    icon: 'check_circle',
    cls: 'text-vigil-green',
  },
  medium: {
    label: 'Likely',
    icon: 'help',
    cls: 'text-warning',
  },
  low: {
    label: 'Unverified',
    icon: 'visibility_off',
    cls: 'text-vigil-muted',
  },
};

export default function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  if (!level) return null;
  const style = LEVEL_STYLE[level];
  return (
    <span
      role="status"
      aria-label={`Detection confidence: ${style.label}`}
      className={`inline-flex items-center gap-1 text-xs font-mono ${style.cls}`}
    >
      <span
        className="material-symbols-outlined text-sm leading-none"
        aria-hidden="true"
      >
        {style.icon}
      </span>
      {style.label}
    </span>
  );
}
