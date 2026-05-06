import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CounterfactualPanel from '../CounterfactualPanel';
import type {
  ReplayTrace,
  AmmReplayData,
  WhirlpoolReplayData,
  DlmmReplayData,
} from '@/lib/types';

const AMM_DATA: AmmReplayData = {
  reservesPre:        [1_000_000, 200_000],
  reservesPostFront:  [1_010_000, 198_020],
  reservesPostVictim: [1_015_000, 197_040],
  reservesPostBack:   [1_005_000, 199_010],
  spotPricePre:        0.200000,
  spotPricePostFront:  0.196059,
  counterfactualVictimOut: 102.5,
  actualVictimOut:         98.2,
  feeNum: 30,
  feeDen: 10_000,
};

const WHIRLPOOL_DATA: WhirlpoolReplayData = {
  sqrtPricePre:        '12345678901234567890',
  sqrtPricePostFront:  '12300000000000000000',
  sqrtPricePostVictim: '12250000000000000000',
  sqrtPricePostBack:   '12290000000000000000',
  liquidityPre:        '99999999999999999999',
  liquidityPostFront:  '99999999999999999999',
  liquidityPostVictim: '99999999999999999999',
  liquidityPostBack:   '99999999999999999999',
  tickCurrentPre:        12000,
  tickCurrentPostFront:  11990,
  tickCurrentPostVictim: 11985,
  tickCurrentPostBack:   11992,
  counterfactualVictimOut: 50.0,
  actualVictimOut:         47.3,
  feeNum: 30,
  feeDen: 10_000,
};

const DLMM_DATA: DlmmReplayData = {
  activeIdPre:        8388608,
  activeIdPostFront:  8388610,
  activeIdPostVictim: 8388612,
  activeIdPostBack:   8388609,
  binPricePre: '1099999999',
  counterfactualVictimOut: 12.0,
  actualVictimOut:         11.4,
  binStep: 25,
  feeNum: 30,
  feeDen: 10_000,
  volatilityAccumulatorPre:        100,
  volatilityAccumulatorPostFront:  150,
  variableFeeRatePre:        20,
  variableFeeRatePostFront:  35,
  tokenXTransferFeeBps: null,
  tokenYTransferFeeBps: null,
};

describe('CounterfactualPanel', () => {
  it('renders nothing when trace is null', () => {
    const { container } = render(<CounterfactualPanel trace={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the toggle for amm trace', () => {
    const trace: ReplayTrace = { kind: 'amm', data: AMM_DATA };
    render(<CounterfactualPanel trace={trace} />);
    expect(screen.getByText(/Counterfactual replay/)).toBeInTheDocument();
    expect(screen.getByText(/Constant-product AMM/)).toBeInTheDocument();
  });

  it('expands to show extracted amount when toggled', () => {
    const trace: ReplayTrace = { kind: 'amm', data: AMM_DATA };
    render(<CounterfactualPanel trace={trace} />);

    const button = screen.getByRole('button', { name: /Counterfactual replay/ });
    fireEvent.click(button);

    expect(screen.getByText('Sandwich extracted')).toBeInTheDocument();
    // counterfactual 102.5 - actual 98.2 = 4.3 (formatAmount → '4.3000')
    expect(screen.getByText('4.3000')).toBeInTheDocument();
    expect(screen.getByText('Pool reserves')).toBeInTheDocument();
  });

  it('renders whirlpool detail with tick progression', () => {
    const trace: ReplayTrace = { kind: 'whirlpool', data: WHIRLPOOL_DATA };
    render(<CounterfactualPanel trace={trace} />);
    fireEvent.click(screen.getByRole('button', { name: /Counterfactual replay/ }));

    expect(screen.getByText(/12000 → 11990 → 11985 → 11992/)).toBeInTheDocument();
    expect(screen.getByText(/Orca Whirlpool/)).toBeInTheDocument();
  });

  it('renders dlmm detail with active id progression', () => {
    const trace: ReplayTrace = { kind: 'dlmm', data: DLMM_DATA };
    render(<CounterfactualPanel trace={trace} />);
    fireEvent.click(screen.getByRole('button', { name: /Counterfactual replay/ }));

    expect(screen.getByText(/8388608 → 8388610 → 8388612 → 8388609/)).toBeInTheDocument();
    expect(screen.getByText(/Meteora DLMM/)).toBeInTheDocument();
  });

  it('clamps negative extracted amount to zero', () => {
    const trace: ReplayTrace = {
      kind: 'amm',
      data: { ...AMM_DATA, counterfactualVictimOut: 50, actualVictimOut: 60 },
    };
    render(<CounterfactualPanel trace={trace} />);
    fireEvent.click(screen.getByRole('button', { name: /Counterfactual replay/ }));

    // Math.max(0, 50 - 60) = 0 → formatAmount(0) → '0.000000'
    expect(screen.getByText('0.000000')).toBeInTheDocument();
  });
});
