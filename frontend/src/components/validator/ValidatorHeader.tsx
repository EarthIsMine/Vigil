import type { ValidatorDetail } from '@/lib/types';
import CopyAddressButton from '@/components/shared/CopyAddressButton';

interface ValidatorHeaderProps {
  validator: ValidatorDetail | null;
  riskColor: string;
}

const RISK_LABEL: Record<string, string> = {
  critical: 'Critical risk',
  high: 'High risk',
  medium: 'Medium risk',
  low: 'Low risk',
  unrated: 'Unrated',
};

export default function ValidatorHeader({ validator, riskColor }: ValidatorHeaderProps) {
  if (validator === null) {
    return (
      <div className="mb-12 fade-up fade-up-d1 animate-pulse">
        <div className="h-12 w-80 bg-white/5 rounded mb-4" />
        <div className="h-5 w-60 bg-white/5 rounded" />
      </div>
    );
  }

  const riskLabel = RISK_LABEL[validator.riskLevel] ?? validator.riskLevel;

  return (
    <header className="mb-12 fade-up fade-up-d1">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6">
        <div className="min-w-0">
          <p
            className="text-sm text-vigil-muted mb-2 font-mono inline-flex items-center gap-1.5"
            title={validator.identity}
          >
            <span>
              {validator.identity.slice(0, 8)}…{validator.identity.slice(-4)}
            </span>
            <CopyAddressButton address={validator.identity} iconClassName="text-xs" />
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-white truncate">
            {validator.name}
          </h1>
        </div>

        <div className="flex items-baseline gap-4 shrink-0">
          <div className="text-right">
            <p className="text-xs text-vigil-muted mb-1">Risk score</p>
            <p
              className="font-display font-bold text-5xl tabular-nums"
              style={{ color: riskColor }}
            >
              {validator.riskScore}
            </p>
          </div>
          <span
            className="text-sm font-medium pb-2"
            style={{ color: riskColor }}
          >
            {riskLabel}
          </span>
        </div>
      </div>

      <dl className="flex flex-wrap items-baseline gap-x-8 gap-y-2 text-sm text-vigil-muted border-t border-vigil-border pt-5">
        <Datum label="Stake" value={validator.stake} />
        <Datum label="Client" value={validator.client} />
        <Datum label="Commission" value={`${validator.commission}%`} />
        <Datum label="Active since" value={`Epoch ${validator.activeSinceEpoch}`} />
        {validator.voteAccount && (
          <div className="flex items-baseline gap-2">
            <dt>Vote account</dt>
            <dd className="text-white font-mono inline-flex items-center gap-1.5" title={validator.voteAccount}>
              <span>
                {validator.voteAccount.slice(0, 8)}…{validator.voteAccount.slice(-4)}
              </span>
              <CopyAddressButton address={validator.voteAccount} iconClassName="text-xs" />
            </dd>
          </div>
        )}
      </dl>
    </header>
  );
}

function Datum({
  label,
  value,
  mono = false,
  title,
}: {
  label: string;
  value: string;
  mono?: boolean;
  title?: string;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <dt>{label}</dt>
      <dd className={`text-white ${mono ? 'font-mono' : 'font-medium'}`} title={title}>
        {value}
      </dd>
    </div>
  );
}
