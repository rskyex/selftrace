// ── Recovery test and sensitivity table ──────────────────────────────────────
// The demo generator plants topics, engagement boosts, an engagement growth
// curve, a kept topic, tone curves and self-descriptions (post.planted).
// post.derived is computed from the text alone. These functions compare what
// was planted with what the analysis recovers, so /methodology can show where
// the instrument works and where it does not. Nothing here tunes the analysis.

import type { AnalysisResult, DatasetProfile, Post, ToneMarkers } from '@/lib/data/types';
import { DEFINITIONS, classifyTopic, isRewardedAndRising, scaledThresholds } from './definitions';
import { engagementRatios, engagementScore, median, monthKey, splitHalves, topicsOf } from './stats';
import { UNCLASSIFIED } from './text/taxonomy';

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Engagement growth planted by the generator (src/data/demo/profiles.ts). */
export const PLANTED_GROWTH: Record<string, string> = {
  'demo-intellectual': 'every post × (1 + 0.08 × month)',
};

export interface TopicMapping {
  planted: string;
  posts: number;
  /** IPTC concepts the planted topic's posts were assigned, share of its posts (0-1). */
  recovered: { topic: string; share: number }[];
  unclassified: number;
}

/** Planted topic label → IPTC concepts recovered from the text. */
export function topicRecovery(profile: DatasetProfile): TopicMapping[] {
  const by = new Map<string, Post[]>();
  for (const p of profile.posts) {
    if (!p.planted) continue;
    const list = by.get(p.planted.topic);
    if (list) list.push(p);
    else by.set(p.planted.topic, [p]);
  }
  return [...by].map(([planted, posts]) => {
    const c = new Map<string, number>();
    for (const p of posts) for (const t of new Set(topicsOf(p))) c.set(t, (c.get(t) ?? 0) + 1);
    return {
      planted,
      posts: posts.length,
      recovered: [...c].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([topic, n]) => ({ topic, share: r2(n / posts.length) })),
      unclassified: posts.filter(p => p.derived?.topics[0]?.topic === UNCLASSIFIED).length,
    };
  }).sort((a, b) => b.posts - a.posts);
}

export interface BoostRecovery {
  planted: string;
  posts: number;
  /** Largest planted multiplier for this topic. */
  boost: number;
  /** Median time-adjusted engagement over the planted topic's posts (labels known). */
  ratioByPlantedLabel: number;
  /** The IPTC concept most of its posts were assigned, and how the analysis classed it. */
  mainConcept: string | null;
  conceptRatio: number | null;
  conceptRewarded: boolean;
}

/** Do planted engagement boosts come back as rewarded topics? */
export function boostRecovery(profile: DatasetProfile, analysis: AnalysisResult): BoostRecovery[] {
  const ratios = engagementRatios(profile.posts);
  const topics = topicRecovery(profile);
  const eng = analysis.engagementSensitivity?.value ?? [];
  return topics
    .map(m => {
      const posts = profile.posts.filter(p => p.planted?.topic === m.planted);
      const boost = Math.max(...posts.map(p => p.planted!.engagementBoost));
      const main = m.recovered[0]?.topic ?? null;
      const t = eng.find(e => e.topic === main);
      return {
        planted: m.planted,
        posts: m.posts,
        boost,
        ratioByPlantedLabel: r2(median(posts.map(p => ratios.get(p.id) ?? 1))),
        mainConcept: main,
        conceptRatio: t ? r2(t.rewardRatio) : null,
        conceptRewarded: t?.rewarded ?? false,
      };
    })
    .filter(b => b.boost !== 1);
}

export interface GrowthRecovery {
  planted: string | null;
  /** Median raw engagement, last three months ÷ first three months. */
  rawGrowth: number;
  /** Topics that would count as rewarded on raw engagement (topic median ÷ overall
   *  median) but not on time-adjusted engagement: they were posted when engagement
   *  was high overall, not rewarded relative to their own month. */
  rawOnly: { topic: string; rawRatio: number; rewardRatio: number }[];
  /** The reverse: rewarded only once time is adjusted for. */
  adjustedOnly: { topic: string; rawRatio: number; rewardRatio: number }[];
}

/** Is engagement growth that affects every topic kept out of "rewarded"? */
export function growthRecovery(profile: DatasetProfile, analysis: AnalysisResult): GrowthRecovery {
  const months = [...new Set(profile.posts.map(p => monthKey(p.createdAt)))].sort();
  const first = new Set(months.slice(0, 3));
  const last = new Set(months.slice(-3));
  const raw = (set: Set<string>) => median(profile.posts.filter(p => p.engagement && set.has(monthKey(p.createdAt))).map(engagementScore));
  const rawF = raw(first), rawL = raw(last);

  const overall = median(profile.posts.filter(p => p.engagement).map(engagementScore));
  const rows = (analysis.engagementSensitivity?.value ?? [])
    .filter(t => t.postCount >= DEFINITIONS.rewardedMinPosts)
    .map(t => {
      const scores = profile.posts.filter(p => p.engagement && topicsOf(p).includes(t.topic)).map(engagementScore);
      return { topic: t.topic, rawRatio: overall > 0 ? r2(median(scores) / overall) : 0, rewardRatio: r2(t.rewardRatio) };
    });
  const isRew = (r: number) => r >= DEFINITIONS.rewardedRatio;
  return {
    planted: PLANTED_GROWTH[profile.id] ?? null,
    rawGrowth: rawF > 0 ? r2(rawL / rawF) : 0,
    rawOnly: rows.filter(r => isRew(r.rawRatio) && !isRew(r.rewardRatio)),
    adjustedOnly: rows.filter(r => !isRew(r.rawRatio) && isRew(r.rewardRatio)),
  };
}

