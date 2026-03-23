'use client';

import { useState } from 'react';
import type { EpistemicStatus } from '@/lib/data/types';
import { EPISTEMIC_LABELS } from '@/lib/epistemic/framing';

interface EpistemicBadgeProps {
  status: EpistemicStatus;
  className?: string;
}

const statusStyles: Record<EpistemicStatus, string> = {
  observed: 'text-charcoal-700',
  inferred: 'text-charcoal-700 border-b border-dotted border-charcoal-500',
  speculative: 'text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-sm italic',
  governance_commentary: 'text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-sm',
};

export function EpistemicBadge({ status, className = '' }: EpistemicBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = EPISTEMIC_LABELS[status];

  return (
    <span className={`relative inline-block font-interface ${className}`}>
      <span
        className={`text-[11px] leading-tight cursor-help ${statusStyles[status]}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {config.label}
      </span>
      {showTooltip && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 bg-charcoal-900 text-cream-50 text-[11px] leading-relaxed rounded-sm shadow-sm z-50 pointer-events-none font-interface">
          {config.tooltip}
        </span>
      )}
    </span>
  );
}
