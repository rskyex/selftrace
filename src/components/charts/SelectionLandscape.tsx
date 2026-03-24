'use client';

import type { TopicEngagement } from '@/lib/data/types';

/**
 * The Selection Landscape — a scatter field.
 * X = frequency change over time. Y = engagement received.
 * Quadrants: reinforced (upper-right), faded (lower-left),
 * persisted/self-governed (lower-right), resisted (upper-left).
 */
export function SelectionLandscape({ data }: { data: TopicEngagement[] }) {
  if (data.length === 0) return null;

  const w = 660, h = 400, pad = { t: 40, r: 40, b: 50, l: 50 };
  const cW = w - pad.l - pad.r, cH = h - pad.t - pad.b;

  const maxEng = Math.max(...data.map(d => d.averageEngagement), 1);
  const avgEng = data.reduce((s, d) => s + d.averageEngagement, 0) / data.length;

  // Map frequency trend to numeric: increasing=1, stable=0, decreasing=-1
  const trendVal = (t: string) => t === 'increasing' ? 1 : t === 'decreasing' ? -1 : 0;

  const x = (trend: string) => pad.l + ((trendVal(trend) + 1) / 2) * cW;
  const y = (eng: number) => pad.t + cH - (eng / maxEng) * cH;
  const midX = pad.l + cW / 2;
  const midY = y(avgEng);

  const dotColor = (d: TopicEngagement) => {
    const highEng = d.averageEngagement > avgEng;
    const inc = d.frequencyTrend === 'increasing';
    if (highEng && inc) return '#B5704D'; // reinforced — umber
    if (!highEng && d.frequencyTrend !== 'decreasing') return '#6B8F71'; // persisted — sage
    if (!highEng && d.frequencyTrend === 'decreasing') return '#C8B8A8'; // faded — trace
    return '#DDD5CA'; // resisted — light trace
  };

  return (
    <div className="my-6 surface-quiet">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: `${h}px` }} role="img" aria-label="The selection landscape: engagement vs frequency change">
        {/* Quadrant backgrounds */}
        <rect x={midX} y={pad.t} width={cW / 2 + pad.r - 20} height={midY - pad.t} fill="#FDF8F4" opacity={0.5} rx={8} />
        <rect x={pad.l} y={midY} width={midX - pad.l} height={pad.t + cH - midY} fill="#EAE5DD" opacity={0.3} rx={8} />
        <rect x={midX} y={midY} width={cW / 2 + pad.r - 20} height={pad.t + cH - midY} fill="#E3EDE5" opacity={0.3} rx={8} />

        {/* Quadrant labels */}
        <text x={pad.l + 8} y={pad.t + 16} fill="#B5AEA5" fontSize={10}>resisted reward</text>
        <text x={w - pad.r - 8} y={pad.t + 16} fill="#B5AEA5" fontSize={10} textAnchor="end">reinforced</text>
        <text x={pad.l + 8} y={pad.t + cH - 4} fill="#B5AEA5" fontSize={10}>faded</text>
        <text x={w - pad.r - 8} y={pad.t + cH - 4} fill="#B5AEA5" fontSize={10} textAnchor="end">persisted</text>

        {/* Center lines */}
        <line x1={midX} y1={pad.t} x2={midX} y2={pad.t + cH} stroke="#E4DFD7" strokeWidth={1} strokeDasharray="4 4" />
        <line x1={pad.l} y1={midY} x2={w - pad.r} y2={midY} stroke="#E4DFD7" strokeWidth={1} strokeDasharray="4 4" />

        {/* Data dots */}
        {data.map((d, i) => {
          // Add jitter for stable topics so they don't stack
          const jitter = (i * 17) % 30 - 15;
          const cx = x(d.frequencyTrend) + (d.frequencyTrend === 'stable' ? jitter : 0);
          const cy = y(d.averageEngagement);
          return (
            <g key={d.topic}>
              <circle cx={cx} cy={cy} r={Math.min(4 + d.postCount * 0.3, 12)} fill={dotColor(d)} opacity={0.75} />
              <text x={cx} y={cy - Math.min(4 + d.postCount * 0.3, 12) - 4} textAnchor="middle" fill="#5C534A" fontSize={10}>{d.topic}</text>
            </g>
          );
        })}

        {/* Axis labels */}
        <text x={pad.l} y={h - 8} fill="#B5AEA5" fontSize={10}>decreased</text>
        <text x={w / 2} y={h - 8} fill="#B5AEA5" fontSize={10} textAnchor="middle">frequency change</text>
        <text x={w - pad.r} y={h - 8} fill="#B5AEA5" fontSize={10} textAnchor="end">increased</text>
      </svg>
    </div>
  );
}
