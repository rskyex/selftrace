'use client';

import { useState } from 'react';

type Level = 'high' | 'medium' | 'low';

const tips: Record<Level, string> = {
  high: 'This comes directly from your data.',
  medium: 'A pattern we noticed. Plausible, not certain.',
  low: 'One possible reading. You might see it differently.',
};

export function ConfidenceDot({ level, className = '' }: { level: Level; className?: string }) {
  const [show, setShow] = useState(false);
  const cls = level === 'high' ? 'dot-high' : level === 'medium' ? 'dot-medium' : 'dot-low';

  return (
    <span className={`relative inline-flex items-center cursor-help ${className}`}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
      aria-label={`Confidence: ${level}`}>
      <span className={`dot ${cls}`} />
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 px-3 py-2 bg-ink-900 text-white text-[12px] font-sans leading-relaxed rounded-xl z-50 pointer-events-none shadow-lg text-center">
          {tips[level]}
        </span>
      )}
    </span>
  );
}
