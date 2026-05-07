import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DocsSidebar from '../DocsSidebar';
import { DocsProvider } from '@/app/api-docs/DocsContext';

function renderWithProvider(ui: React.ReactElement, override?: Partial<{
  searchQuery: string;
  activeTab: 'documentation' | 'api-reference';
  activeDocPage: string;
  activeApiPage: string;
  lang: 'en' | 'ko';
}>) {
  const value = {
    lang: override?.lang ?? ('en' as const),
    setLang: () => {},
    theme: 'dark' as const,
    toggleTheme: () => {},
    searchQuery: override?.searchQuery ?? '',
    setSearchQuery: () => {},
    activeTab: override?.activeTab ?? ('api-reference' as const),
    setActiveTab: () => {},
    activeDocPage: override?.activeDocPage ?? 'gettingStarted:overview',
    setActiveDocPage: () => {},
    activeApiPage: override?.activeApiPage ?? 'introduction',
    setActiveApiPage: () => {},
  };
  return render(<DocsProvider value={value}>{ui}</DocsProvider>);
}

describe('DocsSidebar — API Reference tab', () => {
  it('renders all API navigation groups', () => {
    renderWithProvider(<DocsSidebar />);
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Core API')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('renders all API navigation items', () => {
    renderWithProvider(<DocsSidebar />);
    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.getByText('Authentication')).toBeInTheDocument();
    expect(screen.getByText('Send Transaction')).toBeInTheDocument();
    expect(screen.getByText('MEV Receipt')).toBeInTheDocument();
    expect(screen.getByText('Rate Limits')).toBeInTheDocument();
  });

  it('shows method badges for endpoint items', () => {
    renderWithProvider(<DocsSidebar />);
    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getAllByText('GET').length).toBeGreaterThan(0);
  });

  it('filters items by search query', () => {
    renderWithProvider(<DocsSidebar />, { searchQuery: 'rate' });
    expect(screen.getByText('Rate Limits')).toBeInTheDocument();
    expect(screen.queryByText('Authentication')).toBeNull();
  });
});

describe('DocsSidebar — Documentation tab', () => {
  it('renders detector and protection RPC groups', () => {
    renderWithProvider(<DocsSidebar />, { activeTab: 'documentation' });
    expect(screen.getByText('Sandwich Detector')).toBeInTheDocument();
    expect(screen.getByText('Protection RPC')).toBeInTheDocument();
  });

  it('renders Korean labels when lang=ko', () => {
    renderWithProvider(<DocsSidebar />, { activeTab: 'documentation', lang: 'ko' });
    expect(screen.getByText('샌드위치 감지기')).toBeInTheDocument();
    expect(screen.getByText('보호 RPC')).toBeInTheDocument();
  });
});
