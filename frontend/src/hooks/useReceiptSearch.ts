'use client';

import { useState } from 'react';
import { searchReceipts } from '@/lib/services/receipt';
import type { ReceiptSearchResult, MevReceipt, SandwichAttackDetail } from '@/lib/types';

export type ReceiptRange = '24h' | '7d' | '30d' | 'all';

export interface ReceiptSearchState {
  showResults: boolean;
  loading: boolean;
  query: string;
  range: ReceiptRange;
  result: ReceiptSearchResult | null;
  error: string | null;
  selectedReceiptId: string | null;
  featuredReceipt: MevReceipt | null;
  featuredSandwich: SandwichAttackDetail | null;
  setQuery: (q: string) => void;
  setRange: (r: ReceiptRange) => void;
  setSelectedReceiptId: (id: string | null) => void;
  handleAnalyze: () => Promise<void>;
  goBack: () => void;
}

export function useReceiptSearch(): ReceiptSearchState {
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [range, setRange] = useState<ReceiptRange>('30d');
  const [result, setResult] = useState<ReceiptSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setSelectedReceiptId(null);
    try {
      const data = await searchReceipts(query.trim(), range);
      setResult(data);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't reach the API");
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  const selected = selectedReceiptId
    ? result?.receipts.find((r) => r.receiptId === selectedReceiptId) ?? null
    : null;

  const featuredReceipt: MevReceipt | null =
    selected ??
    result?.receipts.find((r) => r.mevAnalysis.detected) ??
    result?.receipts[0] ??
    null;

  const featuredSandwich: SandwichAttackDetail | null =
    featuredReceipt?.attackDetail.kind === 'sandwich'
      ? (featuredReceipt.attackDetail as SandwichAttackDetail)
      : null;

  return {
    showResults,
    loading,
    query,
    range,
    result,
    error,
    selectedReceiptId,
    featuredReceipt,
    featuredSandwich,
    setQuery,
    setRange,
    setSelectedReceiptId,
    handleAnalyze,
    goBack: () => {
      setShowResults(false);
      setSelectedReceiptId(null);
    },
  };
}
