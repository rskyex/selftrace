'use client';

import type { TimeSeriesPoint } from '@/lib/data/types';
import { ConfidenceDot } from './ConfidenceDot';

interface AreaChartProps {
  data: TimeSeriesPoint[];
  caption?: string;
  confidence?: 'counted' | 'patterned' | 'interpretive';
  height?: number;
  color?: 'umber' | 'sage' | 'trace' | 'ink';
}

export function AreaChart({ data, caption, confidence, height = 180, color = 'umber' }: AreaChartProps) {
  if (data.length === 0) return null;

  const w = 660, pad = { t: 16, r: 12, b: 32, l: 36 };
  const cW = w - pad.l - pad.r, cH = height - pad.t - pad.b;
  const maxV = Math.max(...data.map(d => d.value), 1);
  const minV = Math.min(...data.map(d => d.value), 0);
  const range = maxV - minV || 1;

  const x = (i: number) => pad.l + (i / (data.length - 1)) * cW;
  const y = (v: number) => pad.t + cH - ((v - minV) / range) * cH;

  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.value)}`).join(' ');
  const area = `${line} L ${x(data.length - 1)} ${y(minV)} L ${x(0)} ${y(minV)} Z`;

  const c = {
    umber: { s: '#B5704D', f: '#FDF8F4' },
    sage: { s: '#6B8F71', f: '#E3EDE5' },
    trace: { s: '#C8B8A8', f: '#EAE5DD' },
    ink: { s: '#8A8179', f: '#F0EDE6' },
  };
  const step = Math.max(1, Math.floor(data.length / 5));

  return (
    <div className="my-6">
      <div className="surface-quiet">
        <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ maxHeight: `${height + 12}px` }} role="img" aria-label={caption || 'Chart'}>
          {[0, 0.5, 1].map(f => <line key={f} x1={pad.l} x2={w - pad.r} y1={pad.t + cH * (1 - f)} y2={pad.t + cH * (1 - f)} stroke="#E4DFD7" strokeWidth={1} />)}
          <path d={area} fill={c[color].f} opacity={0.7} />
          <path d={line} fill="none" stroke={c[color].s} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          {data.map((d, i) => {
            if (i % step !== 0 && i !== data.length - 1) return null;
            const dt = new Date(d.date);
            return <text key={i} x={x(i)} y={height - 4} textAnchor="middle" fill="#B5AEA5" fontSize={11}>{`${dt.toLocaleString('en', { month: 'short' })} '${dt.getFullYear().toString().slice(2)}`}</text>;
          })}
        </svg>
      </div>
      {(caption || confidence) && (
        <div className="flex items-center gap-2 mt-2.5 px-1">
          {confidence && <ConfidenceDot level={confidence} />}
          {caption && <p className="font-sans text-[12px] text-ink-400">{caption}</p>}
        </div>
      )}
    </div>
  );
}
