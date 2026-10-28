'use client';

import type { TopicEngagement } from '@/lib/data/types';
import { ChartDataTable } from '@/components/shared/ChartDataTable';
import { isRewardedAndRising } from '@/lib/analysis/definitions';

/**
 * The Selection Landscape — a scatter field.
 * X = change in the topic's share of posts between the two equal-time halves (points).
 * Y = time-adjusted engagement (median of post ÷ month median; 1 = typical).
 * Quadrants: reinforced (upper-right), faded (lower-left),
 * persisted/self-governed (lower-right), resisted (upper-left).
 * Colours follow the flags in src/lib/analysis/definitions.ts.
 */
export function SelectionLandscape({ data }: { data: TopicEngagement[] }) {
  if (data.length === 0) return null;

  const w = 660, h = 400, pad = { t: 40, r: 40, b: 50, l: 50 };
  const cW = w - pad.l - pad.r, cH = h - pad.t - pad.b;

  // Log scale so 0.5× and 2× sit equally far from 1×
  const maxLog = Math.max(...data.map(d => Math.abs(Math.log2(Math.max(d.rewardRatio, 0.05)))), 1);
  const maxPp = Math.max(...data.map(d => Math.abs(d.shareChangePp)), 1);

  const x = (pp: number) => pad.l + ((pp / maxPp + 1) / 2) * cW;
  const y = (ratio: number) => pad.t + cH / 2 - (Math.log2(Math.max(ratio, 0.05)) / maxLog) * (cH / 2);
  const midX = x(0);
  const midY = y(1);

  const dotColor = (d: TopicEngagement) => {
    if (isRewardedAndRising(d)) return '#B5704D'; // reinforced — umber
    if (d.kept) return '#6B8F71'; // persisted — sage
    if (d.faded) return '#C8B8A8'; // faded — trace
    return '#DDD5CA'; // other — light trace
  };

  return (
    <div className="my-6 surface-quiet">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: `${h}px` }} role="img" aria-label="The selection landscape: time-adjusted engagement vs change in share of posts">
        {/* Quadrant backgrounds */}
        <rect x={midX} y={pad.t} width={w - pad.r - midX} height={midY - pad.t} fill="#FDF8F4" opacity={0.5} rx={8} />
        <rect x={pad.l} y={midY} width={midX - pad.l} height={pad.t + cH - midY} fill="#EAE5DD" opacity={0.3} rx={8} />
        <rect x={midX} y={midY} width={w - pad.r - midX} height={pad.t + cH - midY} fill="#E3EDE5" opacity={0.3} rx={8} />

        {/* Quadrant labels */}
        <text x={pad.l + 8} y={pad.t + 16} fill="#B5AEA5" fontSize={10}>resisted reward</text>
        <text x={w - pad.r - 8} y={pad.t + 16} fill="#B5AEA5" fontSize={10} textAnchor="end">reinforced</text>
        <text x={pad.l + 8} y={pad.t + cH - 4} fill="#B5AEA5" fontSize={10}>faded</text>
        <text x={w - pad.r - 8} y={pad.t + cH - 4} fill="#B5AEA5" fontSize={10} textAnchor="end">persisted</text>

        {/* Center lines: no change in share, typical engagement */}
        <line x1={midX} y1={pad.t} x2={midX} y2={pad.t + cH} stroke="#E4DFD7" strokeWidth={1} strokeDasharray="4 4" />
        <line x1={pad.l} y1={midY} x2={w - pad.r} y2={midY} stroke="#E4DFD7" strokeWidth={1} strokeDasharray="4 4" />
        <text x={pad.l - 6} y={midY + 3} fill="#B5AEA5" fontSize={9} textAnchor="end">1×</text>

        {/* Data dots */}
        {data.map(d => {
          const cx = x(d.shareChangePp);
          const cy = y(d.rewardRatio);
          const r = Math.min(4 + d.postCount * 0.1, 12);
          return (
            <g key={d.topic}>
              <circle cx={cx} cy={cy} r={r} fill={dotColor(d)} opacity={0.75} />
              {/* Small unclassed topics stay unlabelled to avoid overlap; all are in the data table */}
              {(d.postCount >= 20 || d.rewarded || d.kept || d.faded) && (
                <text x={cx} y={cy - r - 4} textAnchor="middle" fill="#5C534A" fontSize={10}>{d.topic}</text>
              )}
              <title>{`${d.topic}: ${d.rewardRatio.toFixed(2)}×, share change ${d.shareChangePp.toFixed(1)} points`}</title>
            </g>
          );
        })}

        {/* Axis labels */}
        <text x={pad.l} y={h - 8} fill="#B5AEA5" fontSize={10}>smaller share</text>
        <text x={w / 2} y={h - 8} fill="#B5AEA5" fontSize={10} textAnchor="middle">change in share of posts, earlier vs later half</text>
        <text x={w - pad.r} y={h - 8} fill="#B5AEA5" fontSize={10} textAnchor="end">larger share</text>
      </svg>
      <ChartDataTable caption="Time-adjusted engagement and share change per topic"
        columns={['Topic', 'Engagement vs typical', 'Posts', 'Share change (points)', '95% interval', 'Trend']}
        rows={data.map(d => [
          d.topic,
          `${d.rewardRatio.toFixed(2)}×`,
          d.postCount,
          d.shareChangePp.toFixed(1),
          `${d.shareChangeCI[0].toFixed(1)} to ${d.shareChangeCI[1].toFixed(1)}`,
          d.frequencyTrend,
        ])} />
    </div>
  );
}
