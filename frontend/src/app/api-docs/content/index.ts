import GithubSlugger from 'github-slugger';
import {
  detectorReadmeEn,
  detectorReadmeKo,
  detectorDesignEn,
  detectorDesignKo,
  rpcReadmeEn,
  rpcReadmeKo,
} from './raw';

export interface DocSection {
  id: string;
  title: string;
  body: string;
}

export interface ParsedDoc {
  intro: DocSection;
  sections: DocSection[];
}

// Strip noise that doesn't survive single-section rendering:
//   - shields.io badge images
//   - <br/> tags (replaced with newline) and stray &middot;/&mdash; entities
//   - centered HTML wrappers (<p align="center">…</p>, <div align="center">…</div>)
//   - cross-section anchor links [text](#id) — flatten to plain text
function sanitizeSection(body: string): string {
  return body
    // remove shields.io <img> badges (and their wrapping <a>)
    .replace(/<a\s+href="[^"]*"[^>]*>\s*<img[^>]*shields\.io[^>]*\/?>\s*<\/a>/g, '')
    .replace(/<img[^>]*shields\.io[^>]*\/?>/g, '')
    // strip centered <p align="center">…</p> blocks (multi-line)
    .replace(/<p\s+align="center"[^>]*>[\s\S]*?<\/p>/gi, '')
    .replace(/<div\s+align="center"[^>]*>[\s\S]*?<\/div>/gi, '')
    // <br/> -> newline
    .replace(/<br\s*\/?>/gi, '\n')
    // common entities
    .replace(/&middot;/g, '·')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    // flatten cross-section anchor links [text](#id) -> text
    .replace(/\[([^\]]+)\]\(#[^)]+\)/g, '$1')
    // collapse 3+ blank lines to 2
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function splitByH2(markdown: string, introTitleFallback: string): ParsedDoc {
  const slugger = new GithubSlugger();
  const lines = markdown.split('\n');
  const sections: { title: string; bodyLines: string[] }[] = [];
  const introLines: string[] = [];
  let inFence = false;
  let current: { title: string; bodyLines: string[] } | null = null;

  for (const raw of lines) {
    const line = raw.replace(/\r$/, '');
    if (line.startsWith('```')) {
      inFence = !inFence;
      (current ? current.bodyLines : introLines).push(line);
      continue;
    }
    if (!inFence) {
      const m = /^##\s+(.+?)\s*#*\s*$/.exec(line);
      if (m) {
        const title = m[1].replace(/<[^>]+>/g, '').trim();
        current = { title, bodyLines: [] };
        sections.push(current);
        continue;
      }
    }
    if (current) current.bodyLines.push(line);
    else introLines.push(line);
  }

  return {
    intro: {
      id: 'overview',
      title: introTitleFallback,
      body: sanitizeSection(introLines.join('\n')),
    },
    sections: sections.map((s) => ({
      id: slugger.slug(s.title),
      title: s.title,
      body: sanitizeSection(s.bodyLines.join('\n')),
    })),
  };
}

export interface BilingualDoc {
  en: ParsedDoc;
  ko: ParsedDoc;
}

export const DOCS = {
  detectorReadme: {
    en: splitByH2(detectorReadmeEn, 'Overview'),
    ko: splitByH2(detectorReadmeKo, '개요'),
  },
  detectorDesign: {
    en: splitByH2(detectorDesignEn, 'Overview'),
    ko: splitByH2(detectorDesignKo, '개요'),
  },
  rpcReadme: {
    en: splitByH2(rpcReadmeEn, 'Overview'),
    ko: splitByH2(rpcReadmeKo, '개요'),
  },
} satisfies Record<string, BilingualDoc>;

export type DocKey = keyof typeof DOCS;
