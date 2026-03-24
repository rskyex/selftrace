'use client';

import type { TimeSeriesPoint } from '@/lib/data/types';
import { EpistemicBadge } from './EpistemicBadge';
import type { EpistemicStatus } from '@/lib/data/types';

interface AreaChartProps {
  data: TimeSeriesPoint[];
  caption: string;
  status: EpistemicStatus;
  height?: number;
  color?: 'accent' | 'amber' | 'charcoal' | 'teal';
  showLabels?: boolean;
}

export function AreaChart({
  data,
  caption,
  status,
  height = 220,
  color = 'accent',
  showLabels = true,
}: AreaChartProps) {
  if (data.length === 0) return null;

  const width = 800;
  const padding = { top: 24, right: 20, bottom: 44, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const minVal = Math.min(...data.map(d => d.value), 0);
  const range = maxVal - minVal || 1;

  const xScale = (i: number) => padding.left + (i / (data.length - 1)) * chartW;
  const yScale = (v: number) => padding.top + chartH - ((v - minVal) / range) * chartH;

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.value)}`).join(' ');
  const areaPath = `${linePath} L ${xScale(data.length - 1)} ${yScale(minVal)} L ${xScale(0)} ${yScale(minVal)} Z`;

  const colors = {
    accent: { stroke: '#6366F1', fill: '#EEF2FF' },
    teal: { stroke: '#2D8A7A', fill: '#E0F2EE' },
    amber: { stroke: '#D97706', fill: '#FEF3C7' },
    charcoal: { stroke: '#3D3D3D', fill: '#ECEAE4' },
  };

  const labelStep = Math.max(1, Math.floor(data.length / 5));

  const firstDate = new Date(data[0].date).toLocaleDateString('en', { month: 'short', year: 'numeric' });
  const lastDate = new Date(data[data.length - 1].date).toLocaleDateString('en', { month: 'short', year: 'numeric' });
  const srDesc = `Chart from ${firstDate} to ${lastDate}. Range: ${Math.round(minVal * 10) / 10} to ${Math.round(maxVal * 10) / 10}.`;

  return (
    <div className="my-6 card-elevated p-5" role="figure" aria-label={caption}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ maxHeight: `${height + 20}px` }}
        role="img"
        aria-label={srDesc}
      >
        <title>{srDesc}</title>
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map(frac => {
          const y = padding.top + chartH * (1 - frac);
          const val = minVal + range * frac;
          return (
            <g key={frac}>
              <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#ECEAE4" strokeWidth={1} />
              <text x={padding.left - 10} y={y + 4} textAnchor="end" fill="#8F8F8F" fontSize={11} aria-hidden="true">
                {Math.round(val * 10) / 10}
              </text>
            </g>
          );
        })}

        {/* Area + line */}
        <path d={areaPath} fill={colors[color].fill} opacity={0.6} />
        <path d={linePath} fill="none" stroke={colors[color].stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {data.map((d, i) => (
          <circle key={i} cx={xScale(i)} cy={yScale(d.value)} r={2.5} fill={colors[color].stroke} />
        ))}

        {/* X labels */}
        {showLabels && data.map((d, i) => {
          if (i % labelStep !== 0 && i !== data.length - 1) return null;
          const date = new Date(d.date);
          const label = `${date.toLocaleString('en', { month: 'short' })} ${date.getFullYear().toString().slice(2)}`;
          return (
            <text key={i} x={xScale(i)} y={height - 10} textAnchor="middle" fill="#8F8F8F" fontSize={11} aria-hidden="true">
              {label}
            </text>
          );
        })}
      </svg>
      <div className="flex items-center gap-3 mt-3">
        <p className="text-[13px] text-charcoal-500">{caption}</p>
        <EpistemicBadge status={status} />
      </div>
    </div>
  );
}
