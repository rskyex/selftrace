'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { HowToRead } from '@/components/shared/HowToRead';
import { EmptyState } from '@/components/shared/EmptyState';
import { AreaChart } from '@/components/shared/AreaChart';
import { SparkLine } from '@/components/shared/SparkLine';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { GovernanceBlock } from '@/components/shared/GovernanceBlock';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { TimelineBand } from '@/components/timeline/TimelineBand';
import { TopicStreamChart } from '@/components/timeline/TopicStreamChart';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
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
          <p className="text-[14px] text-charcoal-500 mb-6">
            Select a demo profile to begin analysis.
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
        subtitle={`Examining posting patterns for: ${activeProfile!.label}`}
      />

      <div className="reading-column px-6">
        <HowToRead>
          This page maps how your posting patterns change over time. Shifts in
          topic concentration or vocabulary do not necessarily indicate platform
          influence — they may reflect life changes, evolving interests, or
          deliberate choices. The tool surfaces patterns. You interpret them.
        </HowToRead>
      </div>

      {/* Timeline Band — full width */}
      <TimelineBand data={analysis.postingFrequency.value} />

      <div className="wide-column px-6 pb-24">
        {/* Topic Concentration */}
        <h2 className="text-[22px] text-charcoal-900 mt-8 mb-2">
          Topic Concentration Over Time
        </h2>
        <TopicStreamChart data={analysis.topicDistribution.value} />

        <SectionDivider />

        {/* Topic Entropy */}
        <h2 className="text-[22px] text-charcoal-900 mb-2">
          Topic Diversity (Entropy)
        </h2>
        <p className="text-[14px] text-charcoal-500 leading-relaxed mb-4">
          Shannon entropy measures how evenly distributed your topics are.
          Declining entropy suggests concentration around fewer topics.
          This is observed, not judged — specialization can be intentional.
        </p>
        <AreaChart
          data={topicEntropy.value}
          caption={topicEntropy.caveat}
          status={topicEntropy.status}
        />

        <SectionDivider />

        {/* Vocabulary Drift */}
        <h2 className="text-[22px] text-charcoal-900 mb-4">
          Vocabulary Shift
        </h2>
        <p className="text-[14px] text-charcoal-500 leading-relaxed mb-6">
          Terms that changed in frequency between the first and second halves
          of the posting history.
        </p>

        <div className="space-y-2">
          {vocabularyDrift.value.map((term) => (
            <div key={term.term} className="flex items-center gap-4 py-2 border-b border-cream-200">
              <span className="font-mono text-[13px] text-charcoal-900 w-32 truncate">
                {term.term}
              </span>
              <span className={`font-interface text-[11px] px-2 py-0.5 rounded-sm ${
                term.direction === 'emerging'
                  ? 'text-teal-700 bg-teal-100'
                  : term.direction === 'fading'
                  ? 'text-charcoal-500 bg-cream-100'
                  : 'text-charcoal-300'
              }`}>
                {term.direction}
              </span>
              <span className="font-mono text-[11px] text-charcoal-300">
                {term.earlierFrequency}
              </span>
              <span className="text-charcoal-300">→</span>
              <span className="font-mono text-[11px] text-charcoal-700">
                {term.laterFrequency}
              </span>
              <span className="font-interface text-[10px] text-charcoal-300">
                per 100 posts
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <EpistemicBadge status={vocabularyDrift.status} />
        </div>

        <SectionDivider />

        {/* Tone Trends */}
        <h2 className="text-[22px] text-charcoal-900 mb-4">
          Tone Markers Over Time
        </h2>
        <p className="text-[14px] text-charcoal-500 leading-relaxed mb-6">
          Approximate linguistic markers, averaged per quarter. These are
          heuristic measures based on word patterns, not sentiment analysis.
        </p>

        <div className="grid grid-cols-2 gap-6">
          {(['assertiveness', 'emotionality', 'formality', 'urgency'] as const).map((marker) => (
            <div key={marker} className="bg-cream-100 border border-cream-200 rounded-sm p-4">
              <p className="font-interface text-[11px] text-charcoal-500 uppercase tracking-wide mb-2">
                {marker}
              </p>
              <SparkLine
                data={toneTrends.value[marker]}
                width={200}
                height={40}
                color={marker === 'urgency' ? '#A16207' : '#1A5C52'}
              />
              <div className="mt-1 font-mono text-[11px] text-charcoal-300">
                {toneTrends.value[marker][0]?.value.toFixed(2)} → {toneTrends.value[marker][toneTrends.value[marker].length - 1]?.value.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <EpistemicBadge status={toneTrends.status} />
          <p className="text-[12px] text-charcoal-500 mt-1">{toneTrends.caveat}</p>
        </div>

        <GovernanceBlock>
          Algorithmic feeds on most major platforms determine the order and
          visibility of content based on engagement signals. This creates a
          feedback environment where some posting patterns receive more visibility
          than others. Whether this structural condition influences how users
          compose subsequent posts is a question this tool helps examine — but
          cannot answer definitively.
        </GovernanceBlock>
      </div>
    </div>
  );
}
