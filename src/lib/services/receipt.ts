import { apiFetch, withFallback } from '../api';
import { MOCK_RECEIPT_RESULT } from '../mock';
import type { ReceiptSearchResult } from '../types';

export const searchReceipts = (wallet: string, range: '24h' | '7d' | '30d' | 'all' = '30d') =>
  withFallback(
    'searchReceipts',
    () => apiFetch<ReceiptSearchResult>(`/receipts/search?wallet=${wallet}&range=${range}`),
    MOCK_RECEIPT_RESULT,
  );
