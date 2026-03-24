'use client';

import type { TimeSeriesPoint } from '@/lib/data/types';

interface TimelineBandProps {
  data: TimeSeriesPoint[];
}

export function TimelineBand({ data }: TimelineBandProps) {
  if (data.length === 0) return null;

  const width = 1200;
  const height = 90;
  const pad = { top: 8, right: 20, bottom: 22, left: 20 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;

  const maxV = Math.max(...data.map(d => d.value), 1);

  const x = (i: number) => pad.left + (i / (data.length - 1)) * cW;
  const y = (v: number) => pad.top + cH - (v / maxV) * cH;

  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.value)}`).join(' ');
  const area = `${line} L ${x(data.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;

  const step = Math.max(1, Math.floor(data.length / 8));

  return (
    <div className="w-full bg-white border-y border-warm-200 my-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height: '90px' }} role="img" aria-label="Posting density over time">
        <path d={area} fill="#F5F3FF" opacity={0.8} />
        <path d={line} fill="none" stroke="#8B5CF6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => {
          if (i % step !== 0 && i !== data.length - 1) return null;
          const date = new Date(d.date);
          const label = `${date.toLocaleString('en', { month: 'short' })} '${date.getFullYear().toString().slice(2)}`;
          return <text key={i} x={x(i)} y={height - 3} textAnchor="middle" fill="#9B958E" fontSize={10} aria-hidden="true">{label}</text>;
        })}
      </svg>
    </div>
  );
}
