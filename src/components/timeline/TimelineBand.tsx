'use client';

import type { TimeSeriesPoint } from '@/lib/data/types';

interface TimelineBandProps {
  data: TimeSeriesPoint[];
}

export function TimelineBand({ data }: TimelineBandProps) {
  if (data.length === 0) return null;

  const width = 1200;
  const height = 100;
  const padding = { top: 10, right: 20, bottom: 24, left: 20 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map(d => d.value), 1);

  const xScale = (i: number) => padding.left + (i / (data.length - 1)) * chartW;
  const yScale = (v: number) => padding.top + chartH - (v / maxVal) * chartH;

  const linePath = data.map((d, i) =>
    `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.value)}`
  ).join(' ');

  const areaPath = `${linePath} L ${xScale(data.length - 1)} ${yScale(0)} L ${xScale(0)} ${yScale(0)} Z`;

  const labelStep = Math.max(1, Math.floor(data.length / 8));

  return (
    <div className="w-full bg-white border-y border-cream-200 my-6">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="none"
        style={{ height: '100px' }}
        role="img"
        aria-label={`Timeline showing posting density across ${data.length} months.`}
      >
        <title>Posting density over time</title>
        <path d={areaPath} fill="#EEF2FF" opacity={0.7} />
        <path d={linePath} fill="none" stroke="#6366F1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => {
          if (i % labelStep !== 0 && i !== data.length - 1) return null;
          const date = new Date(d.date);
          const label = `${date.toLocaleString('en', { month: 'short' })} '${date.getFullYear().toString().slice(2)}`;
          return (
            <text key={i} x={xScale(i)} y={height - 4} textAnchor="middle" fill="#8F8F8F" fontSize={10} aria-hidden="true">
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
