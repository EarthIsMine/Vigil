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
    cls: 'bg-accent-green/15 text-accent-green border-accent-green/30',
  },
  medium: {
    label: 'Likely',
    icon: 'help',
    cls: 'bg-accent-yellow/15 text-accent-yellow border-accent-yellow/30',
  },
  low: {
    label: 'Unverified',
    icon: 'visibility_off',
    cls: 'bg-vigil-muted/15 text-vigil-muted border-vigil-muted/30',
  },
};

export default function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  if (!level) return null;
  const style = LEVEL_STYLE[level];
  return (
    <span
      role="status"
      aria-label={`Detection confidence: ${style.label}`}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-mono font-semibold ${style.cls}`}
    >
      <span className="material-symbols-outlined text-sm leading-none" aria-hidden="true">
        {style.icon}
      </span>
      {style.label}
    </span>
  );
}
