'use client';

import type { TimeSeriesPoint } from '@/lib/data/types';

/**
 * The Corridor — epistemic range over time.
 * Width at any point = topic diversity (entropy).
 * The user sees their world expanding or contracting.
 */
export function CorridorChart({ data }: { data: TimeSeriesPoint[] }) {
  if (data.length < 2) return null;

  const w = 700, h = 160, pad = { t: 20, r: 16, b: 28, l: 16 };
  const cW = w - pad.l - pad.r, cH = h - pad.t - pad.b;
  const maxV = Math.max(...data.map(d => d.value), 1);
  const midY = pad.t + cH / 2;

  const x = (i: number) => pad.l + (i / (data.length - 1)) * cW;
  const halfH = (v: number) => (v / maxV) * (cH / 2) * 0.85;

  // Upper edge (midY - halfH) and lower edge (midY + halfH)
  const upper = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${midY - halfH(d.value)}`).join(' ');
  const lower = data.map((d, i) => `L ${x(data.length - 1 - i)} ${midY + halfH(data[data.length - 1 - i].value)}`).join(' ');
  const shape = `${upper} ${lower} Z`;

  const step = Math.max(1, Math.floor(data.length / 6));

  return (
    <div className="my-6 surface-quiet">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: `${h}px` }} role="img" aria-label="Your epistemic range over time">
        <defs>
          <linearGradient id="corridor-fill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C8B8A8" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#C8B8A8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#C8B8A8" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <path d={shape} fill="url(#corridor-fill)" />
        <path d={upper} fill="none" stroke="#C8B8A8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => {
          const lower2 = midY + halfH(d.value);
          return <line key={i} x1={x(i)} y1={midY - halfH(d.value)} x2={x(i)} y2={lower2} stroke="#DDD5CA" strokeWidth={0.5} opacity={0.5} />;
        })}
        <line x1={pad.l} y1={midY} x2={w - pad.r} y2={midY} stroke="#E4DFD7" strokeWidth={1} strokeDasharray="4 4" />
        {data.map((d, i) => {
          if (i % step !== 0 && i !== data.length - 1) return null;
          const dt = new Date(d.date);
          return <text key={i} x={x(i)} y={h - 4} textAnchor="middle" fill="#B5AEA5" fontSize={10}>{`${dt.toLocaleString('en', { month: 'short' })} '${dt.getFullYear().toString().slice(2)}`}</text>;
        })}
      </svg>
    </div>
  );
}
