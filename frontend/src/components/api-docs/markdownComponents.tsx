'use client';

import { useState, type ReactNode } from 'react';
import type { Components } from 'react-markdown';

const LANG_LABELS: Record<string, string> = {
  bash: 'Shell',
  sh: 'Shell',
  shell: 'Shell',
  zsh: 'Shell',
  rust: 'Rust',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  js: 'JavaScript',
  javascript: 'JavaScript',
  json: 'JSON',
  jsonc: 'JSONC',
  toml: 'TOML',
  yaml: 'YAML',
  yml: 'YAML',
  py: 'Python',
  python: 'Python',
  go: 'Go',
  sql: 'SQL',
  http: 'HTTP',
  text: 'Text',
};

function getLangFromClassName(className: string | undefined): string {
  if (!className) return '';
  const match = /language-([\w-]+)/.exec(className);
  return match?.[1] ?? '';
}

function flattenChildren(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(flattenChildren).join('');
  if (typeof node === 'object' && 'props' in node) {
    return flattenChildren((node as { props: { children?: ReactNode } }).props.children);
  }
  return '';
}

function FencedCodeBlock({ lang, children }: { lang: string; children: string }) {
  const [copied, setCopied] = useState(false);
  const label = LANG_LABELS[lang.toLowerCase()] ?? (lang ? lang.toUpperCase() : 'Code');
  const dotColor = lang === 'json' || lang === 'jsonc' ? 'bg-primary' : 'bg-secondary';

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-surface overflow-hidden rounded-lg border border-outline/15 my-5">
      <div className="px-4 py-2.5 bg-surface-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 ${dotColor}`} />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted font-semibold">
            {label}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="text-muted hover:text-on-surf transition-colors"
          aria-label="Copy code"
        >
          <span className="material-symbols-outlined text-base">
            {copied ? 'check' : 'content_copy'}
          </span>
        </button>
      </div>
      <pre className="px-4 py-4 overflow-x-auto text-[13px] leading-7">
        <code className="font-mono text-on-surf">{children}</code>
      </pre>
    </div>
  );
}

function classifyBlockquote(text: string): 'warning' | 'tip' | 'info' {
  const lower = text.trim().toLowerCase();
  if (/^!?\s*(warning|caution|danger|중요|주의|경고)/.test(lower)) return 'warning';
  if (/^!?\s*(tip|hint|note|참고|팁)/.test(lower)) return 'tip';
  return 'info';
}

const BLOCKQUOTE_TONE = {
  info: {
    bg: 'bg-primary/5',
    border: 'border-primary/60',
    icon: 'info',
    iconColor: 'text-primary',
  },
  tip: {
    bg: 'bg-secondary/5',
    border: 'border-secondary/60',
    icon: 'lightbulb',
    iconColor: 'text-secondary',
  },
  warning: {
    bg: 'bg-warning/5',
    border: 'border-warning/60',
    icon: 'warning',
    iconColor: 'text-warning',
  },
} as const;

export const MARKDOWN_COMPONENTS: Components = {
  h1: ({ children, ...props }) => (
    <h1 {...props} className="font-display font-bold text-3xl text-on-surf mt-10 mb-4 scroll-mt-32">
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      {...props}
      className="font-display font-bold text-2xl text-on-surf mt-12 mb-4 pl-4 border-l-[3px] border-primary scroll-mt-32"
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      {...props}
      className="font-display font-semibold text-on-surf text-lg mt-8 mb-3 scroll-mt-32 flex items-center gap-2.5"
    >
      <span className="inline-block w-1.5 h-1.5 bg-primary rotate-45 flex-shrink-0" aria-hidden />
      <span>{children}</span>
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      {...props}
      className="font-display font-semibold text-on-surf text-base mt-6 mb-2 uppercase tracking-wider text-[13px]"
    >
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
    <ul {...props} className="list-disc pl-6 my-4 text-on-surf/85 text-sm leading-relaxed space-y-1.5 marker:text-primary/70">
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol {...props} className="list-decimal pl-6 my-4 text-on-surf/85 text-sm leading-relaxed space-y-1.5 marker:text-primary/70 marker:font-mono marker:text-xs">
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => <li {...props}>{children}</li>,
  blockquote: ({ children, ...props }) => {
    const text = flattenChildren(children);
    const tone = classifyBlockquote(text);
    const style = BLOCKQUOTE_TONE[tone];
    return (
      <blockquote
        {...props}
        className={`my-5 flex gap-3 ${style.bg} border-l-2 ${style.border} pl-4 pr-4 py-3 rounded-r-md`}
      >
        <span className={`material-symbols-outlined ${style.iconColor} text-lg leading-none mt-0.5 flex-shrink-0`}>
          {style.icon}
        </span>
        <div className="flex-1 text-on-surf/85 text-[0.9rem] leading-relaxed [&>p]:my-1 [&>p]:leading-relaxed">
          {children}
        </div>
      </blockquote>
    );
  },
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
  pre: ({ children }) => {
    const childArr = Array.isArray(children) ? children : [children];
    const codeNode = childArr.find(
      (c): c is { props: { className?: string; children?: ReactNode } } =>
        typeof c === 'object' && c !== null && 'props' in c,
    );
    const lang = getLangFromClassName(codeNode?.props.className);
    const text = flattenChildren(codeNode?.props.children).replace(/\n$/, '');
    return <FencedCodeBlock lang={lang}>{text}</FencedCodeBlock>;
  },
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
  hr: ({ ...props }) => (
    <hr {...props} className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-outline/30 to-transparent" />
  ),
  img: ({ alt, src, ...props }) => {
    if (!src || typeof src !== 'string') return null;
    if (src.includes('shields.io')) return null;
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
