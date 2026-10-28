// ── Definitions: every threshold in one place ─────────────────────────────────
// All pages, the pipeline and the gth-result export read their thresholds from
// here. Changing a value here changes it everywhere. The sensitivity table on
// /methodology recomputes the counts with every threshold scaled ×0.8 and ×1.2.

export const DEFINITIONS = {
  // Engagement
  /** Per-post engagement score. */
  engagementFormula: 'likes + 2 × shares',
  /** A post's baseline is the median engagement of its UTC calendar month; if
   *  the month has fewer posts than this, the median of its quarter is used. */
  baselineMinPostsPerMonth: 10,

  // Rewarded
  /** A topic is rewarded when the median of (post engagement ÷ baseline) over
   *  its posts is at least this… */
  rewardedRatio: 1.25,
  /** …and it has at least this many posts. */
  rewardedMinPosts: 8,

  // Halves and trends
  /** Trends compare two halves of equal duration (split at the time midpoint).
   *  Each half needs at least this many posts, otherwise trends are "insufficient". */
  minPostsPerHalf: 20,
  /** Rising: later share ÷ earlier share at least this, … */
  risingRatio: 1.3,
  /** …share up by at least this many percentage points, and the bootstrap 95%
   *  interval of the change above 0. Falling is the mirror image. */
  risingMinChangePp: 2,

  // Kept
  /** Kept: at least this many posts in each half, … */
  keptMinPostsPerHalf: 5,
  /** …later share at least this fraction of the earlier share (not falling), … */
  keptMinShareRatio: 0.9,
  /** …and median time-adjusted engagement below this in both halves. */
  keptMaxRewardRatio: 1,

  // Narrowing
  /** Topic range is compared between the first and last windows of this many months. */
  narrowingWindowMonths: 6,
  /** Each window needs at least this many posts. */
  narrowingMinPostsPerWindow: 30,
  /** Narrowed: Miller–Madow-corrected entropy falls by at least this share and the
   *  bootstrap 95% interval of the change is below 0. Broadened is the mirror image. */
  narrowedDrop: 0.25,

  // Bootstrap
  bootstrapResamples: 1000,
  bootstrapSeed: 20_261_028,

  // Engagement-driven shift (influence index component E)
  /** Detected when at least this share of topics are both rewarded and rising. */
  engagementShiftMinShare: 0.15,

  // Quarterly correlation chart
  /** A quarter is plotted only with at least this many topics… */
  correlationMinTopics: 5,
  /** …and this many posts across the two quarters compared. */
  correlationMinPosts: 30,
  /** A topic enters a quarter's correlation with at least this many posts in the prior quarter. */
  correlationMinTopicPosts: 3,
} as const;

export type Thresholds = {
  rewardedRatio: number;
  rewardedMinPosts: number;
  risingRatio: number;
  risingMinChangePp: number;
  keptMinPostsPerHalf: number;
  keptMinShareRatio: number;
  keptMaxRewardRatio: number;
};

export const DEFAULT_THRESHOLDS: Thresholds = {
  rewardedRatio: DEFINITIONS.rewardedRatio,
  rewardedMinPosts: DEFINITIONS.rewardedMinPosts,
  risingRatio: DEFINITIONS.risingRatio,
  risingMinChangePp: DEFINITIONS.risingMinChangePp,
  keptMinPostsPerHalf: DEFINITIONS.keptMinPostsPerHalf,
  keptMinShareRatio: DEFINITIONS.keptMinShareRatio,
  keptMaxRewardRatio: DEFINITIONS.keptMaxRewardRatio,
};

/** Raw per-topic statistics the classification is applied to. */
export interface TopicStats {
  postCount: number;
  rewardRatio: number;
  earlyRewardRatio: number | null;
  lateRewardRatio: number | null;
  earlyCount: number;
  lateCount: number;
  earlyShare: number;
  lateShare: number;
  shareChangePp: number;
  shareChangeCI: [number, number];
}

export type Trend = 'increasing' | 'stable' | 'decreasing' | 'insufficient';

export function classifyTrend(s: TopicStats, halvesSufficient: boolean, t: Thresholds = DEFAULT_THRESHOLDS): Trend {
  if (!halvesSufficient) return 'insufficient';
  const ratio = s.earlyShare > 0 ? s.lateShare / s.earlyShare : s.lateShare > 0 ? Infinity : 1;
  if (ratio >= t.risingRatio && s.shareChangePp >= t.risingMinChangePp && s.shareChangeCI[0] > 0) return 'increasing';
  if (ratio <= 1 / t.risingRatio && s.shareChangePp <= -t.risingMinChangePp && s.shareChangeCI[1] < 0) return 'decreasing';
  return 'stable';
}

export function classifyTopic(s: TopicStats, halvesSufficient: boolean, t: Thresholds = DEFAULT_THRESHOLDS) {
  const trend = classifyTrend(s, halvesSufficient, t);
  const rewarded = s.postCount >= t.rewardedMinPosts && s.rewardRatio >= t.rewardedRatio;
  const kept =
    halvesSufficient &&
    s.earlyCount >= t.keptMinPostsPerHalf &&
    s.lateCount >= t.keptMinPostsPerHalf &&
    s.lateShare >= t.keptMinShareRatio * s.earlyShare &&
    s.earlyRewardRatio !== null && s.earlyRewardRatio < t.keptMaxRewardRatio &&
    s.lateRewardRatio !== null && s.lateRewardRatio < t.keptMaxRewardRatio;
  return {
    frequencyTrend: trend,
    rewarded,
    kept,
    /** Rewarded, but posted no more often over time. */
    resistedReward: rewarded && (trend === 'stable' || trend === 'decreasing'),
    /** Posted less often and engagement below the time-adjusted baseline. */
    faded: trend === 'decreasing' && s.rewardRatio < 1,
  };
}

/** Rewarded and rising: the pattern counted as an engagement-driven shift. */
export function isRewardedAndRising(t: { rewarded: boolean; frequencyTrend: Trend }): boolean {
  return t.rewarded && t.frequencyTrend === 'increasing';
}

/** Scale every threshold (min-post counts rounded) for the sensitivity table. */
export function scaledThresholds(factor: number): Thresholds {
  const d = DEFAULT_THRESHOLDS;
  return {
    rewardedRatio: d.rewardedRatio * factor,
    rewardedMinPosts: Math.max(1, Math.round(d.rewardedMinPosts * factor)),
    risingRatio: 1 + (d.risingRatio - 1) * factor,
    risingMinChangePp: d.risingMinChangePp * factor,
    keptMinPostsPerHalf: Math.max(1, Math.round(d.keptMinPostsPerHalf * factor)),
    keptMinShareRatio: d.keptMinShareRatio * factor,
    keptMaxRewardRatio: d.keptMaxRewardRatio * (2 - factor),
  };
}
