'use client';

import { useState, type MouseEvent } from 'react';

interface CopyAddressButtonProps {
  address: string;
  className?: string;
  iconClassName?: string;
}

export default function CopyAddressButton({
  address,
  className = '',
  iconClassName = 'text-sm',
}: CopyAddressButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — silently no-op
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={copied ? 'Address copied' : 'Copy address'}
      title={copied ? 'Copied!' : 'Copy address'}
      className={`inline-flex items-center justify-center text-vigil-muted hover:text-white transition-colors cursor-pointer ${className}`}
    >
      <span className={`material-symbols-outlined ${iconClassName}`} aria-hidden="true">
        {copied ? 'check' : 'content_copy'}
      </span>
    </button>
  );
}
