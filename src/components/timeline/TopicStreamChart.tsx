'use client';

import type { TopicOverTime } from '@/lib/data/types';
import { EpistemicBadge } from '../shared/EpistemicBadge';

interface TopicStreamChartProps {
  data: TopicOverTime[];
}

const TOPIC_COLORS = [
  '#1A5C52', '#2D8A7A', '#44403C', '#78716C',
  '#A16207', '#B8DDD5', '#D6D3D1', '#52525B',
];

export function TopicStreamChart({ data }: TopicStreamChartProps) {
  if (data.length === 0) return null;

  const months = data[0].series.map(p => p.date);
  const width = 900;
  const height = 280;
  const padding = { top: 20, right: 140, bottom: 40, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Compute stacked values per month
  const stacked: number[][] = months.map((_, mi) => {
    return data.map(topic => topic.series[mi]?.value ?? 0);
  });

  const maxStacked = Math.max(
    ...stacked.map(monthVals => monthVals.reduce((s, v) => s + v, 0)),
    1
  );

  const xScale = (i: number) => padding.left + (i / Math.max(months.length - 1, 1)) * chartW;
  const yScale = (v: number) => padding.top + chartH - (v / maxStacked) * chartH;

  // Build stacked area paths
  const areas = data.map((_, topicIdx) => {
    const bottomValues = months.map((_, mi) => {
      let sum = 0;
      for (let t = 0; t < topicIdx; t++) {
        sum += stacked[mi][t];
      }
      return sum;
    });

    const topValues = bottomValues.map((bv, mi) => bv + stacked[mi][topicIdx]);

    const topLine = months.map((_, mi) => `${mi === 0 ? 'M' : 'L'} ${xScale(mi)} ${yScale(topValues[mi])}`).join(' ');
    const bottomLine = months.map((_, mi) => `L ${xScale(months.length - 1 - mi)} ${yScale(bottomValues[months.length - 1 - mi])}`).join(' ');

    return `${topLine} ${bottomLine} Z`;
  });

  const labelStep = Math.max(1, Math.floor(months.length / 6));

  return (
    <div className="my-6">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: `${height}px` }} role="img" aria-label={`Stacked area chart showing topic distribution over ${months.length} months across ${data.length} topics: ${data.map(d => d.topic).join(', ')}.`}>
        <title>Topic distribution over time showing how topic proportions change across the observed period.</title>
        {areas.map((path, i) => (
          <path
            key={i}
            d={path}
            fill={TOPIC_COLORS[i % TOPIC_COLORS.length]}
            opacity={0.6}
          />
        ))}

        {/* X-axis labels */}
        {months.map((date, i) => {
          if (i % labelStep !== 0 && i !== months.length - 1) return null;
          const d = new Date(date);
          const label = `${d.toLocaleString('en', { month: 'short' })} '${d.getFullYear().toString().slice(2)}`;
          return (
            <text key={i} x={xScale(i)} y={height - 8} textAnchor="middle" fill="#78716C" fontSize={10} fontFamily="Arial, sans-serif">
              {label}
            </text>
          );
        })}

        {/* Legend */}
        {data.slice(0, 6).map((topic, i) => (
          <g key={topic.topic} transform={`translate(${width - padding.right + 12}, ${padding.top + i * 18})`}>
            <rect width={10} height={10} fill={TOPIC_COLORS[i % TOPIC_COLORS.length]} opacity={0.6} />
            <text x={14} y={9} fill="#78716C" fontSize={10} fontFamily="Arial, sans-serif">
              {topic.topic}
            </text>
          </g>
        ))}
      </svg>

      <div className="flex items-baseline gap-2 mt-2 px-1">
        <p className="text-[13px] italic text-charcoal-500">
          Topic distribution over time. Converging streams may indicate narrowing focus.
        </p>
        <EpistemicBadge status="inferred" />
      </div>
    </div>
  );
}
