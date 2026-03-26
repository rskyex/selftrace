'use client';

import Link from 'next/link';
import { ConfidenceDot } from '@/components/shared/ConfidenceDot';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function KeptPage() {
  const { activeProfile, analysis, isLoaded, selfPortrait } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div className="reading-column px-6 pt-24 pb-24">
        <h1 className="font-display text-[30px] md:text-[36px] tracking-tight text-ink-900 leading-[1.1] mb-4">What you kept</h1>
        <p className="text-ink-500 mb-10">Load a profile to see what persisted.</p>
        <ProfileSwitcher />
      </div>
    );
  }

  const { engagementSensitivity, selfDescriptionShift, narrativeRepetition } = analysis;
  const avgEng = engagementSensitivity ? engagementSensitivity.value.reduce((s, t) => s + t.averageEngagement, 0) / engagementSensitivity.value.length : 0;

  // Persistent topics: low engagement, didn't decrease
  const persistent = engagementSensitivity?.value
    .filter(t => t.averageEngagement < avgEng * 0.6 && t.frequencyTrend !== 'decreasing')
    .sort((a, b) => b.postCount - a.postCount) ?? [];

  // Counter-trend: high engagement but didn't increase (resisted reward)
  const resisted = engagementSensitivity?.value
    .filter(t => t.averageEngagement > avgEng * 1.3 && t.frequencyTrend !== 'increasing')
    .slice(0, 3) ?? [];

  // Stable self-descriptions
  const earlyDescs = new Set(selfDescriptionShift.value.early.map(d => d.phrase));
  const lateDescs = new Set(selfDescriptionShift.value.late.map(d => d.phrase));
  const stableDescs = [...earlyDescs].filter(d => lateDescs.has(d));

  // Distributed phrases (not concentrated — spread across time)
  const distributedPhrases = narrativeRepetition.value.filter(p => p.temporalSpread === 'distributed').slice(0, 4);

  return (
    <div className="reading-column px-6 pt-24 pb-24">
      <h1 className="font-display text-[30px] md:text-[36px] tracking-tight text-ink-900 leading-[1.1] mb-3">
        What you kept
      </h1>
      <p className="text-[17px] text-ink-500 leading-[1.8] mb-20">
        Not everything followed the pattern. Some of what you expressed persisted
        without reward, resisted the trend, or remained stable while other things
        shifted. That persistence may be the clearest trace of your own agency.
      </p>

      {/* ── The Holdout ──────────────────────────── */}
      {persistent.length > 0 && (
        <section className="mb-24">
          <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-4">
            Kept without encouragement
          </h2>
          <p className="text-[16px] text-ink-500 leading-[1.8] mb-8">
            Below-average engagement, but you kept returning. The environment wasn&apos;t
            rewarding these &mdash; you continued because they mattered to you.
          </p>

          <div className="space-y-4">
            {persistent.map(t => (
              <div key={t.topic} className="observation-sage py-6 px-7">
                <p className="text-[19px] text-ink-900 font-semibold font-sans tracking-tight">{t.topic}</p>
                <p className="font-sans text-[13px] text-ink-500 mt-2">{t.postCount} posts &middot; below-average engagement &middot; you kept going</p>
              </div>
            ))}
          </div>
          <div className="mt-4"><ConfidenceDot level="counted" /></div>
        </section>
      )}

      {/* ── Resisted reward ──────────────────────── */}
      {resisted.length > 0 && (
        <section className="mb-24">
          <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-4">
            Resisted reward
          </h2>
          <p className="text-[16px] text-ink-500 leading-[1.8] mb-6">
            These topics got above-average engagement but you didn&apos;t post about them
            more. The environment was rewarding these, and you didn&apos;t follow the signal.
          </p>
          {resisted.map(t => (
            <div key={t.topic} className="observation-sage mb-3 py-4 px-6">
              <p className="font-sans text-[14px] text-ink-700">{t.topic}</p>
              <p className="font-sans text-[12px] text-ink-400">{t.postCount} posts &middot; above-average engagement &middot; frequency didn&apos;t increase</p>
            </div>
          ))}
          <div className="mt-3"><ConfidenceDot level="patterned" /></div>
        </section>
      )}

      {/* ── Stable self-descriptions ─────────────── */}
      {stableDescs.length > 0 && (
        <section className="mb-24">
          <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-4">
            Stable ground
          </h2>
          <p className="text-[16px] text-ink-500 leading-[1.8] mb-6">
            Self-descriptions that were present early and still present late. Your identity
            narrative held even as other things shifted.
          </p>
          {stableDescs.slice(0, 5).map(d => (
            <div key={d} className="observation-sage mb-2 py-4 px-6">
              <p className="text-[16px] text-ink-700 italic">&ldquo;{d}&rdquo;</p>
            </div>
          ))}
          <div className="mt-3"><ConfidenceDot level="counted" /></div>
        </section>
      )}

      {/* ── Consistent phrases ───────────────────── */}
      {distributedPhrases.length > 0 && (
        <section className="mb-24">
          <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-4">
            Language that held
          </h2>
          <p className="text-[16px] text-ink-500 leading-[1.8] mb-6">
            Phrases that appeared steadily across your history &mdash; not in bursts,
            but distributed. Consistent language is evidence of a consistent self.
          </p>
          {distributedPhrases.map(ph => (
            <div key={ph.phrase} className="observation-sage mb-2 py-4 px-6">
              <p className="text-[16px] text-ink-700 italic">&ldquo;{ph.phrase}&rdquo;</p>
              <p className="font-sans text-[12px] text-ink-400 mt-1">{ph.occurrences} times across the full period</p>
            </div>
          ))}
          <div className="mt-3"><ConfidenceDot level="counted" /></div>
        </section>
      )}

      {/* ── The Open Question ────────────────────── */}
      <div className="py-20 md:py-32">
        <div className="max-w-lg mx-auto prose-body text-center">
          <p className="text-[19px] text-ink-700 leading-[1.85]">
            You are always becoming yourself. You always were. What&apos;s different now
            is that the process has participants you couldn&apos;t see &mdash; systems that
            shape what you encounter, reward certain expressions, and make some
            versions of you easier to inhabit than others.
          </p>
          <p className="text-[19px] text-ink-700 leading-[1.85]">
            Now you&apos;ve seen some of their traces.
          </p>
          <p className="text-[19px] text-ink-500 leading-[1.85]">
            The question of what to do with that visibility is yours.
          </p>
        </div>
      </div>

      <div className="border-t border-linen-200 pt-10 flex flex-wrap gap-6">
        <Link href="/shifted" className="text-link text-[14px]">&larr; How things shifted</Link>
        <Link href="/results" className="text-link text-[14px]">Back to overview</Link>
      </div>
    </div>
  );
}
