export default function ReceiptBottomCta() {
  return (
    <section className="border-t border-vigil-border pt-8 fade-up fade-up-d2">
      <div className="max-w-md">
        <h3 className="font-display font-bold text-xl text-white mb-2">
          Stop leaking value
        </h3>
        <p className="text-sm text-vigil-muted mb-5">
          Vigil RPC routes your transactions through a protected path so MEV
          can&apos;t extract from your swaps. Free tier available.
        </p>
        <a
          href="https://github.com/EarthIsMine/Vigil-RPC"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-vigil-green hover:bg-vigil-emerald text-white rounded-lg text-sm font-medium transition-colors"
        >
          Activate shield
          <span className="material-symbols-outlined text-sm" aria-hidden="true">
            open_in_new
          </span>
        </a>
      </div>
    </section>
  );
}
