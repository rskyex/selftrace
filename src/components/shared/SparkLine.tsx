'use client';

import type { TimeSeriesPoint } from '@/lib/data/types';

/** Small trend line. Its accessible name lists the values it draws, in order. */
export function SparkLine({ data, width = 90, height = 24, color = '#B5704D' }: {
  data: TimeSeriesPoint[]; width?: number; height?: number; color?: string;
}) {
  if (data.length < 2) return null;
  const p = 2, maxV = Math.max(...data.map(d => d.value)), minV = Math.min(...data.map(d => d.value)), r = maxV - minV || 1;
  const pts = data.map((d, i) => `${p + (i / (data.length - 1)) * (width - p * 2)},${p + (1 - (d.value - minV) / r) * (height - p * 2)}`).join(' ');
  const label = `Trend over ${data.length} periods: ${data.map(d => d.value).join(', ')}`;
  return <svg width={width} height={height} className="inline-block" role="img" aria-label={label}><polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
