import { apiFetch, withFallback } from '../api';
import { MOCK_VALIDATOR_DETAIL } from '../mock';
import type { ValidatorDetail } from '../types';

export const getValidatorDetail = (identity: string) =>
  withFallback(
    'getValidatorDetail',
    () => apiFetch<ValidatorDetail>(`/validators/${identity}`),
    MOCK_VALIDATOR_DETAIL,
  );
