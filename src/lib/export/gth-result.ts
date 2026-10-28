// ── gth-result/v1 export ─────────────────────────────────────────────────────
// Counts-only summary of the /results page, in the shared Govern the Human
// result format (see SCHEMA.md in the govern-the-human repository).
//
// Never included: post text, phrases, self-descriptions, reflection answers,
// MBTI or Enneagram. Only topic labels, counts and range measures.

import type { AnalysisResult, DatasetProfile, TopicEngagement } from '@/lib/data/types';

export interface ResultsSummary {
  topTopics: [string, number][];
  distinctTopics: number;
  entropyFirst: number;
  entropyLast: number;
  quarters: number;
  narrowed: boolean;
  avgEngagement: number;
  reinforced: TopicEngagement[];
  kept: TopicEngagement[];
  /** As on /kept: engagement below 60% of average, frequency not decreasing. */
  keptWithoutEncouragement: TopicEngagement[];
  /** As on /kept: engagement above 130% of average, frequency not increasing. */
  resistedReward: TopicEngagement[];
}

/** The figures shown on /results. The page renders from this same function. */
export function summarizeResults(profile: DatasetProfile, analysis: AnalysisResult): ResultsSummary {
  const topicCounts: Record<string, number> = {};
  for (const p of profile.posts) {
    if (p.derived) for (const t of p.derived.topics) topicCounts[t.topic] = (topicCounts[t.topic] || 0) + 1;
  }
  const topTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const e = analysis.topicEntropy.value;
  const entropyFirst = e[0]?.value ?? 0;
  const entropyLast = e[e.length - 1]?.value ?? 0;
  const narrowed = entropyLast < entropyFirst * 0.75;

  const eng = analysis.engagementSensitivity;
  const avgEngagement = eng ? eng.value.reduce((s, t) => s + t.averageEngagement, 0) / eng.value.length : 0;
  const reinforced = eng?.value.filter(t => t.frequencyTrend === 'increasing' && t.averageEngagement > avgEngagement).slice(0, 3) ?? [];
  const kept = eng?.value.filter(t => t.averageEngagement < avgEngagement * 0.5 && t.frequencyTrend !== 'decreasing').slice(0, 3) ?? [];
  const keptWithoutEncouragement = eng?.value
    .filter(t => t.averageEngagement < avgEngagement * 0.6 && t.frequencyTrend !== 'decreasing')
    .sort((a, b) => b.postCount - a.postCount) ?? [];
  const resistedReward = eng?.value
    .filter(t => t.averageEngagement > avgEngagement * 1.3 && t.frequencyTrend !== 'increasing')
    .slice(0, 3) ?? [];

  return {
    topTopics,
    distinctTopics: Object.keys(topicCounts).length,
    entropyFirst,
    entropyLast,
    quarters: e.length,
    narrowed,
    avgEngagement,
    reinforced,
    kept,
    keptWithoutEncouragement,
    resistedReward,
  };
}

export const INSTRUMENT_VERSION = process.env.NEXT_PUBLIC_INSTRUMENT_VERSION || 'unknown';

const r2 = (n: number) => Math.round(n * 100) / 100;
const monthLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('en', { month: 'long', year: 'numeric' });

export function buildGthResult(profile: DatasetProfile, analysis: AnalysisResult) {
  const s = summarizeResults(profile, analysis);
  const isDemo = profile.id.startsWith('demo-');
  const ratio = (t: TopicEngagement) => (s.avgEngagement > 0 ? r2(t.averageEngagement / s.avgEngagement) : null);
  const row = (t: TopicEngagement) => ({
    topic: t.topic,
    post_count: t.postCount,
    engagement_vs_average: ratio(t),
    frequency_trend: t.frequencyTrend,
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
      top_topics: s.topTopics.map(([topic, count]) => ({ topic, count })),
      rewarded_rising: s.reinforced.map(row),
      kept: s.kept.map(row),
      kept_without_encouragement: s.keptWithoutEncouragement.map(row),
      resisted_reward: s.resistedReward.map(row),
      topic_range: {
        distinct_topics: s.distinctTopics,
        diversity_first_quarter_bits: r2(s.entropyFirst),
        diversity_last_quarter_bits: r2(s.entropyLast),
        diversity_change_pct: s.entropyFirst > 0 ? Math.round(((s.entropyLast - s.entropyFirst) / s.entropyFirst) * 100) : null,
        quarters: s.quarters,
        narrowed: s.narrowed,
      },
      definitions: {
        rewarded_rising: 'Topic with above-average engagement whose posting frequency increased (top 3).',
        kept: 'As on /results: topic with engagement below 50% of the average whose posting frequency did not decrease (top 3).',
        kept_without_encouragement: 'As on /kept: topic with engagement below 60% of the average whose posting frequency did not decrease.',
        resisted_reward: 'As on /kept: topic with engagement above 130% of the average whose posting frequency did not increase (top 3).',
        narrowed: 'Topic diversity in the last quarter is below 75% of the first quarter (Shannon entropy, bits).',
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
