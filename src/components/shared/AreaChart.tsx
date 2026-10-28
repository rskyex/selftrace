'use client';

import type { TimeSeriesPoint } from '@/lib/data/types';
import { ConfidenceDot } from './ConfidenceDot';
import { ChartDataTable, monthLabel } from '@/components/shared/ChartDataTable';

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
  const shown = data.filter(d => !d.missing);
  const maxV = Math.max(...shown.map(d => d.value), 1);
  const minV = Math.min(...shown.map(d => d.value), 0);
  const range = maxV - minV || 1;

  const x = (i: number) => pad.l + (data.length > 1 ? i / (data.length - 1) : 0.5) * cW;
  const y = (v: number) => pad.t + cH - ((v - minV) / range) * cH;

  // Missing points (too few posts) break the line instead of being drawn as 0
  const runs: number[][] = [];
  data.forEach((d, i) => {
    if (d.missing) return;
    if (i > 0 && !data[i - 1].missing && runs.length) runs[runs.length - 1].push(i);
    else runs.push([i]);
  });
  const lineOf = (run: number[]) => run.map((i, k) => `${k === 0 ? 'M' : 'L'} ${x(i)} ${y(data[i].value)}`).join(' ');
  const areaOf = (run: number[]) => `${lineOf(run)} L ${x(run[run.length - 1])} ${y(minV)} L ${x(run[0])} ${y(minV)} Z`;
  const hasN = data.some(d => d.n !== undefined);

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
          {runs.map(run => <path key={`a${run[0]}`} d={areaOf(run)} fill={c[color].f} opacity={0.7} />)}
          {runs.map(run => run.length > 1
            ? <path key={`l${run[0]}`} d={lineOf(run)} fill="none" stroke={c[color].s} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            : <circle key={`l${run[0]}`} cx={x(run[0])} cy={y(data[run[0]].value)} r={3} fill={c[color].s} />)}
          {data.map((d, i) => {
            if (i % step !== 0 && i !== data.length - 1) return null;
            const dt = new Date(d.date);
            return <text key={i} x={x(i)} y={height - 4} textAnchor="middle" fill="#B5AEA5" fontSize={11}>{`${dt.toLocaleString('en', { timeZone: 'UTC', month: 'short' })} '${dt.getUTCFullYear().toString().slice(2)}`}</text>;
          })}
        </svg>
      </div>
      <ChartDataTable caption={caption || 'Chart data'} columns={hasN ? ['Period', 'Value', 'n'] : ['Period', 'Value']}
        rows={data.map(d => {
          const v = d.missing ? '—' : d.value;
          return hasN ? [monthLabel(d.date), v, d.n ?? '—'] : [monthLabel(d.date), v];
        })} />
      {(caption || confidence) && (
        <div className="flex items-center gap-2 mt-2.5 px-1">
          {confidence && <ConfidenceDot level={confidence} />}
          {caption && <p className="font-sans text-[12px] text-ink-400">{caption}</p>}
        </div>
      )}
    </div>
  );
}
