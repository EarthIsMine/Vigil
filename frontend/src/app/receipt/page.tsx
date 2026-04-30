'use client';

import IconSidebar from '@/components/shared/IconSidebar';
import ReceiptSearchForm from '@/components/receipt/ReceiptSearchForm';
import ReceiptResultsHeader from '@/components/receipt/ReceiptResultsHeader';
import ReceiptSummaryCards from '@/components/receipt/ReceiptSummaryCards';
import TransactionTable from '@/components/receipt/TransactionTable';
import ReceiptDetailCard from '@/components/receipt/ReceiptDetailCard';
import ReceiptBottomCta from '@/components/receipt/ReceiptBottomCta';
import { useReceiptSearch } from '@/hooks/useReceiptSearch';

export default function ReceiptPage() {
  const search = useReceiptSearch();

  return (
    <div className="min-h-screen bg-vigil-bg text-white">
      <IconSidebar activePath="/receipt" />
      <main className="ml-16 pt-14">
        {!search.showResults ? (
          <ReceiptSearchForm
            query={search.query}
            loading={search.loading}
            onQueryChange={search.setQuery}
            onAnalyze={search.handleAnalyze}
          />
        ) : (
          <div className="min-h-[calc(100vh-3.5rem)]">
            <ReceiptResultsHeader query={search.query} onBack={search.goBack} />
            <div className="flex gap-6 p-6 max-w-7xl mx-auto">
              <div className="flex-1 space-y-6">
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
