import { apiFetch } from '../api';
import type { ValidatorDetail } from '../types';

export const getValidatorDetail = (identity: string) =>
  apiFetch<ValidatorDetail>(`/validators/${encodeURIComponent(identity)}`);
