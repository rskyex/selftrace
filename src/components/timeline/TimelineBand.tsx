'use client';

import type { TimeSeriesPoint } from '@/lib/data/types';

export function TimelineBand({ data }: { data: TimeSeriesPoint[] }) {
  if (data.length === 0) return null;
  const w = 1000, h = 80, pad = { t: 8, r: 16, b: 20, l: 16 };
  const cW = w - pad.l - pad.r, cH = h - pad.t - pad.b;
  const maxV = Math.max(...data.map(d => d.value), 1);
  const x = (i: number) => pad.l + (i / (data.length - 1)) * cW;
  const y = (v: number) => pad.t + cH - (v / maxV) * cH;
  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.value)}`).join(' ');
  const area = `${line} L ${x(data.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;
  const step = Math.max(1, Math.floor(data.length / 7));

  return (
    <div className="w-full surface-quiet rounded-none px-0">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: '80px' }} role="img" aria-label="Posting density">
        <path d={area} fill="#EAE5DD" opacity={0.8} />
        <path d={line} fill="none" stroke="#C8B8A8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => {
          if (i % step !== 0 && i !== data.length - 1) return null;
          const dt = new Date(d.date);
          return <text key={i} x={x(i)} y={h - 3} textAnchor="middle" fill="#B5AEA5" fontSize={10}>{`${dt.toLocaleString('en', { month: 'short' })} '${dt.getFullYear().toString().slice(2)}`}</text>;
        })}
      </svg>
    </div>
  );
}
