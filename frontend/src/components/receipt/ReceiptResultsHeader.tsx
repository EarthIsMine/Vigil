interface ReceiptResultsHeaderProps {
  query: string;
  onBack: () => void;
}

export default function ReceiptResultsHeader({ query, onBack }: ReceiptResultsHeaderProps) {
  return (
    <div className="sticky top-14 z-30 bg-vigil-bg/80 backdrop-blur-xl border-b border-vigil-border-dark px-6 py-4">
      <div className="flex items-center gap-4 max-w-7xl mx-auto">
        <button onClick={onBack} className="p-2 hover:bg-vigil-card-dark rounded-lg transition">
          <span className="material-symbols-outlined text-xl text-vigil-muted">arrow_back</span>
        </button>
        <div className="flex-1 sm:max-w-md">
          <input
            type="text"
            value={query}
            readOnly
            className="w-full px-4 py-2 bg-vigil-card-dark border border-vigil-border-dark rounded-lg text-white font-mono text-sm focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
