'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import type { Components } from 'react-markdown';
import { DOCS } from '@/app/api-docs/content';
import { parseDocPageId, isMarkdownGroup } from '@/app/api-docs/constants';
import { useDocs } from '@/app/api-docs/DocsContext';

const COMPONENTS: Components = {
  h1: ({ children, ...props }) => (
    <h1 {...props} className="font-display font-bold text-4xl text-on-surf mt-2 mb-4 scroll-mt-32">
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 {...props} className="font-display font-bold text-2xl text-on-surf mt-10 mb-3 scroll-mt-32">
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 {...props} className="font-display font-semibold text-on-surf text-lg mt-8 mb-3 scroll-mt-32">
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 {...props} className="font-display font-semibold text-on-surf text-base mt-6 mb-2">
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p {...props} className="text-on-surf/85 text-[0.95rem] leading-7 my-4">
      {children}
    </p>
  ),
  a: ({ children, href, ...props }) => {
    const isExternal = href?.startsWith('http');
    return (
      <a
        {...props}
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="text-primary hover:underline"
      >
        {children}
      </a>
    );
  },
  ul: ({ children, ...props }) => (
    <ul {...props} className="list-disc pl-6 my-4 text-on-surf/85 text-sm leading-relaxed space-y-1">
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol {...props} className="list-decimal pl-6 my-4 text-on-surf/85 text-sm leading-relaxed space-y-1">
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li {...props} className="marker:text-muted">
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      {...props}
      className="my-5 flex gap-3 bg-primary/5 border-l-2 border-primary/60 pl-4 pr-4 py-3 rounded-r-md"
    >
      <span className="material-symbols-outlined text-primary text-lg leading-none mt-0.5 flex-shrink-0">
        info
      </span>
      <div className="flex-1 text-on-surf/85 text-[0.9rem] leading-relaxed [&>p]:my-1 [&>p]:leading-relaxed">
        {children}
      </div>
    </blockquote>
  ),
  code: ({ children, className, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="font-mono text-primary text-[0.85em] bg-surface-200 border border-outline/20 px-1.5 py-0.5 rounded">
          {children}
        </code>
      );
    }
    return (
      <code className={`${className ?? ''} font-mono text-sm`} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => (
    <pre
      {...props}
      className="bg-surface-200 px-5 py-4 my-5 overflow-x-auto rounded-lg text-[13px] leading-7 border border-outline/20"
    >
      {children}
    </pre>
  ),
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-6 rounded-lg border border-outline/20">
      <table {...props} className="w-full text-sm bg-surface-100">
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead {...props} className="bg-surface-200 border-b border-outline/20">
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody {...props} className="divide-y divide-outline/10">
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }) => (
    <tr {...props} className="hover:bg-surface-200/40 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th {...props} className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase text-muted">
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td {...props} className="px-4 py-3 text-on-surf/90 align-top text-[0.9rem] leading-relaxed">
      {children}
    </td>
  ),
  hr: ({ ...props }) => <hr {...props} className="my-10 border-t border-outline/15" />,
  img: ({ alt, src, ...props }) => {
    if (!src || typeof src !== 'string') return null;
    if (src.includes('shields.io')) return null; // belt-and-suspenders: badges shouldn't render
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img {...props} alt={alt ?? ''} src={src} className="inline-block max-w-full rounded" />
    );
  },
  strong: ({ children, ...props }) => (
    <strong {...props} className="text-on-surf font-semibold">
      {children}
    </strong>
  ),
};

export default function DocSectionView({ pageId }: { pageId: string }) {
  const { lang, t } = useDocs();
  const parsed = parseDocPageId(pageId);

  if (!parsed || !isMarkdownGroup(parsed.group)) {
    return <div className="text-error text-sm py-12">Invalid page id: {pageId}</div>;
  }

  const doc = DOCS[parsed.group][lang];
  const allSections = [doc.intro, ...doc.sections];
  const section = allSections.find((s) => s.id === parsed.section);

  if (!section) {
    return (
      <div className="text-muted text-sm py-12">
        {lang === 'ko' ? '섹션을 찾을 수 없습니다.' : 'Section not found.'}
      </div>
    );
  }

  const groupLabel = t.sidebar.docGroups[parsed.group];

  return (
    <article>
      <p className="text-xs uppercase tracking-widest text-muted font-mono mb-3">
        {groupLabel}
      </p>
      <h1 className="font-display font-bold text-4xl text-on-surf mt-1 mb-8 pb-4 border-b border-outline/15">
        {section.title}
      </h1>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={COMPONENTS}
      >
        {section.body}
      </ReactMarkdown>
    </article>
  );
}
