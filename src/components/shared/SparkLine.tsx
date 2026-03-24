'use client';

import type { TimeSeriesPoint } from '@/lib/data/types';

interface SparkLineProps {
  data: TimeSeriesPoint[];
  width?: number;
  height?: number;
  color?: string;
}

export function SparkLine({ data, width = 100, height = 28, color = '#8B5CF6' }: SparkLineProps) {
  if (data.length < 2) return null;

  const pad = 2;
  const maxV = Math.max(...data.map(d => d.value));
  const minV = Math.min(...data.map(d => d.value));
  const range = maxV - minV || 1;

  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (d.value - minV) / range) * (height - pad * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="inline-block" aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
