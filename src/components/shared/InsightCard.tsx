'use client';

import type { EpistemicStatus } from '@/lib/data/types';
import { EpistemicBadge } from './EpistemicBadge';

interface InsightCardProps {
  label: string;
  value: string | number;
  detail?: string;
  status?: EpistemicStatus;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

export function InsightCard({ label, value, detail, status, trend, className = '' }: InsightCardProps) {
  return (
    <div className={`card p-5 ${className}`}>
      <p className="text-[12px] font-medium text-charcoal-400 uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <p className="text-[28px] font-semibold text-charcoal-900 tracking-tight leading-none">
          {value}
        </p>
        {trend && (
          <span className={`text-[13px] font-medium ${
            trend === 'up' ? 'text-accent-600' : trend === 'down' ? 'text-amber-600' : 'text-charcoal-400'
          }`} aria-label={`Trend: ${trend}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'}
          </span>
        )}
      </div>
      {detail && (
        <p className="text-[13px] text-charcoal-400 mt-2 leading-relaxed">
          {detail}
        </p>
      )}
      {status && (
        <div className="mt-3">
          <EpistemicBadge status={status} />
        </div>
      )}
    </div>
  );
}
