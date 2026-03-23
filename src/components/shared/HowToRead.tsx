'use client';

import { useState } from 'react';

interface HowToReadProps {
  children: React.ReactNode;
}

export function HowToRead({ children }: HowToReadProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-8 border-b border-cream-200 pb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-2 font-interface text-[11px] text-charcoal-400 hover:text-charcoal-500 transition-colors duration-200 flex items-center justify-between tracking-wide"
      >
        <span>How to read this page</span>
        <span className="text-charcoal-300 text-[10px]">{isOpen ? '—' : '+'}</span>
      </button>
      {isOpen && (
        <div className="pb-5 text-[14px] leading-relaxed text-charcoal-500">
          {children}
        </div>
      )}
    </div>
  );
}
