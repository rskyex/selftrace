'use client';

import { useState, useRef, useEffect } from 'react';
import type { EpistemicStatus } from '@/lib/data/types';
import { EPISTEMIC_LABELS } from '@/lib/epistemic/framing';

interface EpistemicBadgeProps {
  status: EpistemicStatus;
  className?: string;
  /** Show the full description inline instead of as tooltip */
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
    timeoutRef.current = setTimeout(() => setShowTooltip(true), 350);
  };

  const handleLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowTooltip(false);
  };

  if (inline) {
    return (
      <span className={`font-interface text-[11px] leading-tight ${statusTextColor[status]} ${className}`}>
        {config.label} — {config.description}
      </span>
    );
  }

  return (
    <span
      className={`relative inline-flex items-center font-interface ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span className={`text-[10.5px] tracking-wide uppercase cursor-help ${statusClasses[status]}`}>
        {config.label}
      </span>

      {showTooltip && (
        <span
          className="absolute bottom-full left-0 mb-2 w-64 px-4 py-3 bg-charcoal-900 text-cream-50 text-[12px] leading-relaxed rounded-sm z-50 pointer-events-none font-interface opacity-0 animate-[fadeIn_200ms_ease-out_forwards]"
          style={{ animationFillMode: 'forwards' }}
        >
          <span className="block font-medium mb-1">{config.label}</span>
          {config.tooltip}
        </span>
      )}
    </span>
  );
}

const statusClasses: Record<EpistemicStatus, string> = {
  observed:
    'text-charcoal-500',
  inferred:
    'text-charcoal-500 border-b border-dotted border-charcoal-400 pb-px',
  speculative:
    'text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-sm italic not-uppercase normal-case tracking-normal',
  governance_commentary:
    'text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-sm normal-case tracking-normal',
};

const statusTextColor: Record<EpistemicStatus, string> = {
  observed: 'text-charcoal-500',
  inferred: 'text-charcoal-500',
  speculative: 'text-amber-700',
  governance_commentary: 'text-slate-600',
};
