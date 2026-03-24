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

export default function DriftPage() {
  const { activeProfile, analysis, isLoaded } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div>
        <PageHeader title="Your Online Drift" subtitle="How your posting patterns have shifted over time." />
        <div className="wide-column px-6 pb-24">
          <p className="text-[15px] text-charcoal-500 leading-relaxed mb-8 max-w-lg">
            See how your topics, vocabulary, and tone have evolved across your
            posting history. Connect your data or choose a demo to start.
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
        title="Your Online Drift"
        subtitle={`How ${activeProfile!.label.toLowerCase()}'s posting patterns shifted over time`}
      />

      {/* Timeline band - full width */}
      <TimelineBand data={analysis.postingFrequency.value} />
      <div className="wide-column px-6">
        <p className="text-[12px] text-charcoal-300 mt-2 mb-8">
          Posting density over time — taller areas mean more posts that month
        </p>
      </div>

      <div className="wide-column px-6 pb-24">
        <HowToRead>
          This page maps how posting patterns changed over time. Shifts in topic
          focus or vocabulary don&apos;t necessarily mean platform influence — they
          could reflect life changes, evolving interests, or deliberate choices.
          The tool shows the patterns. You interpret them.
        </HowToRead>

        {/* Topic Stream */}
        <div className="mt-8">
          <h2 className="text-[24px] font-semibold text-charcoal-900 mb-2">
            Topic concentration over time
          </h2>
          <p className="text-[14px] text-charcoal-500 leading-relaxed mb-1 max-w-lg">
            How the distribution of topics shifted. Converging streams suggest
            narrowing focus — which can mean deepening expertise, specialization,
            or adapting to what gets attention.
          </p>
          <EpistemicBadge status="inferred" />
        </div>

        <TopicStreamChart data={analysis.topicDistribution.value} />

        <SectionDivider />

        {/* Topic diversity */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-[20px] font-semibold text-charcoal-900 mb-2">
              Topic diversity
            </h2>
            <p className="text-[14px] text-charcoal-500 leading-relaxed mb-4">
              How evenly spread your topics are each quarter. A declining line
              means you&apos;re focusing on fewer subjects.
            </p>
            <AreaChart
              data={topicEntropy.value}
              caption={topicEntropy.caveat}
              status={topicEntropy.status}
            />
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-charcoal-900 mb-2">
              Vocabulary shift
            </h2>
            <p className="text-[14px] text-charcoal-500 leading-relaxed mb-4">
              Words that changed frequency between the first and second half
              of your posting history.
            </p>
            <div className="card p-5 space-y-1">
              {vocabularyDrift.value.slice(0, 8).map((term) => (
                <div key={term.term} className="flex items-center gap-3 py-2 border-b border-cream-100 last:border-0">
                  <span className="font-mono text-[13px] text-charcoal-900 w-32 truncate">
                    {term.term}
                  </span>
                  <span className={`pill text-[10px] ${
                    term.direction === 'emerging' ? 'bg-accent-100 text-accent-700' :
                    term.direction === 'fading' ? 'bg-amber-100 text-amber-700' :
                    'bg-cream-100 text-charcoal-500'
                  }`}>
                    {term.direction}
                  </span>
                  <span className="font-mono text-[11px] text-charcoal-400 ml-auto">
                    {term.earlierFrequency} &rarr; {term.laterFrequency}
                  </span>
                </div>
              ))}
              <div className="pt-2">
                <EpistemicBadge status={vocabularyDrift.status} />
              </div>
            </div>
          </div>
        </div>

        <SectionDivider />

        {/* Tone */}
        <h2 className="text-[24px] font-semibold text-charcoal-900 mb-2">
          How your tone changed
        </h2>
        <p className="text-[14px] text-charcoal-500 leading-relaxed mb-6 max-w-lg">
          Approximate linguistic signals — based on word patterns, not
          intent. Useful as directional indicators, not measurements.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {(['assertiveness', 'emotionality', 'formality', 'urgency'] as const).map((marker) => {
            const series = toneTrends.value[marker];
            const first = series[0]?.value ?? 0;
            const last = series[series.length - 1]?.value ?? 0;
            const direction = last > first + 0.05 ? '↑' : last < first - 0.05 ? '↓' : '—';

            return (
              <div key={marker} className="card p-4">
                <p className="text-[11px] text-charcoal-400 uppercase tracking-wider mb-2">{marker}</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-[20px] font-semibold text-charcoal-900">{last.toFixed(2)}</span>
                  <span className={`text-[13px] ${direction === '↑' ? 'text-accent-600' : direction === '↓' ? 'text-amber-600' : 'text-charcoal-300'}`}>
                    {direction}
                  </span>
                </div>
                <SparkLine data={series} width={120} height={24} />
                <p className="text-[11px] text-charcoal-300 mt-2">
                  {first.toFixed(2)} &rarr; {last.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
        <EpistemicBadge status={toneTrends.status} />

        <SectionDivider />

        {/* Period comparison */}
        <PeriodComparisonPanel
          posts={activeProfile!.posts}
          periods={activeProfile!.timePeriods}
        />

        <GovernanceBlock>
          Algorithmic feeds rank content by predicted engagement, not
          chronology. This creates differential visibility — some posting
          patterns get amplified, others don&apos;t. Whether that shapes what
          people post next is the question this page helps explore.
        </GovernanceBlock>
      </div>
    </div>
  );
}
