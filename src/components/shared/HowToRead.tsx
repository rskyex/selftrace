'use client';

import { useState } from 'react';

interface HowToReadProps {
  children: React.ReactNode;
}

export function HowToRead({ children }: HowToReadProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-cream-100 border border-cream-200 rounded-sm my-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-5 py-3 font-interface text-[13px] text-charcoal-500 hover:text-charcoal-700 transition-colors duration-150 flex items-center justify-between"
      >
        <span>How to read this page</span>
        <span className="text-charcoal-300">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="px-5 pb-4 text-[14px] leading-relaxed text-charcoal-700 border-t border-cream-200 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}
