import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EvidencePanel from '../EvidencePanel';

describe('EvidencePanel', () => {
  it('hides body until toggle is clicked', () => {
    render(
      <EvidencePanel
        detectionMethod="header"
        bundleProvenance="atomic"
        lossSource="amm_replay"
      />,
    );
    expect(screen.queryByText('Adjacent slot header')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /why we flagged this/i }));
    expect(screen.getByText('Adjacent slot header')).toBeInTheDocument();
    expect(screen.getByText('Atomic bundle')).toBeInTheDocument();
    expect(screen.getByText('Counterfactual replay (precise)')).toBeInTheDocument();
  });

  it('labels CLOB unenriched explicitly when lossSource is unenriched', () => {
    render(
      <EvidencePanel
        detectionMethod="header"
        bundleProvenance="organic"
        lossSource="unenriched"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /why we flagged this/i }));
    expect(screen.getByText(/CLOB attack — loss not estimated/)).toBeInTheDocument();
  });

  it('renders nothing when no fields are provided', () => {
    const { container } = render(
      <EvidencePanel
        detectionMethod={null}
        bundleProvenance={null}
        lossSource={null}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('omits sections that are missing', () => {
    render(
      <EvidencePanel
        detectionMethod="cross_slot_window"
        bundleProvenance={null}
        lossSource={null}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /why we flagged this/i }));
    expect(screen.getByText('Cross-slot window match')).toBeInTheDocument();
    expect(screen.queryByText('Bundle')).not.toBeInTheDocument();
    expect(screen.queryByText('Loss source')).not.toBeInTheDocument();
  });
});
