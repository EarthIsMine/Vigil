import { apiFetch } from '../api';
import type { ReceiptSearchResult } from '../types';

export const searchReceipts = (
  wallet: string,
  range: '24h' | '7d' | '30d' | 'all' = '30d',
) => apiFetch<ReceiptSearchResult>(`/receipts/search?wallet=${wallet}&range=${range}`);
