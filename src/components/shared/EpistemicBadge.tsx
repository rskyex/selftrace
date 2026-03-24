'use client';

import { useState, useRef, useEffect } from 'react';
import type { EpistemicStatus } from '@/lib/data/types';
import { EPISTEMIC_LABELS } from '@/lib/epistemic/framing';

interface EpistemicBadgeProps {
  status: EpistemicStatus;
  className?: string;
  inline?: boolean;
}

export function EpistemicBadge({ status, className = '', inline = false }: EpistemicBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const config = EPISTEMIC_LABELS[status];

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleEnter = () => {
    timeoutRef.current = setTimeout(() => setShowTooltip(true), 300);
  };

  const handleLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowTooltip(false);
  };

  if (inline) {
    return (
      <span className={`text-[12px] leading-tight ${statusTextColor[status]} ${className}`}>
        {config.label} — {config.description}
      </span>
    );
  }

  return (
    <span
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span className={`pill cursor-help ${statusClasses[status]}`}>
        {config.label}
      </span>

      {showTooltip && (
        <span className="absolute bottom-full left-0 mb-2 w-64 px-4 py-3 bg-charcoal-900 text-white text-[12px] leading-relaxed rounded-lg z-50 pointer-events-none shadow-lg">
          <span className="block font-medium mb-1">{config.label}</span>
          {config.tooltip}
        </span>
      )}
    </span>
  );
}

const statusClasses: Record<EpistemicStatus, string> = {
  observed:
    'bg-sage-100 text-sage-700',
  inferred:
    'bg-accent-100 text-accent-700',
  speculative:
    'bg-amber-100 text-amber-700',
  governance_commentary:
    'bg-slate-100 text-slate-600 border border-slate-200',
};

const statusTextColor: Record<EpistemicStatus, string> = {
  observed: 'text-sage-700',
  inferred: 'text-accent-700',
  speculative: 'text-amber-700',
  governance_commentary: 'text-slate-600',
};
