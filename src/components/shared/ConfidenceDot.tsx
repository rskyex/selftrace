'use client';

import { useState } from 'react';

type Level = 'high' | 'medium' | 'low';

interface ConfidenceDotProps {
  level: Level;
  className?: string;
}

const labels: Record<Level, string> = {
  high: 'This comes directly from your data.',
  medium: 'We detected this through pattern analysis. It\'s a plausible reading, not a certainty.',
  low: 'This is one possible interpretation. You might read it differently.',
};

const dotClass: Record<Level, string> = {
  high: 'confidence-high',
  medium: 'confidence-medium',
  low: 'confidence-low',
};

export function ConfidenceDot({ level, className = '' }: ConfidenceDotProps) {
  const [show, setShow] = useState(false);

  return (
    <span
      className={`relative inline-flex items-center cursor-help ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      aria-label={`Confidence: ${level}`}
    >
      <span className={`confidence-dot ${dotClass[level]}`} />
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2.5 bg-ink-900 text-white text-[12px] font-sans leading-relaxed rounded-lg z-50 pointer-events-none shadow-lg">
          {labels[level]}
        </span>
      )}
    </span>
  );
}
