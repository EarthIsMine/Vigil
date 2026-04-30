'use client';

import { useState, useEffect } from 'react';
import { getValidatorDetail } from '@/lib/services/validator';
import type { ValidatorDetail } from '@/lib/types';
import { getRiskColorHex } from '@/lib/format';

export interface ValidatorDataState {
  validator: ValidatorDetail | null;
  riskColor: string;
}

export function useValidatorData(): ValidatorDataState {
  const [validator, setValidator] = useState<ValidatorDetail | null>(null);

  useEffect(() => {
    getValidatorDetail('StKHse...7Qx4p').then(setValidator);
  }, []);

  const riskColor = getRiskColorHex(validator?.riskLevel ?? '');

  return { validator, riskColor };
}
