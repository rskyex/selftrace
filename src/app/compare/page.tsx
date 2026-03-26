'use client';

import { useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { HowToRead } from '@/components/shared/HowToRead';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { CaveatPanel } from '@/components/shared/CaveatPanel';
import { GovernanceBlock } from '@/components/shared/GovernanceBlock';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function ComparePage() {
  const { activeProfile, analysis, isLoaded } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div>
        <PageHeader
          title="Self vs. Rewarded Persona"
          subtitle="Compare your self-described identity with what your data shows."
        />
        <div className="wide-column px-6 pb-24">
          <p className="text-[15px] text-ink-500 leading-relaxed mb-8 max-w-lg">
            This page compares three versions of your online self: the self
            you started with, the self that gets rewarded, and the self
            you became. Connect your data to explore.
          </p>
          <ProfileSwitcher />
        </div>
      </div>
    );
  }

  const { engagementSensitivity, selfDescriptionShift, topicEntropy, toneTrends } = analysis;
  const posts = activeProfile!.posts;

  // Compute the three personas
  const personas = useMemo(() => {
    const halfPoint = Math.floor(posts.length / 2);
    const earlyPosts = posts.slice(0, halfPoint);
    const latePosts = posts.slice(halfPoint);

    // Early self: topics and tone from first half
    const earlyTopics: Record<string, number> = {};
    for (const p of earlyPosts) {
      if (!p.derived) continue;
      for (const t of p.derived.topics) {
        earlyTopics[t.topic] = (earlyTopics[t.topic] || 0) + 1;
      }
    }
    const earlyTopTopics = Object.entries(earlyTopics)
      .sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);

    const earlyTone = {
      assertiveness: earlyPosts.reduce((s, p) => s + (p.derived?.tone.assertiveness ?? 0), 0) / earlyPosts.length,
      emotionality: earlyPosts.reduce((s, p) => s + (p.derived?.tone.emotionality ?? 0), 0) / earlyPosts.length,
      formality: earlyPosts.reduce((s, p) => s + (p.derived?.tone.formality ?? 0), 0) / earlyPosts.length,
    };

    // Current self: topics and tone from second half
    const lateTopics: Record<string, number> = {};
    for (const p of latePosts) {
      if (!p.derived) continue;
      for (const t of p.derived.topics) {
        lateTopics[t.topic] = (lateTopics[t.topic] || 0) + 1;
      }
    }
    const lateTopTopics = Object.entries(lateTopics)
      .sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);

    const lateTone = {
      assertiveness: latePosts.reduce((s, p) => s + (p.derived?.tone.assertiveness ?? 0), 0) / latePosts.length,
      emotionality: latePosts.reduce((s, p) => s + (p.derived?.tone.emotionality ?? 0), 0) / latePosts.length,
      formality: latePosts.reduce((s, p) => s + (p.derived?.tone.formality ?? 0), 0) / latePosts.length,
    };

    // Rewarded self: topics that got above-average engagement
    const rewardedTopics = engagementSensitivity
      ? engagementSensitivity.value
          .sort((a, b) => b.averageEngagement - a.averageEngagement)
          .slice(0, 5)
          .map(t => t.topic)
      : [];

    // Compute topic overlap
    const overlap = (a: string[], b: string[]) => {
      const setB = new Set(b);
      return a.filter(t => setB.has(t)).length;
    };

    return {
      early: { topics: earlyTopTopics, tone: earlyTone, topicCount: Object.keys(earlyTopics).length },
      current: { topics: lateTopTopics, tone: lateTone, topicCount: Object.keys(lateTopics).length },
      rewarded: { topics: rewardedTopics },
      earlyCurrentOverlap: overlap(earlyTopTopics, lateTopTopics),
      earlyRewardedOverlap: overlap(earlyTopTopics, rewardedTopics),
      currentRewardedOverlap: overlap(lateTopTopics, rewardedTopics),
    };
  }, [posts, engagementSensitivity]);

  // Determine divergences
  const topicNarrowed = personas.current.topicCount < personas.early.topicCount * 0.7;
  const alignedWithReward = personas.currentRewardedOverlap >= 3;
  const driftedFromEarly = personas.earlyCurrentOverlap <= 2;

  return (
    <div>
      <PageHeader
        title="Self vs. Rewarded Persona"
        subtitle={`Three versions of ${activeProfile!.label.toLowerCase()}`}
      />

      <div className="wide-column px-6 pb-24">
        <CaveatPanel title="What this comparison shows — and doesn't">
          This page compares your early posting self, your current posting self,
          and what gets rewarded with engagement. Differences between them are
          real patterns in the data. But why they differ — life change, growth,
          platform adaptation, or something else — is for you to interpret.
        </CaveatPanel>

        <HowToRead>
          We split your posting history in half to create an &ldquo;early
          self&rdquo; and a &ldquo;current self.&rdquo; The &ldquo;rewarded
          self&rdquo; is derived from which topics earned above-average
          engagement. You can see where these three versions align — and
          where they diverge.
        </HowToRead>

        {/* Three-column persona cards */}
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          <div className="card p-6">
            <div className="w-10 h-10 rounded-full bg-linen-200 flex items-center justify-center mb-4">
              <span className="text-[16px]" aria-hidden="true">1</span>
            </div>
            <h3 className="font-display text-[18px] text-ink-900 mb-1">Your early self</h3>
            <p className="text-[13px] text-ink-400 mb-4">First half of your posting history</p>

            <p className="text-[11px] font-medium text-ink-400 uppercase tracking-wider mb-2">Top topics</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {personas.early.topics.map(t => (
                <span key={t} className="pill bg-linen-200 text-ink-700">{t}</span>
              ))}
            </div>

            <p className="text-[11px] font-medium text-ink-400 uppercase tracking-wider mb-2">Tone</p>
            <div className="space-y-1 text-[12px]">
              <div className="flex justify-between"><span className="text-ink-400">Assertiveness</span><span className="font-mono">{personas.early.tone.assertiveness.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-ink-400">Emotionality</span><span className="font-mono">{personas.early.tone.emotionality.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-ink-400">Formality</span><span className="font-mono">{personas.early.tone.formality.toFixed(2)}</span></div>
            </div>
            <div className="mt-3">
              <EpistemicBadge status="observed" />
            </div>
          </div>

          <div className="card p-6 bg-accent-50 border-accent-200">
            <div className="w-10 h-10 rounded-full bg-accent-200 text-accent-700 flex items-center justify-center mb-4">
              <span className="text-[16px] font-semibold" aria-hidden="true">2</span>
            </div>
            <h3 className="font-display text-[18px] text-ink-900 mb-1">Your current self</h3>
            <p className="text-[13px] text-ink-400 mb-4">Second half of your posting history</p>

            <p className="text-[11px] font-medium text-ink-400 uppercase tracking-wider mb-2">Top topics</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {personas.current.topics.map(t => (
                <span key={t} className="pill bg-accent-100 text-accent-700">{t}</span>
              ))}
            </div>

            <p className="text-[11px] font-medium text-ink-400 uppercase tracking-wider mb-2">Tone</p>
            <div className="space-y-1 text-[12px]">
              <div className="flex justify-between"><span className="text-ink-400">Assertiveness</span><span className="font-mono">{personas.current.tone.assertiveness.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-ink-400">Emotionality</span><span className="font-mono">{personas.current.tone.emotionality.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-ink-400">Formality</span><span className="font-mono">{personas.current.tone.formality.toFixed(2)}</span></div>
            </div>
            <div className="mt-3">
              <EpistemicBadge status="observed" />
            </div>
          </div>

          <div className="card p-6 bg-amber-100/30 border-amber-200">
            <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center mb-4">
              <span className="text-[16px] font-semibold" aria-hidden="true">R</span>
            </div>
            <h3 className="font-display text-[18px] text-ink-900 mb-1">Your rewarded self</h3>
            <p className="text-[13px] text-ink-400 mb-4">What gets the most engagement</p>

            <p className="text-[11px] font-medium text-ink-400 uppercase tracking-wider mb-2">Highest-engagement topics</p>
            {personas.rewarded.topics.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {personas.rewarded.topics.map(t => (
                  <span key={t} className="pill bg-amber-200 text-amber-700">{t}</span>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-ink-300 italic mb-4">No engagement data</p>
            )}

            <p className="text-[12px] text-ink-500 leading-relaxed">
              This is the version of you that the engagement metric rewards.
              It&apos;s not the &ldquo;real&rdquo; you — it&apos;s the version that
              generates visible response.
            </p>
            <div className="mt-3">
              <EpistemicBadge status="inferred" />
            </div>
          </div>
        </div>

        <SectionDivider />

        {/* Alignment analysis */}
        <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 mb-2">
          Where they align — and diverge
        </h2>
        <p className="text-[14px] text-ink-500 leading-relaxed mb-8 max-w-lg">
          Differences between your three selves are patterns in the data,
          not judgments about who you should be.
        </p>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="card p-5 text-center">
            <p className="text-[32px] font-semibold text-ink-900">{personas.earlyCurrentOverlap}/5</p>
            <p className="text-[13px] text-ink-500 mt-1">topics overlap between early and current self</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-[32px] font-semibold text-ink-900">{personas.currentRewardedOverlap}/5</p>
            <p className="text-[13px] text-ink-500 mt-1">current topics that are also highest-engagement</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-[32px] font-semibold text-ink-900">{personas.earlyRewardedOverlap}/5</p>
            <p className="text-[13px] text-ink-500 mt-1">early topics that became highest-engagement</p>
          </div>
        </div>

        {/* Narrative interpretation */}
        <div className="card p-6 bg-linen-100/50">
          <h3 className="text-[16px] font-semibold text-ink-900 mb-3">What this pattern suggests</h3>
          <div className="space-y-3 text-[14px] text-charcoal-600 leading-relaxed">
            {driftedFromEarly && (
              <p>
                Your current topics have significantly shifted from your early
                posting focus. This could reflect natural growth, changing
                interests, or a gradual drift toward what resonates on the
                platform.
              </p>
            )}
            {alignedWithReward && (
              <p>
                Your current posting topics closely overlap with your
                highest-engagement topics. This alignment is consistent with
                engagement sensitivity — though it could equally reflect
                genuine expertise deepening or audience-appropriate content.
              </p>
            )}
            {topicNarrowed && (
              <p>
                Your topic range narrowed over time. You went from posting
                about {personas.early.topicCount} distinct topics to{' '}
                {personas.current.topicCount}. Narrowing is common in
                sustained activity and may be entirely intentional.
              </p>
            )}
            {!driftedFromEarly && !alignedWithReward && !topicNarrowed && (
              <p>
                Your posting patterns show relative consistency over time,
                with moderate alignment between your topics and engagement
                patterns. This suggests a stable posting identity.
              </p>
            )}
          </div>
          <div className="mt-3">
            <EpistemicBadge status="speculative" />
          </div>
        </div>

        <GovernanceBlock>
          When the version of yourself that gets rewarded differs from the
          version you started with, the question is whether you chose the
          change or whether the incentive environment nudged you toward it.
          This tool can show the gap. It can&apos;t determine who made the choice.
        </GovernanceBlock>
      </div>
    </div>
  );
}
