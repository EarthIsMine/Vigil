import GithubSlugger from 'github-slugger';

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const lines = markdown.split('\n');
  const headings: Heading[] = [];
  let inFence = false;
  for (const raw of lines) {
    const line = raw.replace(/\r$/, '');
    if (line.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const level = m[1].length === 2 ? 2 : 3;
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    if (!text) continue;
    headings.push({ id: slugger.slug(text), text, level });
  }
  return headings;
}
