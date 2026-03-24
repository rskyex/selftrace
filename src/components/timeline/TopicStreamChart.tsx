'use client';

import type { TopicOverTime } from '@/lib/data/types';

const COLORS = ['#B5704D', '#6B8F71', '#C8B8A8', '#5C534A', '#8F5A35', '#D2E4D5', '#DDD5CA', '#8A8179'];

export function TopicStreamChart({ data }: { data: TopicOverTime[] }) {
  if (data.length === 0) return null;
  const months = data[0].series.map(p => p.date);
  const w = 740, h = 240, pad = { t: 12, r: 120, b: 32, l: 36 };
  const cW = w - pad.l - pad.r, cH = h - pad.t - pad.b;
  const stacked: number[][] = months.map((_, mi) => data.map(t => t.series[mi]?.value ?? 0));
  const maxS = Math.max(...stacked.map(m => m.reduce((s, v) => s + v, 0)), 1);
  const x = (i: number) => pad.l + (i / Math.max(months.length - 1, 1)) * cW;
  const y = (v: number) => pad.t + cH - (v / maxS) * cH;

  const areas = data.map((_, ti) => {
    const bot = months.map((_, mi) => { let s = 0; for (let t = 0; t < ti; t++) s += stacked[mi][t]; return s; });
    const top = bot.map((b, mi) => b + stacked[mi][ti]);
    return months.map((_, mi) => `${mi === 0 ? 'M' : 'L'} ${x(mi)} ${y(top[mi])}`).join(' ') + ' ' +
      months.map((_, mi) => `L ${x(months.length - 1 - mi)} ${y(bot[months.length - 1 - mi])}`).join(' ') + ' Z';
  });

  const step = Math.max(1, Math.floor(months.length / 6));

  return (
    <div className="my-6 surface-quiet">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: `${h}px` }} role="img" aria-label="Topic distribution">
        {areas.map((d, i) => <path key={i} d={d} fill={COLORS[i % COLORS.length]} opacity={0.35} />)}
        {months.map((date, i) => {
          if (i % step !== 0 && i !== months.length - 1) return null;
          const d = new Date(date);
          return <text key={i} x={x(i)} y={h - 5} textAnchor="middle" fill="#B5AEA5" fontSize={10}>{`${d.toLocaleString('en', { month: 'short' })} '${d.getFullYear().toString().slice(2)}`}</text>;
        })}
        {data.slice(0, 6).map((topic, i) => (
          <g key={topic.topic} transform={`translate(${w - pad.r + 10}, ${pad.t + i * 20})`}>
            <rect width={12} height={12} rx={6} fill={COLORS[i % COLORS.length]} opacity={0.45} />
            <text x={18} y={10} fill="#5C534A" fontSize={11}>{topic.topic}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
