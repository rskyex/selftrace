'use client';

import Link from 'next/link';
import { SparkLine } from '@/components/shared/SparkLine';
import { ConfidenceDot } from '@/components/shared/ConfidenceDot';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function SelvesPage() {
  const { activeProfile, analysis, isLoaded, selfPortrait } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div className="reading-column px-6 pt-24 pb-24">
        <h1 className="font-display text-[30px] md:text-[36px] tracking-tight text-ink-900 leading-[1.1] mb-4">The self you described and the self the traces show</h1>
        <p className="text-ink-500 mb-10">Load a profile to see the comparison.</p>
        <ProfileSwitcher />
      </div>
    );
  }

  const profile = activeProfile!;
  const { engagementSensitivity, selfDescriptionShift, toneTrends } = analysis;

  // Top topics
  const topicCounts: Record<string, number> = {};
  for (const p of profile.posts) { if (p.derived) for (const t of p.derived.topics) topicCounts[t.topic] = (topicCounts[t.topic] || 0) + 1; }
  const topTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Late self-descriptions
  const lateDescs = selfDescriptionShift.value.late;
  const descCounts: Record<string, number> = {};
  for (const d of lateDescs) descCounts[d.phrase] = (descCounts[d.phrase] || 0) + 1;
  const topDescs = Object.entries(descCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);

  // Engagement-based "rewarded self"
  const avgEng = engagementSensitivity ? engagementSensitivity.value.reduce((s, t) => s + t.averageEngagement, 0) / engagementSensitivity.value.length : 0;
  const rewardedTopics = engagementSensitivity?.value.filter(t => t.averageEngagement > avgEng * 1.3).sort((a, b) => b.averageEngagement - a.averageEngagement).slice(0, 4) ?? [];

  // Tone
  const toneLabels: Record<string, string> = { assertiveness: 'assertive', emotionality: 'emotional', formality: 'formal', urgency: 'urgent' };
  const toneSummary = (['assertiveness', 'emotionality', 'formality', 'urgency'] as const).map(m => {
    const s = toneTrends.value[m];
    const f = s[0]?.value ?? 0, l = s[s.length - 1]?.value ?? 0;
    return { metric: m, label: toneLabels[m], first: f, last: l, delta: l - f, data: s };
  }).filter(t => Math.abs(t.delta) > 0.05);

  return (
    <div className="reading-column px-6 pt-24 pb-24">
      <h1 className="font-display text-[30px] md:text-[36px] tracking-tight text-ink-900 leading-[1.1] mb-3">
        The self you described and the self the traces show
      </h1>
      <p className="text-[17px] text-ink-500 leading-[1.8] mb-16">
        Before we looked at your data, you described yourself. Here, we place those
        descriptions beside what your posting history actually contains. Where they
        converge, your self-knowledge matches the visible record. Where they diverge,
        something happened in the space between.
      </p>

      {/* ── The experienced self ─────────────────── */}
      {selfPortrait && (
        <section className="mb-20">
          <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-6">
            How you experience yourself
          </h2>
          <div className="observation mb-4">
            {selfPortrait.whatMatters && (
              <div className="mb-5">
                <p className="font-sans text-[12px] text-ink-400 mb-1">What matters most to you</p>
                <p className="text-[18px] text-ink-700 italic leading-snug">&ldquo;{selfPortrait.whatMatters}&rdquo;</p>
              </div>
            )}
            {selfPortrait.returnTo && (
              <div className="mb-5">
                <p className="font-sans text-[12px] text-ink-400 mb-1">What you think you return to most</p>
                <p className="text-[17px] text-ink-700 italic">&ldquo;{selfPortrait.returnTo}&rdquo;</p>
              </div>
            )}
            {selfPortrait.mostVisible && (
              <div className="mb-5">
                <p className="font-sans text-[12px] text-ink-400 mb-1">What feels most visible</p>
                <p className="text-[17px] text-ink-700 italic">&ldquo;{selfPortrait.mostVisible}&rdquo;</p>
              </div>
            )}
            {selfPortrait.leastVisible && (
              <div className="mb-5">
                <p className="font-sans text-[12px] text-ink-400 mb-1">What feels least visible</p>
                <p className="text-[17px] text-ink-700 italic">&ldquo;{selfPortrait.leastVisible}&rdquo;</p>
              </div>
            )}
            {selfPortrait.hasChanged && (
              <div>
                <p className="font-sans text-[12px] text-ink-400 mb-1">Whether your online self has changed</p>
                <p className="text-[17px] text-ink-700 italic">&ldquo;{selfPortrait.hasChanged}&rdquo;</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── The trace-reconstructed self ──────────── */}
      <section className="mb-20">
        <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-6">
          The self the traces show
        </h2>
        <div className="observation-umber mb-6">
          <h3>What you actually posted about most</h3>
          <div className="flex flex-wrap gap-2 mt-3">
            {topTopics.map(([t, c]) => (
              <span key={t} className="pill bg-umber-100 text-umber-700">{t} <span className="text-umber-500 ml-1 text-[11px]">{c}</span></span>
            ))}
          </div>
        </div>

        {topDescs.length > 0 && (
          <div className="observation-umber mb-6">
            <h3>How you described yourself in posts</h3>
            {topDescs.map(([phrase, count]) => (
              <p key={phrase} className="text-[15px] text-ink-700 mt-2">
                &ldquo;{phrase}&rdquo; <span className="font-sans text-[12px] text-ink-400">&mdash; {count} times</span>
              </p>
            ))}
          </div>
        )}

        {toneSummary.length > 0 && (
          <div className="observation-umber mb-6">
            <h3>How your tone shifted</h3>
            <div className="space-y-3 mt-3">
              {toneSummary.map(t => (
                <div key={t.metric} className="flex items-center gap-4">
                  <span className="font-sans text-[13px] text-ink-500 w-24 capitalize">{t.label}</span>
                  <SparkLine data={t.data} width={80} height={20} color="#B5704D" />
                  <span className="font-sans text-[12px] text-ink-400">
                    {t.first.toFixed(2)} &rarr; {t.last.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[14px] text-ink-400 mt-3">
              These are approximate measures of word patterns, not emotional states.
            </p>
          </div>
        )}
        <ConfidenceDot level="patterned" />
      </section>

      {/* ── The rewarded self ────────────────────── */}
      {rewardedTopics.length > 0 && (
        <section className="mb-20">
          <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-4">
            The self the environment rewarded
          </h2>
          <p className="text-[16px] text-ink-500 leading-[1.8] mb-6">
            A third version: the parts of your expression that consistently received
            the most engagement. This is the you the environment selected for &mdash;
            not necessarily who you are, but who was most visible to others.
          </p>
          {rewardedTopics.map(t => (
            <div key={t.topic} className="observation-umber mb-2 py-4 px-6">
              <p className="font-sans text-[14px] text-ink-700">{t.topic}</p>
              <p className="font-sans text-[12px] text-ink-400">{t.postCount} posts &middot; consistently above-average engagement</p>
            </div>
          ))}
          <div className="mt-3"><ConfidenceDot level="interpretive" /></div>
        </section>
      )}

      {/* ── The gap ──────────────────────────────── */}
      <section className="border-t border-linen-200 pt-12">
        <p className="text-[17px] text-ink-700 leading-[1.8] mb-4">
          Three versions of you: how you experience yourself, what the traces contain,
          and what the environment rewarded. They&apos;re not supposed to match perfectly.
          No one&apos;s would.
        </p>
        <p className="text-[16px] text-ink-500 leading-[1.8]">
          The interesting question isn&apos;t which version is &ldquo;real.&rdquo; It&apos;s what
          happened in the gaps between them &mdash; and whether any of those gaps
          feel like something you&apos;d want to close, widen, or simply understand.
        </p>
      </section>

      <div className="mt-12 flex flex-wrap gap-6">
        <Link href="/rewarded" className="text-link text-[14px]">&larr; What the environment rewarded</Link>
        <Link href="/shifted" className="text-link text-[14px]">How things shifted &rarr;</Link>
      </div>
    </div>
  );
}
