import { apiFetch } from '../api';
import type { ReceiptSearchResult } from '../types';

export const searchReceipts = (wallet: string) =>
  apiFetch<ReceiptSearchResult>(`/receipts/search?wallet=${wallet}`);
