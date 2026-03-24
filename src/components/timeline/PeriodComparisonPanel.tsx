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
      <h2 className="text-[22px] text-charcoal-900 mb-3">
        Period Comparison
      </h2>
      <p className="text-[14px] text-charcoal-500 leading-relaxed mb-6">
        Select two periods to compare side-by-side. Differences between
        periods may reflect life changes, evolving interests, external
        events, or platform dynamics — this tool notes the differences
        without attributing cause.
      </p>

      {/* Selectors */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <label className="font-interface text-[10px] text-charcoal-400 uppercase tracking-widest block mb-2" htmlFor="period-a">
            Earlier Period
          </label>
          <select
            id="period-a"
            value={periodAIdx}
            onChange={(e) => setPeriodAIdx(Number(e.target.value))}
            className="w-full bg-cream-50 border border-cream-200 rounded-sm px-3 py-2 font-interface text-[12px] text-charcoal-700 focus:outline-none focus:border-teal-500"
          >
            {periods.map((p, i) => (
              <option key={p.id} value={i} disabled={i === periodBIdx}>
                {p.label} ({p.postCount} posts)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-interface text-[10px] text-charcoal-400 uppercase tracking-widest block mb-2" htmlFor="period-b">
            Later Period
          </label>
          <select
            id="period-b"
            value={periodBIdx}
            onChange={(e) => setPeriodBIdx(Number(e.target.value))}
            className="w-full bg-cream-50 border border-cream-200 rounded-sm px-3 py-2 font-interface text-[12px] text-charcoal-700 focus:outline-none focus:border-teal-500"
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
        <div className="grid grid-cols-2 gap-6">
          {/* Posting frequency */}
          <div className="border-b border-cream-200 pb-4">
            <p className="font-interface text-[10px] text-charcoal-400 uppercase tracking-widest mb-2">
              Posts / Month
            </p>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[16px] text-charcoal-700">
                {comparison.postingFrequency.value.a}
              </span>
              <span className="text-charcoal-300 text-[11px]">→</span>
              <span className="font-mono text-[16px] text-charcoal-900">
                {comparison.postingFrequency.value.b}
              </span>
            </div>
            <EpistemicBadge status={comparison.postingFrequency.status} />
          </div>

          {/* Topic diversity */}
          <div className="border-b border-cream-200 pb-4">
            <p className="font-interface text-[10px] text-charcoal-400 uppercase tracking-widest mb-2">
              Distinct Topics
            </p>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[16px] text-charcoal-700">
                {comparison.topicDiversity.value.a}
              </span>
              <span className="text-charcoal-300 text-[11px]">→</span>
              <span className="font-mono text-[16px] text-charcoal-900">
                {comparison.topicDiversity.value.b}
              </span>
            </div>
            <EpistemicBadge status={comparison.topicDiversity.status} />
          </div>

          {/* Top topics A */}
          <div className="border-b border-cream-200 pb-4">
            <p className="font-interface text-[10px] text-charcoal-400 uppercase tracking-widest mb-2">
              Top Topics — {comparison.periodA.label}
            </p>
            <div className="space-y-1">
              {comparison.topTopics.value.a.map(t => (
                <p key={t} className="font-interface text-[12px] text-charcoal-700">{t}</p>
              ))}
            </div>
          </div>

          {/* Top topics B */}
          <div className="border-b border-cream-200 pb-4">
            <p className="font-interface text-[10px] text-charcoal-400 uppercase tracking-widest mb-2">
              Top Topics — {comparison.periodB.label}
            </p>
            <div className="space-y-1">
              {comparison.topTopics.value.b.map(t => (
                <p key={t} className="font-interface text-[12px] text-charcoal-700">{t}</p>
              ))}
            </div>
          </div>

          {/* Tone A */}
          <div className="border-b border-cream-200 pb-4">
            <p className="font-interface text-[10px] text-charcoal-400 uppercase tracking-widest mb-2">
              Tone — {comparison.periodA.label}
            </p>
            {Object.entries(comparison.toneShift.value.a).map(([k, v]) => (
              <div key={k} className="flex justify-between font-interface text-[11px] text-charcoal-500 py-0.5">
                <span className="uppercase tracking-wide">{k}</span>
                <span className="font-mono">{v.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Tone B */}
          <div className="border-b border-cream-200 pb-4">
            <p className="font-interface text-[10px] text-charcoal-400 uppercase tracking-widest mb-2">
              Tone — {comparison.periodB.label}
            </p>
            {Object.entries(comparison.toneShift.value.b).map(([k, v]) => (
              <div key={k} className="flex justify-between font-interface text-[11px] text-charcoal-500 py-0.5">
                <span className="uppercase tracking-wide">{k}</span>
                <span className="font-mono">{v.toFixed(2)}</span>
              </div>
            ))}
            <div className="mt-1">
              <EpistemicBadge status={comparison.toneShift.status} />
            </div>
          </div>
        </div>
      )}

      {!comparison && periodAIdx === periodBIdx && (
        <p className="text-[14px] text-charcoal-400 italic">
          Select two different periods to compare.
        </p>
      )}
    </div>
  );
}
