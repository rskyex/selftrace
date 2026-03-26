'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { HowToRead } from '@/components/shared/HowToRead';
import { AreaChart } from '@/components/shared/AreaChart';
import { SparkLine } from '@/components/shared/SparkLine';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { GovernanceBlock } from '@/components/shared/GovernanceBlock';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { TimelineBand } from '@/components/timeline/TimelineBand';
import { TopicStreamChart } from '@/components/timeline/TopicStreamChart';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { PeriodComparisonPanel } from '@/components/timeline/PeriodComparisonPanel';
import { useData } from '@/lib/data/context';

export default function TimelinePage() {
  const { activeProfile, analysis, isLoaded } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div>
        <PageHeader
          title="Temporal Self-Presentation"
          subtitle="How posting patterns shift over time."
        />
        <div className="reading-column px-6 pb-24">
          <p className="text-[15px] text-ink-500 leading-relaxed mb-8">
            This page examines how your posting patterns, topics, and language
            change over time. To begin, select a demo profile below.
          </p>
          <ProfileSwitcher />
        </div>
      </div>
    );
  }

  const { vocabularyDrift, topicEntropy, toneTrends } = analysis;

  return (
    <div>
      <PageHeader
        title="Temporal Self-Presentation"
        subtitle={`Examining: ${activeProfile!.label}`}
      />

      <div className="reading-column px-6">
        <HowToRead>
          This page maps how posting patterns change over time. Shifts in topic
          concentration or vocabulary do not necessarily indicate platform
          influence — they may reflect life changes, evolving interests, or
          deliberate choices. The tool surfaces patterns. You interpret them.
        </HowToRead>
      </div>

      {/* Timeline Band */}
      <TimelineBand data={analysis.postingFrequency.value} />

      <div className="wide-column px-6">
        <p className="text-[13px] text-ink-400 font-sans mt-2">
          Posting density over time. Each point represents one month.
        </p>
      </div>

      <div className="reading-column px-6 pb-24">
        {/* ── Topic Concentration ──────────────────────────── */}
        <div className="mt-16">
          <h2 className="text-[22px] text-ink-900 mb-3">
            Topic Concentration Over Time
          </h2>
          <p className="text-[14px] text-ink-500 leading-relaxed mb-2">
            How the distribution of topics in your posts shifts across the
            observed period. Converging streams may indicate narrowing focus —
            which can reflect deepening expertise, intentional specialization,
            or adaptation to audience expectations.
          </p>
          <EpistemicBadge status="inferred" />
        </div>
      </div>

      <div className="wide-column px-6">
        <TopicStreamChart data={analysis.topicDistribution.value} />
      </div>

      <div className="reading-column px-6">
        <SectionDivider />

        {/* ── Topic Entropy ────────────────────────────────── */}
        <h2 className="text-[22px] text-ink-900 mb-3">
          Topic Diversity
        </h2>
        <p className="text-[14px] text-ink-500 leading-relaxed mb-1">
          Shannon entropy measures how evenly distributed your topics are per
          quarter. Higher values indicate more diverse topics; declining values
          suggest concentration around fewer subjects. This pattern is common
          in sustained activity of any kind — it is noted here, not judged.
        </p>
        <div className="mb-4">
          <EpistemicBadge status={topicEntropy.status} />
        </div>

        <AreaChart
          data={topicEntropy.value}
          caption={topicEntropy.caveat}
          confidence="patterned"
        />

        <SectionDivider />

        {/* ── Vocabulary Drift ─────────────────────────────── */}
        <h2 className="text-[22px] text-ink-900 mb-3">
          Vocabulary Shift
        </h2>
        <p className="text-[14px] text-ink-500 leading-relaxed mb-6">
          Terms that changed in frequency between the first and second halves of
          the posting history. Vocabulary change is a normal feature of sustained
          writing and may reflect evolving interests, audience adaptation,
          professional development, or many other factors.
        </p>

        <div className="space-y-1">
          {vocabularyDrift.value.map((term) => (
            <div key={term.term} className="flex items-center gap-4 py-2.5 border-b border-linen-200">
              <span className="font-mono text-[13px] text-ink-900 w-36 truncate">
                {term.term}
              </span>
              <span className="font-sans text-[10px] text-ink-400 w-16 text-center uppercase tracking-wide">
                {term.direction}
              </span>
              <span className="font-mono text-[11px] text-ink-400 w-8 text-right">
                {term.earlierFrequency}
              </span>
              <span className="text-ink-300 text-[11px]">→</span>
              <span className="font-mono text-[11px] text-ink-700 w-8">
                {term.laterFrequency}
              </span>
              <span className="font-sans text-[10px] text-ink-300">
                per 100 posts
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <EpistemicBadge status={vocabularyDrift.status} />
        </div>

        <SectionDivider />

        {/* ── Tone Trends ──────────────────────────────────── */}
        <h2 className="text-[22px] text-ink-900 mb-3">
          Tone Markers Over Time
        </h2>
        <p className="text-[14px] text-ink-500 leading-relaxed mb-2">
          Approximate linguistic indicators, averaged per quarter. These are
          heuristic measures based on word patterns — exclamation density,
          hedge words, intensifiers, sentence length — and are culturally
          dependent and imprecise. They provide a directional signal, not a
          measurement.
        </p>
        <div className="mb-6">
          <EpistemicBadge status={toneTrends.status} />
        </div>

        <div className="space-y-4">
          {(['assertiveness', 'emotionality', 'formality', 'urgency'] as const).map((marker) => {
            const series = toneTrends.value[marker];
            const first = series[0]?.value ?? 0;
            const last = series[series.length - 1]?.value ?? 0;
            const direction = last > first + 0.05 ? '↑' : last < first - 0.05 ? '↓' : '—';

            return (
              <div key={marker} className="flex items-center gap-4 py-3 border-b border-linen-200">
                <span className="font-sans text-[11px] text-ink-500 uppercase tracking-wide w-28">
                  {marker}
                </span>
                <SparkLine
                  data={series}
                  width={160}
                  height={28}
                  color="#78716C"
                />
                <span className="font-mono text-[11px] text-ink-400 w-20 text-right">
                  {first.toFixed(2)} → {last.toFixed(2)}
                </span>
                <span className="font-mono text-[12px] text-ink-300 w-4">
                  {direction}
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-[13px] italic text-ink-400 leading-relaxed">
          Changes in linguistic tone may reflect life circumstances, audience
          shifts, world events, personal growth, or platform dynamics.
          These heuristics cannot distinguish between these explanations.
        </p>

        <SectionDivider />

        {/* ── Period Comparison ─────────────────────────────── */}
        <PeriodComparisonPanel
          posts={activeProfile!.posts}
          periods={activeProfile!.timePeriods}
        />

        <div className="mt-12">
          <GovernanceBlock>
            Algorithmic feeds on most major platforms rank content by predicted
            engagement rather than chronology. This creates a feedback environment
            where some posting patterns receive more visibility than others.
            Whether this structural condition influences how users compose
            subsequent posts is a question this tool helps examine — but cannot
            answer definitively.
          </GovernanceBlock>
        </div>
      </div>
    </div>
  );
}
