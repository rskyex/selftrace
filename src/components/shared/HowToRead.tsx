'use client';

import { useState } from 'react';

interface HowToReadProps {
  children: React.ReactNode;
  label?: string;
}

export function HowToRead({ children, label = 'How to read this' }: HowToReadProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-2.5 text-[13px] text-charcoal-400 hover:text-charcoal-600 flex items-center justify-between"
        aria-expanded={isOpen}
      >
        <span>{label}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-4 text-[14px] leading-relaxed text-charcoal-500 border-t border-cream-200 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}
