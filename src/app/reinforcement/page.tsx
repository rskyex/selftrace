'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { HowToRead } from '@/components/shared/HowToRead';
import { CaveatPanel } from '@/components/shared/CaveatPanel';
import { EmptyState } from '@/components/shared/EmptyState';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { AreaChart } from '@/components/shared/AreaChart';
import { GovernanceBlock } from '@/components/shared/GovernanceBlock';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';
import { useState } from 'react';

export default function ReinforcementPage() {
  const { activeProfile, analysis, isLoaded } = useData();
  const [showCorrelation, setShowCorrelation] = useState(false);

  if (!isLoaded || !analysis) {
    return (
      <div>
        <PageHeader
          title="Reinforcement Analysis"
          subtitle="Examining correlations between engagement and repeated patterns."
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

  const { engagementSensitivity, reinforcementCorrelation } = analysis;

  if (!engagementSensitivity) {
    return (
      <div>
        <PageHeader title="Reinforcement Analysis" />
        <EmptyState
          title="Engagement data not available."
          message="Your dataset does not include engagement metrics. This analysis requires engagement data to examine reinforcement patterns. Other analyses — timeline, narrative — remain available."
          actions={[{ label: 'Go to timeline', href: '/timeline' }]}
        />
      </div>
    );
  }

  const highEngTopics = engagementSensitivity.value.filter(t => t.frequencyTrend === 'increasing');
  const counterPatterns = engagementSensitivity.value.filter(
    t => t.averageEngagement < (engagementSensitivity.value.reduce((s, t) => s + t.averageEngagement, 0) / engagementSensitivity.value.length) * 0.5 &&
    t.frequencyTrend !== 'decreasing'
  );

  return (
    <div>
      <PageHeader
        title="Reinforcement Analysis"
        subtitle={`Examining engagement-content correlations for: ${activeProfile!.label}`}
      />

      <div className="reading-column px-6 pb-24">
        <CaveatPanel>
          Correlation between engagement and subsequent content patterns does not
          establish that engagement caused those patterns. You may have repeated
          topics because you found them meaningful, because your life circumstances
          focused your attention, or for reasons entirely unrelated to platform
          feedback. This analysis surfaces a temporal correlation. It does not —
          and cannot — determine why you posted what you posted.
        </CaveatPanel>

        <HowToRead>
          This page examines whether content that received more engagement
          correlates with patterns you repeated or amplified. All findings are
          correlational. The caveat panel above is not optional context — it is
          the interpretive frame for everything that follows.
        </HowToRead>

        {/* Engagement by Topic */}
        <h2 className="text-[22px] text-charcoal-900 mt-10 mb-4">
          Engagement Distribution by Topic
        </h2>
        <p className="text-[14px] text-charcoal-500 leading-relaxed mb-4">
          Average engagement for each topic in the dataset. This is a distribution,
          not a ranking.
        </p>

        <div className="space-y-2">
          {engagementSensitivity.value.map((topic) => {
            const maxEng = Math.max(...engagementSensitivity.value.map(t => t.averageEngagement), 1);
            const barWidth = (topic.averageEngagement / maxEng) * 100;

            return (
              <div key={topic.topic} className="flex items-center gap-3">
                <span className="font-interface text-[12px] text-charcoal-700 w-36 truncate text-right">
                  {topic.topic}
                </span>
                <div className="flex-1 bg-cream-200 h-5 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-teal-700 opacity-50 rounded-sm transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] text-charcoal-500 w-12 text-right">
                  {topic.averageEngagement}
                </span>
                <span className={`font-interface text-[10px] w-16 ${
                  topic.frequencyTrend === 'increasing' ? 'text-teal-700' :
                  topic.frequencyTrend === 'decreasing' ? 'text-charcoal-300' :
                  'text-charcoal-500'
                }`}>
                  {topic.frequencyTrend}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-3">
          <EpistemicBadge status={engagementSensitivity.status} />
        </div>

        <SectionDivider />

        {/* High-Engagement Characteristics */}
        {highEngTopics.length > 0 && (
          <>
            <h2 className="text-[22px] text-charcoal-900 mb-4">
              Topics with Increasing Frequency After Higher Engagement
            </h2>
            <p className="text-[14px] text-charcoal-500 leading-relaxed mb-4">
              These topics received above-average engagement and their posting
              frequency increased over the observed period. This correlation is
              noted, not explained.
            </p>
            <div className="space-y-3">
              {highEngTopics.map(topic => (
                <div key={topic.topic} className="p-4 bg-cream-100 border border-cream-200 rounded-sm">
                  <p className="text-[15px] text-charcoal-900">{topic.topic}</p>
                  <p className="font-interface text-[12px] text-charcoal-500 mt-1">
                    {topic.postCount} posts · avg engagement: {topic.averageEngagement} · frequency: {topic.frequencyTrend}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <EpistemicBadge status="inferred" />
            </div>

            <SectionDivider />
          </>
        )}

        {/* Reinforcement Correlation — opt-in */}
        <h2 className="text-[22px] text-charcoal-900 mb-4">
          Did Engagement-Correlated Patterns Recur?
        </h2>

        {!showCorrelation ? (
          <button
            onClick={() => setShowCorrelation(true)}
            className="text-[14px] text-teal-700 hover:text-teal-500 transition-colors duration-300"
          >
            Show reinforcement analysis
          </button>
        ) : (
          reinforcementCorrelation && (
            <div>
              <p className="text-[14px] text-charcoal-500 leading-relaxed mb-4">
                Correlation between prior-quarter topic engagement and current-quarter
                posting frequency. A positive correlation suggests — but does not prove —
                that higher-engagement topics were posted about more frequently in
                the following period.
              </p>
              <AreaChart
                data={reinforcementCorrelation.value}
                caption={reinforcementCorrelation.caveat}
                status={reinforcementCorrelation.status}
                color="amber"
              />
            </div>
          )
        )}

        <SectionDivider />

        {/* Counter-Patterns */}
        {counterPatterns.length > 0 && (
          <>
            <h2 className="text-[22px] text-charcoal-900 mb-4">
              Content Maintained Without Engagement Reward
            </h2>
            <p className="text-[14px] text-charcoal-500 leading-relaxed mb-4">
              These topics persisted in the posting history despite receiving
              below-average engagement. Their presence may indicate commitments
              independent of platform feedback.
            </p>
            <div className="space-y-2">
              {counterPatterns.map(topic => (
                <div key={topic.topic} className="py-2 border-b border-cream-200">
                  <span className="text-[15px] text-charcoal-700">{topic.topic}</span>
                  <span className="font-interface text-[11px] text-charcoal-300 ml-3">
                    {topic.postCount} posts · low engagement · persisted
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <EpistemicBadge status="observed" />
            </div>
          </>
        )}

        <GovernanceBlock>
          Most major platforms provide engagement metrics (likes, shares, replies)
          as visible feedback on each post. This creates a variable-ratio
          reinforcement environment — some posts receive substantial feedback,
          others receive little, with no consistent pattern visible to the user.
          Behavioral research associates variable-ratio schedules with persistent
          repetition of rewarded behaviors. Whether this design is intentional or
          incidental is not publicly known.
        </GovernanceBlock>
      </div>
    </div>
  );
}
