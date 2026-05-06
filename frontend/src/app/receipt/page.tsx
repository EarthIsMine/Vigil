'use client';

import ReceiptSearchForm from '@/components/receipt/ReceiptSearchForm';
import ReceiptResultsHeader from '@/components/receipt/ReceiptResultsHeader';
import ReceiptSummaryCards from '@/components/receipt/ReceiptSummaryCards';
import TransactionTable from '@/components/receipt/TransactionTable';
import ReceiptDetailCard from '@/components/receipt/ReceiptDetailCard';
import ReceiptBottomCta from '@/components/receipt/ReceiptBottomCta';
import ErrorBanner from '@/components/shared/ErrorBanner';
import { useReceiptSearch } from '@/hooks/useReceiptSearch';

export default function ReceiptPage() {
  const search = useReceiptSearch();

  return (
    <div className="min-h-screen bg-vigil-bg text-white">
      <main className="pt-14">
        {!search.showResults ? (
          <ReceiptSearchForm
            query={search.query}
            loading={search.loading}
            range={search.range}
            onQueryChange={search.setQuery}
            onRangeChange={search.setRange}
            onAnalyze={search.handleAnalyze}
          />
        ) : (
          <div className="min-h-[calc(100vh-3.5rem)]">
            <ReceiptResultsHeader query={search.query} onBack={search.goBack} />
            <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 max-w-7xl mx-auto">
              <div className="flex-1 min-w-0 space-y-6">
                {search.error && (
                  <ErrorBanner message={search.error} onRetry={search.handleAnalyze} />
                )}
                {search.result && <ReceiptSummaryCards result={search.result} />}
                {search.result && <TransactionTable receipts={search.result.receipts} />}
                <ReceiptBottomCta />
              </div>
              <ReceiptDetailCard
                result={search.result}
                featuredReceipt={search.featuredReceipt}
                featuredSandwich={search.featuredSandwich}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
