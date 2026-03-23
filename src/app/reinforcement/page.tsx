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
          subtitle="Examining whether engagement patterns correlate with content repetition."
        />
        <div className="reading-column px-6 pb-24">
          <p className="text-[15px] text-charcoal-500 leading-relaxed mb-8">
            This page examines correlations between engagement metrics and
            subsequent posting patterns. Select a demo profile to begin.
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
          message="Your dataset does not include engagement metrics (likes, shares, replies, views). This analysis requires engagement data to examine reinforcement patterns. Timeline and narrative analyses remain available."
          actions={[
            { label: 'Go to timeline', href: '/timeline' },
            { label: 'Go to narrative', href: '/narrative' },
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
        title="Reinforcement Analysis"
        subtitle={`Examining: ${activeProfile!.label}`}
      />

      <div className="reading-column px-6 pb-24">
        {/* Caveat first — this is the interpretive frame, not a footnote */}
        <CaveatPanel>
          <p className="mb-3">
            Correlation between engagement and subsequent content patterns does
            not establish that engagement caused those patterns. You may have
            repeated topics because you found them meaningful, because your life
            circumstances focused your attention, because of external events, or
            for reasons entirely unrelated to platform feedback.
          </p>
          <p>
            This page surfaces a temporal correlation. It does not — and
            cannot — determine why you posted what you posted. The caveat is
            not supplementary context. It is the interpretive frame for
            everything that follows.
          </p>
        </CaveatPanel>

        <HowToRead>
          This page asks: did content that received more engagement correlate
          with patterns you repeated over time? All findings are correlational.
          Counter-patterns — content you maintained without engagement reward —
          are shown with equal weight, because persistence against incentive
          is as informative as alignment with it.
        </HowToRead>

        {/* ── Engagement Distribution ──────────────────────── */}
        <h2 className="text-[22px] text-charcoal-900 mt-14 mb-3">
          Engagement Distribution by Topic
        </h2>
        <p className="text-[14px] text-charcoal-500 leading-relaxed mb-6">
          Average engagement for each topic. This is a distribution, not a
          ranking — no topic is &ldquo;better&rdquo; or &ldquo;worse&rdquo;
          for receiving more or less engagement.
        </p>

        <div className="space-y-1.5">
          {engagementSensitivity.value.map((topic) => {
            const maxEng = Math.max(...engagementSensitivity.value.map(t => t.averageEngagement), 1);
            const barWidth = (topic.averageEngagement / maxEng) * 100;

            return (
              <div key={topic.topic} className="flex items-center gap-3">
                <span className="font-interface text-[11px] text-charcoal-500 w-36 truncate text-right">
                  {topic.topic}
                </span>
                <div className="flex-1 bg-cream-200 h-4 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-charcoal-300 rounded-sm transition-all duration-700"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-charcoal-400 w-10 text-right">
                  {topic.averageEngagement}
                </span>
                <span className="font-interface text-[10px] text-charcoal-400 w-16 text-center uppercase tracking-wide">
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

        {/* ── High-Engagement Characteristics ──────────────── */}
        {highEngTopics.length > 0 && (
          <>
            <h2 className="text-[22px] text-charcoal-900 mb-3">
              Topics with Increasing Frequency After Higher Engagement
            </h2>
            <p className="text-[14px] text-charcoal-500 leading-relaxed mb-6">
              These topics received above-average engagement and their posting
              frequency increased over the observed period. This temporal
              correlation is noted, not explained — many factors beyond
              engagement feedback can produce the same pattern.
            </p>
            <div className="space-y-3">
              {highEngTopics.map(topic => (
                <div key={topic.topic} className="py-3 border-b border-cream-200">
                  <p className="text-[15px] text-charcoal-900">{topic.topic}</p>
                  <p className="font-interface text-[11px] text-charcoal-400 mt-1">
                    {topic.postCount} posts · avg engagement {topic.averageEngagement} · frequency {topic.frequencyTrend}
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

        {/* ── Counter-Patterns — given equal visual weight ── */}
        {counterPatterns.length > 0 && (
          <>
            <h2 className="text-[22px] text-charcoal-900 mb-3">
              Content Maintained Without Engagement Reward
            </h2>
            <p className="text-[14px] text-charcoal-500 leading-relaxed mb-6">
              These topics persisted in the posting history despite receiving
              below-average engagement. Their presence suggests commitments that
              operate independently of visible feedback — interests, values, or
              habits that the engagement metric does not capture.
            </p>
            <div className="space-y-3">
              {counterPatterns.map(topic => (
                <div key={topic.topic} className="py-3 border-b border-cream-200">
                  <p className="text-[15px] text-charcoal-700">{topic.topic}</p>
                  <p className="font-interface text-[11px] text-charcoal-400 mt-1">
                    {topic.postCount} posts · low engagement · persisted
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <EpistemicBadge status="observed" />
            </div>

            <SectionDivider />
          </>
        )}

        {/* ── Reinforcement Correlation — opt-in ───────────── */}
        <h2 className="text-[22px] text-charcoal-900 mb-3">
          Engagement–Frequency Correlation Over Time
        </h2>
        <p className="text-[14px] text-charcoal-500 leading-relaxed mb-4">
          This chart measures whether topics that received higher engagement in
          one quarter appear more frequently in the next. A positive correlation
          is consistent with — but does not prove — sensitivity to engagement
          feedback. It is also consistent with shared external events, genuine
          interest deepening, and many other explanations.
        </p>

        {!showCorrelation ? (
          <div className="bg-cream-100 border border-cream-200 rounded-sm p-5">
            <p className="text-[13px] text-charcoal-500 leading-relaxed mb-3">
              This analysis carries the highest epistemic uncertainty of any
              view in this tool. It is labeled <em>speculative</em> because
              the correlation it shows is the most easily misread as causal.
            </p>
            <button
              onClick={() => setShowCorrelation(true)}
              className="font-interface text-[12px] text-teal-700 hover:text-teal-500 transition-colors duration-300"
            >
              Show reinforcement correlation
            </button>
          </div>
        ) : (
          reinforcementCorrelation && (
            <AreaChart
              data={reinforcementCorrelation.value}
              caption={reinforcementCorrelation.caveat}
              status={reinforcementCorrelation.status}
              color="amber"
            />
          )
        )}

        <div className="mt-12">
          <GovernanceBlock>
            Most major platforms provide engagement metrics — likes, shares,
            replies — as visible feedback on each post. This creates a
            variable-ratio feedback environment: some posts receive substantial
            response, others little, with no consistent pattern legible to the
            user. Behavioral research associates variable-ratio schedules with
            persistent repetition of rewarded behaviors. Whether platform
            engagement feedback operates on self-expression in this way is an
            open research question, not an established finding.
          </GovernanceBlock>
        </div>
      </div>
    </div>
  );
}
