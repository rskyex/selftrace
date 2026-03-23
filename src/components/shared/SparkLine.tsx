'use client';

import type { TimeSeriesPoint } from '@/lib/data/types';

interface SparkLineProps {
  data: TimeSeriesPoint[];
  width?: number;
  height?: number;
  color?: string;
  label?: string;
}

export function SparkLine({
  data,
  width = 120,
  height = 32,
  color = '#1A5C52',
  label,
}: SparkLineProps) {
  if (data.length < 2) return null;

  const padding = 2;
  const maxVal = Math.max(...data.map(d => d.value));
  const minVal = Math.min(...data.map(d => d.value));
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = padding + (1 - (d.value - minVal) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <span className="inline-flex items-center gap-2">
      {label && (
        <span className="font-interface text-[11px] text-charcoal-500">{label}</span>
      )}
      <svg width={width} height={height} className="inline-block">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
        />
      </svg>
    </span>
  );
}
