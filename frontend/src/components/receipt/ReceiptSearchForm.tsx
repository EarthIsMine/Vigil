import type { ReceiptRange } from '@/hooks/useReceiptSearch';

interface ReceiptSearchFormProps {
  query: string;
  loading: boolean;
  range: ReceiptRange;
  onQueryChange: (q: string) => void;
  onRangeChange: (r: ReceiptRange) => void;
  onAnalyze: () => void;
}

const RANGE_OPTIONS: { value: ReceiptRange; label: string }[] = [
  { value: '24h', label: 'Last 24h' },
  { value: '7d',  label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'all', label: 'All time' },
];

export default function ReceiptSearchForm({
  query,
  loading,
  range,
  onQueryChange,
  onRangeChange,
  onAnalyze,
}: ReceiptSearchFormProps) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center space-y-8 fade-up">
        <div className="flex justify-center mb-6 fade-up fade-up-d1">
          <div className="relative">
            <div className="absolute inset-0 bg-vigil-accent/20 blur-3xl rounded-full"></div>
            <div className="relative w-20 h-20 rounded-full bg-vigil-card-dark border-2 border-vigil-accent flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-vigil-accent">radar</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 fade-up fade-up-d2">
          <h1 className="font-display font-bold text-5xl tracking-tight">TRACE YOUR IMPACT</h1>
          <p className="text-lg text-vigil-muted">
            Enter a wallet address or transaction hash to analyze MEV extraction and generate your receipt
          </p>
        </div>

        <div className="space-y-4 fade-up fade-up-d3">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAnalyze()}
              placeholder="7xKp...mN4q or full transaction hash"
              className="w-full px-6 py-4 bg-vigil-card-dark border-2 border-vigil-border-dark rounded-xl text-white placeholder:text-vigil-muted focus:outline-none focus:border-vigil-accent glow-blue transition font-mono text-sm"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex items-center gap-3 px-4 py-3 bg-vigil-card-dark border-2 border-vigil-border-dark rounded-xl text-sm text-vigil-muted">
              <span className="material-symbols-outlined text-base" aria-hidden="true">schedule</span>
              <span className="hidden sm:inline">Range</span>
              <select
                value={range}
                onChange={(e) => onRangeChange(e.target.value as ReceiptRange)}
                className="bg-transparent text-white font-mono focus:outline-none cursor-pointer"
                aria-label="Time range"
              >
                {RANGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-vigil-card-dark">
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={onAnalyze}
              disabled={loading || !query.trim()}
              className="flex-1 py-4 bg-vigil-accent hover:bg-vigil-accent/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-display font-semibold text-white glow-blue-btn transition flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ANALYZING...
                </>
              ) : 'ANALYZE'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 pt-8 fade-up fade-up-d4">
          <div className="flex items-center gap-2 px-3 py-2 bg-vigil-card-dark/50 border border-vigil-border-dark rounded-lg">
            <span className="w-2 h-2 rounded-full bg-accent-green pulse-dot"></span>
            <span className="text-xs font-mono text-vigil-muted">Solana Mainnet</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-vigil-card-dark/50 border border-vigil-border-dark rounded-lg">
            <span className="w-2 h-2 rounded-full bg-vigil-accent pulse-dot"></span>
            <span className="text-xs font-mono text-vigil-muted">Devnet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
