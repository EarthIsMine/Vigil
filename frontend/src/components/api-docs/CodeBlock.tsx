'use client';

import { useState } from 'react';

export default function CodeBlock({
  label,
  color = 'secondary',
  children,
}: {
  lang: string;
  label: string;
  color?: string;
  children: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const dotColor = color === 'secondary' ? 'bg-secondary' : 'bg-primary';

  return (
    <div className="bg-surface overflow-hidden">
      <div className="px-4 py-2.5 bg-surface-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 ${dotColor}`} />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted font-semibold">{label}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-muted hover:text-on-surf transition-colors"
        >
          <span className="material-symbols-outlined text-base">
            {copied ? 'check' : 'content_copy'}
          </span>
        </button>
      </div>
      <pre className="px-4 py-4 overflow-x-auto text-[13px] leading-7">
        <code
          className="font-mono text-on-surf"
          dangerouslySetInnerHTML={{ __html: children }}
        />
      </pre>
    </div>
  );
}
