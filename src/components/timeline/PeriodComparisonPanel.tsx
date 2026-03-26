'use client';

import { useState, useMemo } from 'react';
import type { Post, PeriodComparison, TimePeriod } from '@/lib/data/types';
import { computePeriodComparison } from '@/lib/analysis/pipeline';
import { EpistemicBadge } from '../shared/EpistemicBadge';

interface PeriodComparisonPanelProps {
  posts: Post[];
  periods: TimePeriod[];
}

export function PeriodComparisonPanel({ posts, periods }: PeriodComparisonPanelProps) {
  const [periodAIdx, setPeriodAIdx] = useState(0);
  const [periodBIdx, setPeriodBIdx] = useState(Math.max(0, periods.length - 1));

  const comparison: PeriodComparison | null = useMemo(() => {
    const pA = periods[periodAIdx];
    const pB = periods[periodBIdx];
    if (!pA || !pB || periodAIdx === periodBIdx) return null;
    return computePeriodComparison(posts, pA.start, pA.end, pB.start, pB.end);
  }, [posts, periods, periodAIdx, periodBIdx]);

  if (periods.length < 2) return null;

  return (
    <div>
      <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 mb-2">
        Compare two periods
      </h2>
      <p className="text-[14px] text-ink-500 leading-relaxed mb-6 max-w-lg">
        Select two periods to compare side by side. Differences may reflect
        life changes, evolving interests, or platform dynamics — this tool
        notes the differences without assigning cause.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-[12px] font-medium text-ink-400 uppercase tracking-wider mb-2" htmlFor="period-a">
            Earlier period
          </label>
          <select
            id="period-a"
            value={periodAIdx}
            onChange={(e) => setPeriodAIdx(Number(e.target.value))}
            className="w-full bg-white border border-linen-200 rounded-lg px-4 py-2.5 text-[14px] text-ink-700 focus:outline-none focus:border-accent-500"
          >
            {periods.map((p, i) => (
              <option key={p.id} value={i} disabled={i === periodBIdx}>
                {p.label} ({p.postCount} posts)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-medium text-ink-400 uppercase tracking-wider mb-2" htmlFor="period-b">
            Later period
          </label>
          <select
            id="period-b"
            value={periodBIdx}
            onChange={(e) => setPeriodBIdx(Number(e.target.value))}
            className="w-full bg-white border border-linen-200 rounded-lg px-4 py-2.5 text-[14px] text-ink-700 focus:outline-none focus:border-accent-500"
          >
            {periods.map((p, i) => (
              <option key={p.id} value={i} disabled={i === periodAIdx}>
                {p.label} ({p.postCount} posts)
              </option>
            ))}
          </select>
        </div>
      </div>

      {comparison && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <p className="text-[11px] font-medium text-ink-400 uppercase tracking-wider mb-2">
              Posts / month
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-[20px] font-semibold text-ink-700">{comparison.postingFrequency.value.a}</span>
              <span className="text-ink-300 text-[13px]">&rarr;</span>
              <span className="font-display text-[20px] text-ink-900">{comparison.postingFrequency.value.b}</span>
            </div>
          </div>

          <div className="card p-4">
            <p className="text-[11px] font-medium text-ink-400 uppercase tracking-wider mb-2">
              Distinct topics
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-[20px] font-semibold text-ink-700">{comparison.topicDiversity.value.a}</span>
              <span className="text-ink-300 text-[13px]">&rarr;</span>
              <span className="font-display text-[20px] text-ink-900">{comparison.topicDiversity.value.b}</span>
            </div>
          </div>

          <div className="card p-4 col-span-2 md:col-span-1">
            <p className="text-[11px] font-medium text-ink-400 uppercase tracking-wider mb-2">
              Top topics shift
            </p>
            <div className="flex gap-2">
              <div className="flex flex-wrap gap-1">
                {comparison.topTopics.value.a.map(t => (
                  <span key={t} className="pill text-[10px] bg-linen-200 text-charcoal-600">{t}</span>
                ))}
              </div>
              <span className="text-ink-300 text-[13px]">&rarr;</span>
              <div className="flex flex-wrap gap-1">
                {comparison.topTopics.value.b.map(t => (
                  <span key={t} className="pill text-[10px] bg-accent-100 text-accent-700">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Tone comparison */}
          {Object.entries(comparison.toneShift.value.a).map(([k, v]) => (
            <div key={k} className="card p-4">
              <p className="text-[11px] font-medium text-ink-400 uppercase tracking-wider mb-2">{k}</p>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[16px] text-ink-700">{v.toFixed(2)}</span>
                <span className="text-ink-300 text-[12px]">&rarr;</span>
                <span className="font-mono text-[16px] text-ink-900">{(comparison.toneShift.value.b as Record<string, number>)[k].toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!comparison && periodAIdx === periodBIdx && (
        <p className="text-[14px] text-ink-400 italic">
          Select two different periods to compare.
        </p>
      )}
    </div>
  );
}
