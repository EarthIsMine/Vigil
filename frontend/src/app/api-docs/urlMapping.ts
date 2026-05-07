import { NAV_SECTIONS, DEFAULT_DOC_PAGE, parseDocPageId, type DocGroupKey } from './constants';
import { DOCS } from './content';

// Public-facing URL slug ↔ internal group key.
const KEY_TO_URL_GROUP: Record<DocGroupKey, string> = {
  gettingStarted: 'getting-started',
  detectorReadme: 'sandwich-detector',
  detectorDesign: 'detection-design',
  rpcReadme: 'protection-rpc',
};

const URL_GROUP_TO_KEY: Record<string, DocGroupKey> = {
  'getting-started': 'gettingStarted',
  'sandwich-detector': 'detectorReadme',
  'detection-design': 'detectorDesign',
  'protection-rpc': 'rpcReadme',
};

const VALID_API_PAGES = NAV_SECTIONS.flatMap((g) => g.items.map((i) => i.id));

export interface DocsRoute {
  activeTab: 'documentation' | 'api-reference';
  activeApiPage: string;
  activeDocPage: string;
}

export const DEFAULT_ROUTE: DocsRoute = {
  activeTab: 'documentation',
  activeApiPage: 'introduction',
  activeDocPage: DEFAULT_DOC_PAGE,
};

function defaultSectionFor(group: DocGroupKey): string {
  if (group === 'gettingStarted') return 'overview';
  return DOCS[group].en.sections[0]?.id ?? 'overview';
}

export function parseUrl(slug: string[] | undefined): DocsRoute {
  const parts = slug ?? [];
  if (parts.length === 0) return DEFAULT_ROUTE;

  if (parts[0] === 'api') {
    const sectionId = parts[1];
    return {
      activeTab: 'api-reference',
      activeApiPage: sectionId && VALID_API_PAGES.includes(sectionId) ? sectionId : 'introduction',
      activeDocPage: DEFAULT_DOC_PAGE,
    };
  }

  if (parts[0] === 'docs') {
    const groupSlug = parts[1];
    const sectionId = parts[2];
    const groupKey = groupSlug ? URL_GROUP_TO_KEY[groupSlug] : undefined;
    if (!groupKey) return DEFAULT_ROUTE;
    const section = sectionId ?? defaultSectionFor(groupKey);
    return {
      activeTab: 'documentation',
      activeApiPage: 'introduction',
      activeDocPage: `${groupKey}:${section}`,
    };
  }

  return DEFAULT_ROUTE;
}

export function buildUrl(route: Partial<DocsRoute>): string {
  const tab = route.activeTab ?? 'documentation';
  if (tab === 'api-reference') {
    const page = route.activeApiPage ?? 'introduction';
    return `/api-docs/api/${page}`;
  }
  const docPage = route.activeDocPage ?? DEFAULT_DOC_PAGE;
  const parsed = parseDocPageId(docPage);
  if (!parsed) return '/api-docs';
  const groupSlug = KEY_TO_URL_GROUP[parsed.group];
  return `/api-docs/docs/${groupSlug}/${parsed.section}`;
}
