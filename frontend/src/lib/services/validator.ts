import { apiFetch, type ApiFetchOpts } from '../api';
import type { ValidatorDetail } from '../types';

export const getValidatorDetail = (identity: string, opts?: ApiFetchOpts) =>
  apiFetch<ValidatorDetail>(
    `/validators/${encodeURIComponent(identity)}`,
    undefined,
    opts,
  );
