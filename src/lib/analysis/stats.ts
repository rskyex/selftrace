// ── Statistical helpers ───────────────────────────────────────────────────────
// Time-adjusted engagement, equal-time halves, seeded bootstrap intervals and
// small-sample-corrected entropy. All dates are handled in UTC.

import type { Post } from '@/lib/data/types';
import { createSeededRandom } from '@/lib/util/random';
import { DEFINITIONS } from './definitions';
import { UNCLASSIFIED } from './text/taxonomy';

export function median(xs: number[]): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const i = Math.min(sorted.length - 1, Math.max(0, Math.round(p * (sorted.length - 1))));
  return sorted[i];
}

export function engagementScore(p: Post): number {
  return (p.engagement?.likes ?? 0) + (p.engagement?.shares ?? 0) * 2;
}

export const monthKey = (iso: string) => iso.slice(0, 7);
export const quarterKey = (iso: string) => {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-Q${Math.floor(d.getUTCMonth() / 3) + 1}`;
};

/**
 * Each post's engagement divided by the median engagement of its UTC month
 * (or its quarter when the month has fewer than baselineMinPostsPerMonth posts).
 * Removes growth or decline that affects every topic at once.
 */
export function engagementRatios(posts: Post[]): Map<string, number> {
  const byMonth = new Map<string, number[]>();
  const byQuarter = new Map<string, number[]>();
  const push = (m: Map<string, number[]>, k: string, v: number) => {
    const list = m.get(k);
    if (list) list.push(v);
    else m.set(k, [v]);
  };
  for (const p of posts) {
    if (!p.engagement) continue;
    push(byMonth, monthKey(p.createdAt), engagementScore(p));
    push(byQuarter, quarterKey(p.createdAt), engagementScore(p));
  }
  const monthMedian = new Map([...byMonth].map(([k, v]) => [k, { n: v.length, m: median(v) }]));
  const quarterMedian = new Map([...byQuarter].map(([k, v]) => [k, median(v)]));
  const out = new Map<string, number>();
  for (const p of posts) {
    if (!p.engagement) continue;
    const mm = monthMedian.get(monthKey(p.createdAt))!;
    const base = mm.n >= DEFINITIONS.baselineMinPostsPerMonth ? mm.m : quarterMedian.get(quarterKey(p.createdAt))!;
    out.set(p.id, base > 0 ? engagementScore(p) / base : 1);
  }
  return out;
}

/** Split posts at the midpoint in time between the first and last post. */
export function splitHalves(posts: Post[]) {
  if (posts.length === 0) return { split: '', early: [] as Post[], late: [] as Post[] };
  const t0 = new Date(posts[0].createdAt).getTime();
  const t1 = new Date(posts[posts.length - 1].createdAt).getTime();
  const mid = t0 + (t1 - t0) / 2;
  return {
    split: new Date(mid).toISOString(),
    early: posts.filter(p => new Date(p.createdAt).getTime() < mid),
    late: posts.filter(p => new Date(p.createdAt).getTime() >= mid),
  };
}

/** A post's topics, excluding "unclassified" (no keyword matched). */
export function topicsOf(p: Post): string[] {
  return p.derived ? p.derived.topics.map(t => t.topic).filter(t => t !== UNCLASSIFIED) : [];
}

/** Share (0-1) of posts carrying each topic. */
export function topicShares(posts: Post[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const p of posts) for (const t of new Set(topicsOf(p))) counts.set(t, (counts.get(t) ?? 0) + 1);
  return new Map([...counts].map(([k, v]) => [k, posts.length ? v / posts.length : 0]));
}

/**
 * Bootstrap 95% intervals of (late share − early share) for every topic, in
 * percentage points. Posts are resampled with replacement within each half;
 * the seed is fixed so results are reproducible.
 */
export function bootstrapShareChange(early: Post[], late: Post[], topics: string[]): Map<string, [number, number]> {
  const rng = createSeededRandom(DEFINITIONS.bootstrapSeed);
  const B = DEFINITIONS.bootstrapResamples;
  const earlyTopics = early.map(p => new Set(topicsOf(p)));
  const lateTopics = late.map(p => new Set(topicsOf(p)));
  const diffs = new Map(topics.map(t => [t, [] as number[]]));
  const sample = (sets: Set<string>[]) => {
    const c = new Map<string, number>();
    for (let i = 0; i < sets.length; i++) {
      for (const t of sets[Math.floor(rng.random() * sets.length)]) c.set(t, (c.get(t) ?? 0) + 1);
    }
    return c;
  };
  if (early.length === 0 || late.length === 0) return new Map(topics.map(t => [t, [0, 0]]));
  for (let b = 0; b < B; b++) {
    const ce = sample(earlyTopics);
    const cl = sample(lateTopics);
    for (const t of topics) diffs.get(t)!.push(((cl.get(t) ?? 0) / late.length - (ce.get(t) ?? 0) / early.length) * 100);
  }
  return new Map(topics.map(t => {
    const s = diffs.get(t)!.sort((a, b) => a - b);
    return [t, [percentile(s, 0.025), percentile(s, 0.975)]];
  }));
}

/** Shannon entropy in bits with the Miller–Madow small-sample correction: H + (K − 1) / (2N ln 2). */
export function entropyMillerMadow(counts: number[]): number {
  const n = counts.reduce((s, c) => s + c, 0);
  if (n === 0) return 0;
  let h = 0;
  for (const c of counts) if (c > 0) h -= (c / n) * Math.log2(c / n);
  const k = counts.filter(c => c > 0).length;
  return h + (k - 1) / (2 * n * Math.LN2);
}

export function topicCounts(posts: Post[]): Map<string, number> {
  const c = new Map<string, number>();
  for (const p of posts) for (const t of topicsOf(p)) c.set(t, (c.get(t) ?? 0) + 1);
  return c;
}

/** Bootstrap 95% interval of the relative entropy change (late − early) ÷ early. */
export function bootstrapEntropyChange(early: Post[], late: Post[]): [number, number] {
  if (early.length === 0 || late.length === 0) return [0, 0];
  const rng = createSeededRandom(DEFINITIONS.bootstrapSeed + 1);
  const resample = (ps: Post[]) => {
    const c = new Map<string, number>();
    for (let i = 0; i < ps.length; i++) for (const t of topicsOf(ps[Math.floor(rng.random() * ps.length)])) c.set(t, (c.get(t) ?? 0) + 1);
    return entropyMillerMadow([...c.values()]);
  };
  const out: number[] = [];
  for (let b = 0; b < DEFINITIONS.bootstrapResamples; b++) {
    const he = resample(early);
    out.push(he > 0 ? (resample(late) - he) / he : 0);
  }
  out.sort((a, b) => a - b);
  return [percentile(out, 0.025), percentile(out, 0.975)];
}

/** Add whole calendar months in UTC. */
export function addMonthsUTC(iso: string, months: number): string {
  const d = new Date(iso);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, d.getUTCDate())).toISOString();
}

export function pearson(x: number[], y: number[]): number {
  const n = x.length;
  if (n < 3) return 0;
  const mx = x.reduce((s, v) => s + v, 0) / n;
  const my = y.reduce((s, v) => s + v, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    num += (x[i] - mx) * (y[i] - my);
    dx += (x[i] - mx) ** 2;
    dy += (y[i] - my) ** 2;
  }
  const den = Math.sqrt(dx * dy);
  return den === 0 ? 0 : num / den;
}
