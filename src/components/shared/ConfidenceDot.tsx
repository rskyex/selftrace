'use client';

import { useId, useState } from 'react';

type Level = 'counted' | 'patterned' | 'interpretive';

const tips: Record<Level, string> = {
  counted: 'This is a direct count from your data.',
  patterned: 'A pattern we noticed. Plausible, not certain.',
  interpretive: 'One possible reading. You might see it differently.',
};

/**
 * A focusable button: the explanation is linked with aria-describedby, so
 * screen readers announce it, and it is shown on hover and keyboard focus.
 */
export function ConfidenceDot({ level, className = '' }: { level: Level; className?: string }) {
  const [show, setShow] = useState(false);
  const tipId = useId();
  const cls = level === 'counted' ? 'dot-counted' : level === 'patterned' ? 'dot-patterned' : 'dot-interpretive';

  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        className="inline-flex items-center justify-center w-5 h-5 -m-1.5 rounded-full cursor-help focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-umber-500"
        aria-label={`Confidence: ${level}`}
        aria-describedby={tipId}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        onKeyDown={e => { if (e.key === 'Escape') setShow(false); }}
      >
        <span className={`dot ${cls}`} aria-hidden="true" />
      </button>
      <span
        id={tipId}
        role="tooltip"
        className={show
          ? 'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2.5 bg-ink-900 text-white text-[12px] font-sans leading-relaxed rounded-xl z-50 pointer-events-none shadow-lg text-center'
          : 'sr-only'}
      >
        {tips[level]}
      </span>
    </span>
  );
}
