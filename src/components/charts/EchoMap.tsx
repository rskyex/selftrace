'use client';

import type { MemoryEvent } from '@/lib/data/types';

/**
 * The Echo Map — recurring phrases plotted on a timeline.
 * Dots for each occurrence, connected by arcing threads.
 * Dense clusters show phrases that keep returning.
 */
export function EchoMap({ events }: { events: MemoryEvent[] }) {
  if (events.length === 0) return null;

  // Group by shared phrase
  const groups = new Map<string, MemoryEvent[]>();
  for (const ev of events) {
    if (!groups.has(ev.sharedPhrase)) groups.set(ev.sharedPhrase, []);
    groups.get(ev.sharedPhrase)!.push(ev);
  }
  const sorted = Array.from(groups.entries())
    .sort((a, b) => b[1][0].daysBetween - a[1][0].daysBetween)
    .slice(0, 8);

  if (sorted.length === 0) return null;

  // Collect all dates for the timeline range
  const allDates: number[] = [];
  for (const [, evts] of sorted) {
    for (const ev of evts) {
      allDates.push(new Date(ev.earlierDate).getTime());
      allDates.push(new Date(ev.laterDate).getTime());
    }
  }
  const minDate = Math.min(...allDates);
  const maxDate = Math.max(...allDates);
  const dateRange = maxDate - minDate || 1;

  const w = 700, rowH = 40, pad = { t: 12, r: 16, b: 24, l: 16 };
  const h = pad.t + sorted.length * rowH + pad.b;
  const cW = w - pad.l - pad.r;

  const x = (timestamp: number) => pad.l + ((timestamp - minDate) / dateRange) * cW;

  return (
    <div className="my-6 surface-quiet">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: `${h}px` }} role="img" aria-label="Phrases that recurred across time">
        {sorted.map(([phrase, evts], rowIdx) => {
          const rowY = pad.t + rowIdx * rowH + rowH / 2;
          return (
            <g key={phrase}>
              {/* Connecting arcs */}
              {evts.map((ev, i) => {
                const x1 = x(new Date(ev.earlierDate).getTime());
                const x2 = x(new Date(ev.laterDate).getTime());
                const dist = x2 - x1;
                const arcH = Math.min(dist * 0.3, 18);
                return (
                  <path key={i}
                    d={`M ${x1} ${rowY} Q ${(x1 + x2) / 2} ${rowY - arcH} ${x2} ${rowY}`}
                    fill="none" stroke="#C8B8A8" strokeWidth={1} opacity={0.6}
                  />
                );
              })}
              {/* Dots */}
              {evts.map((ev, i) => (
                <g key={`d-${i}`}>
                  <circle cx={x(new Date(ev.earlierDate).getTime())} cy={rowY} r={4} fill="#B5704D" opacity={0.7} />
                  <circle cx={x(new Date(ev.laterDate).getTime())} cy={rowY} r={4} fill="#B5704D" opacity={0.7} />
                </g>
              ))}
              {/* Label */}
              <text x={pad.l + 2} y={rowY - 12} fill="#8A8179" fontSize={10} fontStyle="italic">
                &ldquo;{phrase.length > 40 ? phrase.slice(0, 37) + '…' : phrase}&rdquo;
              </text>
            </g>
          );
        })}
        {/* Date labels */}
        {[0, 0.25, 0.5, 0.75, 1].map(f => {
          const ts = minDate + f * dateRange;
          const dt = new Date(ts);
          return <text key={f} x={x(ts)} y={h - 4} textAnchor="middle" fill="#B5AEA5" fontSize={10}>{`${dt.toLocaleString('en', { month: 'short' })} '${dt.getFullYear().toString().slice(2)}`}</text>;
        })}
      </svg>
    </div>
  );
}
