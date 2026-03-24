'use client';

import type { TopicOverTime } from '@/lib/data/types';

const COLORS = ['#8B5CF6', '#A78BFA', '#DC6843', '#6B9E7D', '#736E68', '#DDD6FE', '#C4BEB6', '#4A4541'];

interface TopicStreamChartProps {
  data: TopicOverTime[];
}

export function TopicStreamChart({ data }: TopicStreamChartProps) {
  if (data.length === 0) return null;

  const months = data[0].series.map(p => p.date);
  const width = 800;
  const height = 260;
  const pad = { top: 16, right: 130, bottom: 36, left: 40 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;

  const stacked: number[][] = months.map((_, mi) => data.map(t => t.series[mi]?.value ?? 0));
  const maxS = Math.max(...stacked.map(m => m.reduce((s, v) => s + v, 0)), 1);

  const x = (i: number) => pad.left + (i / Math.max(months.length - 1, 1)) * cW;
  const y = (v: number) => pad.top + cH - (v / maxS) * cH;

  const areas = data.map((_, ti) => {
    const bot = months.map((_, mi) => {
      let s = 0;
      for (let t = 0; t < ti; t++) s += stacked[mi][t];
      return s;
    });
    const top = bot.map((b, mi) => b + stacked[mi][ti]);
    const topLine = months.map((_, mi) => `${mi === 0 ? 'M' : 'L'} ${x(mi)} ${y(top[mi])}`).join(' ');
    const botLine = months.map((_, mi) => `L ${x(months.length - 1 - mi)} ${y(bot[months.length - 1 - mi])}`).join(' ');
    return `${topLine} ${botLine} Z`;
  });

  const step = Math.max(1, Math.floor(months.length / 6));

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: `${height}px` }} role="img" aria-label="Topic distribution over time">
        {areas.map((d, i) => <path key={i} d={d} fill={COLORS[i % COLORS.length]} opacity={0.45} />)}
        {months.map((date, i) => {
          if (i % step !== 0 && i !== months.length - 1) return null;
          const d = new Date(date);
          return <text key={i} x={x(i)} y={height - 6} textAnchor="middle" fill="#9B958E" fontSize={10} aria-hidden="true">{`${d.toLocaleString('en', { month: 'short' })} '${d.getFullYear().toString().slice(2)}`}</text>;
        })}
        {data.slice(0, 6).map((topic, i) => (
          <g key={topic.topic} transform={`translate(${width - pad.right + 10}, ${pad.top + i * 20})`}>
            <rect width={12} height={12} rx={4} fill={COLORS[i % COLORS.length]} opacity={0.5} />
            <text x={18} y={10} fill="#736E68" fontSize={11}>{topic.topic}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
