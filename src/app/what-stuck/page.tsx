'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { AreaChart } from '@/components/shared/AreaChart';
import { ConfidenceDot } from '@/components/shared/ConfidenceDot';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function WhatStuckPage() {
  const { activeProfile, analysis, isLoaded } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div className="reading-column px-6 pt-24 pb-24">
        <h1 className="text-[32px] font-bold tracking-tight text-ink-900 mb-4">What stuck</h1>
        <p className="text-ink-400 mb-10">Which patterns got reinforced — and which ones you kept regardless.</p>
        <ProfileSwitcher />
      </div>
    );
  }

  const { engagementSensitivity, reinforcementCorrelation, narrativeRepetition, memoryEvents } = analysis;
  const avgEng = engagementSensitivity ? engagementSensitivity.value.reduce((s, t) => s + t.averageEngagement, 0) / engagementSensitivity.value.length : 0;
  const reinforced = engagementSensitivity?.value.filter(t => t.frequencyTrend === 'increasing' && t.averageEngagement > avgEng).sort((a, b) => b.averageEngagement - a.averageEngagement) ?? [];
  const persistent = engagementSensitivity?.value.filter(t => t.averageEngagement < avgEng * 0.5 && t.frequencyTrend !== 'decreasing') ?? [];

  const echoes = useMemo(() => {
    const m = new Map<string, typeof memoryEvents.value>();
    for (const ev of memoryEvents.value) { if (!m.has(ev.sharedPhrase)) m.set(ev.sharedPhrase, []); m.get(ev.sharedPhrase)!.push(ev); }
    return Array.from(m.entries()).sort((a, b) => b[1][0].daysBetween - a[1][0].daysBetween).slice(0, 5);
  }, [memoryEvents]);

  return (
    <div className="reading-column px-6 pt-24 pb-24">
      <h1 className="text-[32px] font-bold tracking-tight text-ink-900 mb-2">What stuck</h1>
      <p className="text-[17px] text-ink-400 mb-12">
        Patterns that repeated — some because they got attention, some because they mattered to you regardless.
      </p>

      {/* Reinforced */}
      {reinforced.length > 0 && (
        <section className="mb-16">
          <h2 className="text-[24px] font-bold text-ink-900 mb-2">Patterns that got rewarded</h2>
          <p className="text-[15px] text-ink-400 mb-6">
            These got more engagement than average, and you posted about them more over time.
            That doesn&apos;t prove the attention caused it. But the pattern is there.
          </p>
          {reinforced.map(t => (
            <div key={t.topic} className="observation mb-3">
              <h3>{t.topic}</h3>
              <p className="font-sans text-[13px]">{t.postCount} posts &middot; above-average response &middot; frequency increased</p>
            </div>
          ))}
          <ConfidenceDot level="low" />
        </section>
      )}

      {/* Persistent */}
      {persistent.length > 0 && (
        <section className="mb-16">
          <h2 className="text-[24px] font-bold text-ink-900 mb-2">What you kept without reward</h2>
          <p className="text-[15px] text-ink-400 mb-6">
            Below-average engagement, but you kept posting. That persistence suggests
            something meaningful — interests the engagement metric doesn&apos;t capture.
          </p>
          {persistent.map(t => (
            <div key={t.topic} className="observation-sage mb-3">
              <h3>{t.topic}</h3>
              <p className="font-sans text-[13px]">{t.postCount} posts &middot; low engagement &middot; you kept going</p>
            </div>
          ))}
          <ConfidenceDot level="high" />
        </section>
      )}

      {/* Recurring phrases */}
      {narrativeRepetition.value.length > 0 && (
        <section className="mb-16">
          <h2 className="text-[24px] font-bold text-ink-900 mb-2">Phrases you return to</h2>
          <p className="text-[15px] text-ink-400 mb-6">
            Phrases in 3+ posts. Repetition is normal — it can mean conviction, habit, or a developing voice.
          </p>
          <div className="space-y-2">
            {narrativeRepetition.value.slice(0, 8).map(ph => (
              <div key={ph.phrase} className="observation py-3 px-5">
                <p className="text-[16px] text-ink-700 italic">&ldquo;{ph.phrase}&rdquo;</p>
                <p className="font-sans text-[12px] text-ink-300 mt-1">{ph.occurrences} times &middot; {ph.temporalSpread}</p>
              </div>
            ))}
          </div>
          <div className="mt-3"><ConfidenceDot level="medium" /></div>
        </section>
      )}

      {/* Echoes */}
      {echoes.length > 0 && (
        <section className="mb-16">
          <h2 className="text-[24px] font-bold text-ink-900 mb-2">Echoes across time</h2>
          <p className="text-[15px] text-ink-400 mb-6">
            Phrasing that reappeared months apart. Could be habit, deliberate callback, or coincidence.
          </p>
          {echoes.map(([phrase, events]) => (
            <div key={phrase} className="observation py-3 px-5 mb-2">
              <p className="text-[16px] text-ink-700 italic">&ldquo;{phrase}&rdquo;</p>
              <p className="font-sans text-[12px] text-ink-300 mt-1">{events[0].daysBetween} days between occurrences</p>
            </div>
          ))}
          <div className="mt-3"><ConfidenceDot level="medium" /></div>
        </section>
      )}

      {/* Feedback loop */}
      {reinforcementCorrelation && (
        <section className="mb-16">
          <h2 className="text-[24px] font-bold text-ink-900 mb-2">The feedback loop question</h2>
          <p className="text-[15px] text-ink-400 mb-2">
            Did topics that got more attention one quarter show up more the next?
            This is our least certain analysis.
          </p>
          <AreaChart data={reinforcementCorrelation.value} confidence="low" color="gold" caption="Engagement-frequency correlation by quarter" />
        </section>
      )}

      {/* Closing */}
      <div className="border-t border-linen-200 pt-10">
        <p className="text-[17px] text-ink-500 leading-relaxed">
          Seeing these patterns doesn&apos;t mean the algorithm made you do anything. It means
          you can now notice things that were happening quietly in the background.
          Whether any of it matters is for you to decide.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-6">
        <Link href="/results" className="font-sans text-[14px] text-coral-600 hover:text-coral-700 font-semibold">&larr; Your results</Link>
        <Link href="/trends" className="font-sans text-[14px] text-coral-600 hover:text-coral-700 font-semibold">Your trends &rarr;</Link>
      </div>
    </div>
  );
}
