'use client';

import { useState } from 'react';

type Level = 'counted' | 'patterned' | 'interpretive';

const tips: Record<Level, string> = {
  counted: 'This is a direct count from your data.',
  patterned: 'A pattern we noticed. Plausible, not certain.',
  interpretive: 'One possible reading. You might see it differently.',
};

export function ConfidenceDot({ level, className = '' }: { level: Level; className?: string }) {
  const [show, setShow] = useState(false);
  const cls = level === 'counted' ? 'dot-counted' : level === 'patterned' ? 'dot-patterned' : 'dot-interpretive';

  return (
    <span className={`relative inline-flex items-center cursor-help ${className}`}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
      aria-label={`Confidence: ${level}`}>
      <span className={`dot ${cls}`} />
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2.5 bg-ink-900 text-white text-[12px] font-sans leading-relaxed rounded-xl z-50 pointer-events-none shadow-lg text-center">
          {tips[level]}
        </span>
      )}
    </span>
  );
}
