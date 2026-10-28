// ── gth-result/v1 export ─────────────────────────────────────────────────────
// Counts-only summary of the /results page, in the shared Govern the Human
// result format (see SCHEMA.md in the govern-the-human repository).
//
// Never included: post text, phrases, self-descriptions, reflection answers,
// MBTI or Enneagram. Only topic labels, counts and range measures.
//
// Every list uses the definitions in src/lib/analysis/definitions.ts, the same
// ones the pages use. Field names read by govern-the-human are kept.

import type { AnalysisResult, DatasetProfile, TopicEngagement } from '@/lib/data/types';
import { DEFINITIONS, isRewardedAndRising } from '@/lib/analysis/definitions';
import { topicCounts } from '@/lib/analysis/stats';
import { TAXONOMY_SOURCE, topicId } from '@/lib/analysis/text/taxonomy';

export interface ResultsSummary {
  topTopics: [string, number][];
  distinctTopics: number;
  /** Miller–Madow entropy of the first and last narrowing windows. */
  entropyFirst: number;
  entropyLast: number;
  narrowed: boolean;
  /** Rewarded (time-adjusted) and rising, most rewarded first. */
  reinforced: TopicEngagement[];
  /** Steady or rising share, engagement below baseline in both halves. */
  kept: TopicEngagement[];
  /** Rewarded, but posted no more often. */
  resistedReward: TopicEngagement[];
}

/** The figures shown on /results. The page renders from this same function. */
export function summarizeResults(profile: DatasetProfile, analysis: AnalysisResult): ResultsSummary {
  const counts = topicCounts(profile.posts);
  const topTopics = [...counts].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const n = analysis.narrowing.value;
  const eng = analysis.engagementSensitivity?.value ?? [];

  return {
    topTopics,
    distinctTopics: counts.size,
    entropyFirst: n.early.entropy,
    entropyLast: n.late.entropy,
    narrowed: n.narrowed,
    reinforced: eng.filter(isRewardedAndRising),
    kept: eng.filter(t => t.kept).sort((a, b) => b.postCount - a.postCount),
    resistedReward: eng.filter(t => t.resistedReward),
  };
}

export const INSTRUMENT_VERSION = process.env.NEXT_PUBLIC_INSTRUMENT_VERSION || 'unknown';

const r2 = (n: number) => Math.round(n * 100) / 100;
const monthLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('en', { timeZone: 'UTC', month: 'long', year: 'numeric' });

export function buildGthResult(profile: DatasetProfile, analysis: AnalysisResult) {
  const s = summarizeResults(profile, analysis);
  const isDemo = profile.id.startsWith('demo-');
  const n = analysis.narrowing.value;
  const d = DEFINITIONS;
  const row = (t: TopicEngagement) => ({
    topic: t.topic,
    topic_id: topicId(t.topic),
    post_count: t.postCount,
    // Kept for compatibility; now carries the time-adjusted reward ratio.
    engagement_vs_average: r2(t.rewardRatio),
    reward_ratio: r2(t.rewardRatio),
    frequency_trend: t.frequencyTrend,
    share_change_pp: r2(t.shareChangePp),
    share_change_ci_pp: t.shareChangeCI.map(r2),
  });

  return {
    schema: 'gth-result/v1',
    instrument: {
      name: 'selftrace',
      version: INSTRUMENT_VERSION,
      url: 'https://selftrace.vercel.app',
    },
    generated_at: new Date().toISOString(),
    inputs: {
      source: isDemo ? 'demo' : 'user-data',
      profile_id: isDemo ? profile.id : null,
      profile_label: isDemo ? profile.label : null,
      platform: profile.platform,
      post_count: profile.dataQuality.totalPosts,
      reflection_answers_included: false,
    },
    outputs: {
      post_count: profile.dataQuality.totalPosts,
      date_range: {
        start: profile.dataQuality.dateRange.start,
        end: profile.dataQuality.dateRange.end,
        start_label: monthLabel(profile.dataQuality.dateRange.start),
        end_label: monthLabel(profile.dataQuality.dateRange.end),
      },
      taxonomy: {
        name: TAXONOMY_SOURCE.name,
        release: TAXONOMY_SOURCE.release,
        licence: TAXONOMY_SOURCE.licence,
        url: TAXONOMY_SOURCE.url,
      },
      top_topics: s.topTopics.map(([topic, count]) => ({ topic, topic_id: topicId(topic), count })),
      rewarded_rising: s.reinforced.map(row),
      kept: s.kept.map(row),
      kept_without_encouragement: s.kept.map(row),
      resisted_reward: s.resistedReward.map(row),
      topic_range: {
        distinct_topics: s.distinctTopics,
        // Field names kept for compatibility; values are the first and last windows of window_months.
        diversity_first_quarter_bits: r2(s.entropyFirst),
        diversity_last_quarter_bits: r2(s.entropyLast),
        diversity_change_pct: n.sufficient ? Math.round(n.relativeChange * 100) : null,
        diversity_change_ci_pct: n.sufficient ? n.ci.map(v => Math.round(v * 100)) : null,
        window_months: n.windowMonths,
        first_window_posts: n.early.posts,
        last_window_posts: n.late.posts,
        sufficient: n.sufficient,
        narrowed: s.narrowed,
      },
      definitions: {
        topics: `${TAXONOMY_SOURCE.name} concepts assigned from post text by SelfTrace's published keyword list; posts with no match are left out of topic counts.`,
        engagement: `Engagement = ${d.engagementFormula}. Each post is divided by the median engagement of its UTC month (its quarter if the month has fewer than ${d.baselineMinPostsPerMonth} posts). reward_ratio is the median of that ratio over a topic's posts; engagement_vs_average carries the same value.`,
        frequency_trend: `Share of posts carrying the topic in two halves of equal duration, each with at least ${d.minPostsPerHalf} posts. Increasing: later share at least ${d.risingRatio}× the earlier, up at least ${d.risingMinChangePp} points, and the bootstrap 95% interval (${d.bootstrapResamples} resamples) above 0. Decreasing is the mirror image.`,
        rewarded_rising: `Topic with reward_ratio at least ${d.rewardedRatio} over at least ${d.rewardedMinPosts} posts, whose frequency_trend is increasing.`,
        kept: `Topic with at least ${d.keptMinPostsPerHalf} posts in each half, later share at least ${d.keptMinShareRatio * 100}% of the earlier, and reward_ratio below ${d.keptMaxRewardRatio} in both halves.`,
        kept_without_encouragement: 'Same list as kept: one definition is used everywhere.',
        resisted_reward: `Topic with reward_ratio at least ${d.rewardedRatio} over at least ${d.rewardedMinPosts} posts, whose frequency_trend is stable or decreasing.`,
        narrowed: `Miller–Madow-corrected topic entropy in the last ${d.narrowingWindowMonths} months is at least ${d.narrowedDrop * 100}% below the first ${d.narrowingWindowMonths} months, with the bootstrap 95% interval below 0. Each window needs at least ${d.narrowingMinPostsPerWindow} posts.`,
      },
    },
    privacy: {
      processing: 'client-side',
      personal_content_included: false,
      excluded: ['post text', 'phrases and self-descriptions', 'reflection answers', 'MBTI and Enneagram'],
    },
  };
}

export type GthResult = ReturnType<typeof buildGthResult>;

export function downloadGthResult(profile: DatasetProfile, analysis: AnalysisResult) {
  const doc = buildGthResult(profile, analysis);
  const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `selftrace-result-${doc.generated_at.slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
