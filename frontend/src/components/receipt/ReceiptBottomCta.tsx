export default function ReceiptBottomCta() {
  return (
    <div className="relative receipt-card p-8 rounded-xl border border-vigil-red/30 overflow-hidden fade-up fade-up-d2">
      <div className="absolute inset-0 scan-line pointer-events-none"></div>
      <div className="relative z-10 text-center space-y-4">
        <h3 className="font-display font-bold text-2xl text-white">STOP LEAKING VALUE</h3>
        <p className="text-vigil-muted max-w-md mx-auto">
          You&apos;re losing money to MEV attacks. Activate protection to shield your transactions.
        </p>
        <button className="px-8 py-3 bg-accent-green hover:bg-accent-green/90 rounded-xl font-display font-semibold text-white transition">
          ACTIVATE SHIELD
        </button>
      </div>
    </div>
  );
}
