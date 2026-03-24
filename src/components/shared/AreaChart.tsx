'use client';

import type { TimeSeriesPoint } from '@/lib/data/types';
import { ConfidenceDot } from './ConfidenceDot';

interface AreaChartProps {
  data: TimeSeriesPoint[];
  caption?: string;
  confidence?: 'high' | 'medium' | 'low';
  height?: number;
  color?: 'violet' | 'coral' | 'sage' | 'ink';
}

export function AreaChart({
  data,
  caption,
  confidence,
  height = 200,
  color = 'violet',
}: AreaChartProps) {
  if (data.length === 0) return null;

  const width = 700;
  const pad = { top: 20, right: 16, bottom: 36, left: 40 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;

  const maxV = Math.max(...data.map(d => d.value), 1);
  const minV = Math.min(...data.map(d => d.value), 0);
  const range = maxV - minV || 1;

  const x = (i: number) => pad.left + (i / (data.length - 1)) * cW;
  const y = (v: number) => pad.top + cH - ((v - minV) / range) * cH;

  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.value)}`).join(' ');
  const area = `${line} L ${x(data.length - 1)} ${y(minV)} L ${x(0)} ${y(minV)} Z`;

  const colors = {
    violet: { stroke: '#8B5CF6', fill: '#F5F3FF' },
    coral: { stroke: '#DC6843', fill: '#FFF5EE' },
    sage: { stroke: '#6B9E7D', fill: '#E0F0E5' },
    ink: { stroke: '#736E68', fill: '#F0ECE5' },
  };

  const step = Math.max(1, Math.floor(data.length / 5));

  return (
    <div className="my-6">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: `${height + 16}px` }} role="img" aria-label={caption || 'Chart'}>
        {[0, 0.5, 1].map(frac => {
          const yy = pad.top + cH * (1 - frac);
          return <line key={frac} x1={pad.left} x2={width - pad.right} y1={yy} y2={yy} stroke="#F0ECE5" strokeWidth={1} />;
        })}
        <path d={area} fill={colors[color].fill} opacity={0.7} />
        <path d={line} fill="none" stroke={colors[color].stroke} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => {
          if (i % step !== 0 && i !== data.length - 1) return null;
          const date = new Date(d.date);
          const label = `${date.toLocaleString('en', { month: 'short' })} '${date.getFullYear().toString().slice(2)}`;
          return <text key={i} x={x(i)} y={height - 6} textAnchor="middle" fill="#9B958E" fontSize={11} aria-hidden="true">{label}</text>;
        })}
      </svg>
      {(caption || confidence) && (
        <div className="flex items-center gap-2 mt-2">
          {confidence && <ConfidenceDot level={confidence} />}
          {caption && <p className="font-sans text-[13px] text-ink-400">{caption}</p>}
        </div>
      )}
    </div>
  );
}
