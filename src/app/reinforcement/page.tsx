'use client';

import { useState } from 'react';
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

export default function ReinforcementPage() {
  const { activeProfile, analysis, isLoaded } = useData();
  const [showCorrelation, setShowCorrelation] = useState(false);

  if (!isLoaded || !analysis) {
    return (
      <div>
        <PageHeader
          title="What Gets Reinforced"
          subtitle="See which posts earned attention — and whether it shaped what came next."
        />
        <div className="wide-column px-6 pb-24">
          <ProfileSwitcher />
        </div>
      </div>
    );
  }

  const { engagementSensitivity, reinforcementCorrelation } = analysis;

  if (!engagementSensitivity) {
    return (
      <div>
        <PageHeader title="What Gets Reinforced" />
        <EmptyState
          title="No engagement data"
          message="This dataset doesn't include engagement metrics. Try a different profile or upload data with likes, shares, and replies."
          actions={[
            { label: 'Go to drift', href: '/drift' },
            { label: 'Go to identity', href: '/identity' },
          ]}
        />
      </div>
    );
  }

  const avgEngagement = engagementSensitivity.value.reduce((s, t) => s + t.averageEngagement, 0) / engagementSensitivity.value.length;
  const highEngTopics = engagementSensitivity.value.filter(t => t.frequencyTrend === 'increasing');
  const counterPatterns = engagementSensitivity.value.filter(
    t => t.averageEngagement < avgEngagement * 0.5 && t.frequencyTrend !== 'decreasing'
  );

  return (
    <div>
      <PageHeader
        title="What Gets Reinforced"
        subtitle={`Engagement patterns for ${activeProfile!.label.toLowerCase()}`}
      />

      <div className="wide-column px-6 pb-24">
        <CaveatPanel title="Correlation, not causation">
          Seeing a link between engagement and posting patterns doesn&apos;t prove
          one caused the other. You may have repeated topics because they
          mattered to you, because life focused your attention, or for reasons
          unrelated to platform feedback.
        </CaveatPanel>

        <HowToRead>
          This page asks: did posts that got more engagement correlate with
          patterns you repeated? Content you kept posting despite low
          engagement is shown equally — persistence against incentive is as
          interesting as alignment with it.
        </HowToRead>

        {/* Engagement by topic */}
        <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 mt-10 mb-2">
          Engagement by topic
        </h2>
        <p className="text-[14px] text-ink-500 leading-relaxed mb-6 max-w-lg">
          Average engagement for each topic. This is a distribution, not a
          ranking — more engagement doesn&apos;t mean better.
        </p>

        <div className="card p-5 space-y-2">
          {engagementSensitivity.value.map((topic) => {
            const maxEng = Math.max(...engagementSensitivity.value.map(t => t.averageEngagement), 1);
            const barWidth = (topic.averageEngagement / maxEng) * 100;

            return (
              <div key={topic.topic} className="flex items-center gap-3">
                <span className="text-[13px] text-ink-700 w-40 truncate text-right">
                  {topic.topic}
                </span>
                <div className="flex-1 bg-linen-100 h-5 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-accent-200 rounded-lg"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] text-ink-400 w-10 text-right">
                  {topic.averageEngagement}
                </span>
                <span className={`pill text-[10px] w-20 justify-center ${
                  topic.frequencyTrend === 'increasing' ? 'bg-accent-100 text-accent-700' :
                  topic.frequencyTrend === 'decreasing' ? 'bg-amber-100 text-amber-700' :
                  'bg-linen-100 text-ink-400'
                }`}>
                  {topic.frequencyTrend}
                </span>
              </div>
            );
          })}
          <div className="pt-2">
            <EpistemicBadge status={engagementSensitivity.status} />
          </div>
        </div>

        <SectionDivider />

        {/* Topics that grew with engagement */}
        {highEngTopics.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="font-display text-[20px] text-ink-900 mb-2">
                Topics that grew with attention
              </h2>
              <p className="text-[14px] text-ink-500 leading-relaxed mb-4">
                These received above-average engagement and you posted about
                them more over time.
              </p>
              <div className="space-y-2">
                {highEngTopics.map(topic => (
                  <div key={topic.topic} className="card p-4">
                    <p className="text-[15px] font-medium text-ink-900">{topic.topic}</p>
                    <p className="text-[12px] text-ink-400 mt-1">
                      {topic.postCount} posts &middot; avg engagement {topic.averageEngagement}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <EpistemicBadge status="inferred" />
              </div>
            </div>

            {/* Counter-patterns */}
            {counterPatterns.length > 0 && (
              <div>
                <h2 className="font-display text-[20px] text-ink-900 mb-2">
                  Topics you kept without reward
                </h2>
                <p className="text-[14px] text-ink-500 leading-relaxed mb-4">
                  These persisted despite low engagement — interests or values
                  that the engagement metric didn&apos;t capture.
                </p>
                <div className="space-y-2">
                  {counterPatterns.map(topic => (
                    <div key={topic.topic} className="card p-4 bg-sage-100/30 border-sage-200">
                      <p className="text-[15px] font-medium text-ink-900">{topic.topic}</p>
                      <p className="text-[12px] text-ink-400 mt-1">
                        {topic.postCount} posts &middot; low engagement &middot; persisted
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <EpistemicBadge status="observed" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Correlation chart — opt-in */}
        <h2 className="font-display text-[20px] text-ink-900 mb-2">
          Engagement-frequency correlation
        </h2>
        <p className="text-[14px] text-ink-500 leading-relaxed mb-4 max-w-lg">
          Did high-engagement topics in one quarter appear more in the next?
          A positive correlation is consistent with — but doesn&apos;t prove —
          sensitivity to engagement feedback.
        </p>

        {!showCorrelation ? (
          <div className="card p-5 bg-amber-100/30 border-amber-200">
            <p className="text-[13px] text-ink-500 mb-3">
              This carries the highest uncertainty of any analysis here.
              The correlation is easy to misread as causal.
            </p>
            <button
              onClick={() => setShowCorrelation(true)}
              className="text-[13px] font-medium text-accent-600 hover:text-accent-700"
            >
              Show correlation chart &rarr;
            </button>
          </div>
        ) : (
          reinforcementCorrelation && (
            <AreaChart
              data={reinforcementCorrelation.value}
              caption={reinforcementCorrelation.caveat}
              confidence="interpretive"
              color="umber"
            />
          )
        )}

        <GovernanceBlock>
          Platforms provide engagement metrics as visible feedback on each
          post, creating a variable-ratio feedback environment. Whether
          this shapes what people post next is an open research question.
        </GovernanceBlock>
      </div>
    </div>
  );
}
