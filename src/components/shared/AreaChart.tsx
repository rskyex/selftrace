'use client';

import type { TimeSeriesPoint } from '@/lib/data/types';
import { EpistemicBadge } from './EpistemicBadge';
import type { EpistemicStatus } from '@/lib/data/types';

interface AreaChartProps {
  data: TimeSeriesPoint[];
  caption: string;
  status: EpistemicStatus;
  height?: number;
  color?: 'teal' | 'amber' | 'charcoal';
  showLabels?: boolean;
}

export function AreaChart({
  data,
  caption,
  status,
  height = 200,
  color = 'teal',
  showLabels = true,
}: AreaChartProps) {
  if (data.length === 0) return null;

  const width = 800;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
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
    teal: { stroke: '#1A5C52', fill: '#E0F2EE' },
    amber: { stroke: '#A16207', fill: '#FDF6E3' },
    charcoal: { stroke: '#44403C', fill: '#E8E3DB' },
  };

  const labelStep = Math.max(1, Math.floor(data.length / 5));

  // Screen reader description
  const firstDate = new Date(data[0].date).toLocaleDateString('en', { month: 'short', year: 'numeric' });
  const lastDate = new Date(data[data.length - 1].date).toLocaleDateString('en', { month: 'short', year: 'numeric' });
  const firstVal = data[0].value;
  const lastVal = data[data.length - 1].value;
  const srDesc = `Chart showing ${data.length} data points from ${firstDate} to ${lastDate}. Values range from ${Math.round(minVal * 10) / 10} to ${Math.round(maxVal * 10) / 10}. First value: ${Math.round(firstVal * 10) / 10}, last value: ${Math.round(lastVal * 10) / 10}.`;

  return (
    <div className="my-6" role="figure" aria-label={caption}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ maxHeight: `${height}px` }}
        role="img"
        aria-label={srDesc}
      >
        <title>{srDesc}</title>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(frac => {
          const y = padding.top + chartH * (1 - frac);
          const val = minVal + range * frac;
          return (
            <g key={frac}>
              <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#E8E3DB" strokeWidth={1} />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" className="font-interface" fill="#78716C" fontSize={10} aria-hidden="true">
                {Math.round(val * 10) / 10}
              </text>
            </g>
          );
        })}

        {/* Area */}
        <path d={areaPath} fill={colors[color].fill} opacity={0.5} />
        <path d={linePath} fill="none" stroke={colors[color].stroke} strokeWidth={2} />

        {/* Dots */}
        {data.map((d, i) => (
          <circle key={i} cx={xScale(i)} cy={yScale(d.value)} r={2.5} fill={colors[color].stroke} />
        ))}

        {/* X-axis labels */}
        {showLabels && data.map((d, i) => {
          if (i % labelStep !== 0 && i !== data.length - 1) return null;
          const date = new Date(d.date);
          const label = `${date.toLocaleString('en', { month: 'short' })} ${date.getFullYear().toString().slice(2)}`;
          return (
            <text key={i} x={xScale(i)} y={height - 8} textAnchor="middle" className="font-interface" fill="#78716C" fontSize={10} aria-hidden="true">
              {label}
            </text>
          );
        })}
      </svg>
      <div className="flex items-baseline gap-2 mt-2 px-1">
        <p className="text-[13px] italic text-charcoal-500 leading-relaxed">{caption}</p>
        <EpistemicBadge status={status} />
      </div>
    </div>
  );
}
