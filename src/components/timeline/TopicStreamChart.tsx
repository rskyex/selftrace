'use client';

import type { TopicOverTime } from '@/lib/data/types';

interface TopicStreamChartProps {
  data: TopicOverTime[];
}

const TOPIC_COLORS = [
  '#6366F1', '#818CF8', '#3D3D3D', '#6B6B6B',
  '#D97706', '#40916C', '#B8B8B8', '#4338CA',
];

export function TopicStreamChart({ data }: TopicStreamChartProps) {
  if (data.length === 0) return null;

  const months = data[0].series.map(p => p.date);
  const width = 900;
  const height = 280;
  const padding = { top: 20, right: 140, bottom: 40, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const stacked: number[][] = months.map((_, mi) => {
    return data.map(topic => topic.series[mi]?.value ?? 0);
  });

  const maxStacked = Math.max(
    ...stacked.map(monthVals => monthVals.reduce((s, v) => s + v, 0)),
    1
  );

  const xScale = (i: number) => padding.left + (i / Math.max(months.length - 1, 1)) * chartW;
  const yScale = (v: number) => padding.top + chartH - (v / maxStacked) * chartH;

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
    <div className="my-6 card-elevated p-5">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ maxHeight: `${height}px` }}
        role="img"
        aria-label={`Topic distribution over ${months.length} months across ${data.length} topics.`}
      >
        <title>Topic distribution over time</title>
        {areas.map((path, i) => (
          <path key={i} d={path} fill={TOPIC_COLORS[i % TOPIC_COLORS.length]} opacity={0.5} />
        ))}

        {months.map((date, i) => {
          if (i % labelStep !== 0 && i !== months.length - 1) return null;
          const d = new Date(date);
          const label = `${d.toLocaleString('en', { month: 'short' })} '${d.getFullYear().toString().slice(2)}`;
          return (
            <text key={i} x={xScale(i)} y={height - 8} textAnchor="middle" fill="#8F8F8F" fontSize={10} aria-hidden="true">
              {label}
            </text>
          );
        })}

        {data.slice(0, 6).map((topic, i) => (
          <g key={topic.topic} transform={`translate(${width - padding.right + 12}, ${padding.top + i * 20})`}>
            <rect width={12} height={12} rx={3} fill={TOPIC_COLORS[i % TOPIC_COLORS.length]} opacity={0.5} />
            <text x={18} y={10} fill="#6B6B6B" fontSize={11}>
              {topic.topic}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