export interface KeptRecovery {
  planted: string;
  posts: number;
  mainConcept: string | null;
  conceptKept: boolean;
  /** Every topic the analysis classed as kept. */
  detectedKept: string[];
}

/** Planted persistent low-reward topics: does the kept rule find them? */
export function keptRecovery(profile: DatasetProfile, analysis: AnalysisResult, plantedKept: string[]): KeptRecovery[] {
  const eng = analysis.engagementSensitivity?.value ?? [];
  const detectedKept = eng.filter(t => t.kept).map(t => t.topic);
  return topicRecovery(profile)
    .filter(m => plantedKept.includes(m.planted))
    .map(m => {
      const main = m.recovered[0]?.topic ?? null;
      return { planted: m.planted, posts: m.posts, mainConcept: main, conceptKept: detectedKept.includes(main ?? ''), detectedKept };
    });
}

export type ToneKey = keyof ToneMarkers;
export const TONE_KEYS: ToneKey[] = ['assertiveness', 'emotionality', 'formality', 'urgency', 'vulnerability'];

export interface ToneRecovery {
  marker: ToneKey;
  planted: [number, number];
  derived: [number, number];
  /** Planted and derived move the same way (both up, both down, or both within ±0.05). */
  agrees: boolean;
}

/** Planted tone curves vs tone measured from the text, earlier vs later half. */
export function toneRecovery(profile: DatasetProfile): ToneRecovery[] {
  const { early, late } = splitHalves(profile.posts);
  const mean = (ps: Post[], f: (p: Post) => number) => (ps.length ? ps.reduce((s, p) => s + f(p), 0) / ps.length : 0);
  const dir = (a: number, b: number) => (b - a > 0.05 ? 1 : a - b > 0.05 ? -1 : 0);
  return TONE_KEYS.map(k => {
    const planted: [number, number] = [r2(mean(early, p => p.planted?.tone[k] ?? 0)), r2(mean(late, p => p.planted?.tone[k] ?? 0))];
    const derived: [number, number] = [r2(mean(early, p => p.derived?.tone[k] ?? 0)), r2(mean(late, p => p.derived?.tone[k] ?? 0))];
    return { marker: k, planted, derived, agrees: dir(...planted) === dir(...derived) };
  });
}

export interface SelfDescRecovery {
  pattern: string;
  planted: [number, number];
  derived: [number, number];
}

/** Planted self-description schedule vs self-descriptions found in the text. */
export function selfDescRecovery(profile: DatasetProfile): SelfDescRecovery[] {
  const { early, late } = splitHalves(profile.posts);
  const count = (ps: Post[], pick: (p: Post) => { pattern: string }[] | undefined, pattern: string) =>
    ps.reduce((s, p) => s + (pick(p) ?? []).filter(d => d.pattern === pattern).length, 0);
  const patterns = new Set<string>();
  for (const p of profile.posts) {
    for (const d of p.planted?.selfDescriptions ?? []) patterns.add(d.pattern);
    for (const d of p.derived?.selfDescriptions ?? []) patterns.add(d.pattern);
  }
  const planted = (p: Post) => p.planted?.selfDescriptions;
  const derived = (p: Post) => p.derived?.selfDescriptions;
  return [...patterns].sort().map(pattern => ({
    pattern,
    planted: [count(early, planted, pattern), count(late, planted, pattern)],
    derived: [count(early, derived, pattern), count(late, derived, pattern)],
  }));
}

export interface SensitivityRow {
  factor: number;
  rewarded: number;
  rising: number;
  rewardedRising: number;
  kept: number;
  narrowed: boolean;
}

/**
 * Counts with every threshold scaled. factor > 1 is stricter: higher reward
 * ratio, larger rise, more posts, lower kept engagement ceiling, larger drop.
 */
export function sensitivity(analysis: AnalysisResult, factors = [0.8, 1, 1.2]): SensitivityRow[] {
  const eng = analysis.engagementSensitivity?.value ?? [];
  const n = analysis.narrowing.value;
  return factors.map(factor => {
    const t = scaledThresholds(factor);
    const cls = eng.map(s => classifyTopic(s, analysis.halves.sufficient, t));
    const minPosts = DEFINITIONS.narrowingMinPostsPerWindow * factor;
    const sufficient = n.early.posts >= minPosts && n.late.posts >= minPosts;
    return {
      factor,
      rewarded: cls.filter(c => c.rewarded).length,
      rising: cls.filter(c => c.frequencyTrend === 'increasing').length,
      rewardedRising: cls.filter(isRewardedAndRising).length,
      kept: cls.filter(c => c.kept).length,
      narrowed: sufficient && n.relativeChange <= -DEFINITIONS.narrowedDrop * factor && n.ci[1] < 0,
    };
  });
}
