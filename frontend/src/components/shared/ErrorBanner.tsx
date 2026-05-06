interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="bg-error/10 border border-error/40 text-error rounded-lg px-4 py-3 mb-6 flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-2 text-sm">
        <span className="material-symbols-outlined text-base" aria-hidden="true">
          error
        </span>
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-xs font-mono px-3 py-1 rounded-md border border-error/50 hover:bg-error/20 transition"
        >
          Retry
        </button>
      )}
    </div>
  );
}
