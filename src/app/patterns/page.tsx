'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { AreaChart } from '@/components/shared/AreaChart';
import { ConfidenceDot } from '@/components/shared/ConfidenceDot';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function PatternsPage() {
  const { activeProfile, analysis, isLoaded } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div className="reading-column px-6 pt-20 pb-24">
        <h1 className="text-[32px] font-semibold tracking-tight text-ink-900 mb-4">What stuck</h1>
        <p className="text-[17px] text-ink-400 leading-relaxed mb-10">
          Which patterns got reinforced — and which ones you kept regardless.
        </p>
        <ProfileSwitcher />
      </div>
    );
  }

  const { engagementSensitivity, reinforcementCorrelation, narrativeRepetition, memoryEvents } = analysis;

  const avgEng = engagementSensitivity
    ? engagementSensitivity.value.reduce((s, t) => s + t.averageEngagement, 0) / engagementSensitivity.value.length
    : 0;

  const reinforced = engagementSensitivity?.value
    .filter(t => t.frequencyTrend === 'increasing' && t.averageEngagement > avgEng)
    .sort((a, b) => b.averageEngagement - a.averageEngagement) ?? [];

  const persistent = engagementSensitivity?.value
    .filter(t => t.averageEngagement < avgEng * 0.5 && t.frequencyTrend !== 'decreasing') ?? [];

  // Memory echoes
  const echoes = useMemo(() => {
    const phraseMap = new Map<string, typeof memoryEvents.value>();
    for (const ev of memoryEvents.value) {
      if (!phraseMap.has(ev.sharedPhrase)) phraseMap.set(ev.sharedPhrase, []);
      phraseMap.get(ev.sharedPhrase)!.push(ev);
    }
    return Array.from(phraseMap.entries())
      .sort((a, b) => b[1][0].daysBetween - a[1][0].daysBetween)
      .slice(0, 5);
  }, [memoryEvents]);

  return (
    <div className="reading-column px-6 pt-20 pb-24">
      <h1 className="text-[32px] font-semibold tracking-tight text-ink-900 mb-2">
        What stuck
      </h1>
      <p className="text-[17px] text-ink-400 leading-relaxed mb-12">
        Patterns that repeated across your posting history — some because
        they got attention, some because they mattered to you regardless.
      </p>

      {/* ── Reinforced ───────────────────────────── */}
      {reinforced.length > 0 && (
        <>
          <h2 className="text-[24px] font-semibold text-ink-900 tracking-tight mb-2">
            Patterns that got rewarded
          </h2>
          <p className="text-[15px] text-ink-400 leading-relaxed mb-6">
            These topics got more engagement than average — and you posted
            about them more over time. That doesn&apos;t prove the engagement
            caused it. But the pattern is there.
          </p>
          {reinforced.map(topic => (
            <div key={topic.topic} className="observation mb-4">
              <h3>{topic.topic}</h3>
              <p>
                {topic.postCount} posts. Above-average engagement. Your posting frequency
                for this topic increased over time.
              </p>
            </div>
          ))}
          <div className="mb-8"><ConfidenceDot level="low" /></div>
        </>
      )}

      {/* ── Persistent ───────────────────────────── */}
      {persistent.length > 0 && (
        <>
          <h2 className="text-[24px] font-semibold text-ink-900 tracking-tight mt-14 mb-2">
            What you kept without reward
          </h2>
          <p className="text-[15px] text-ink-400 leading-relaxed mb-6">
            These topics got below-average engagement, but you kept posting
            about them. That persistence suggests something meaningful —
            interests or values that the engagement metric doesn&apos;t capture.
          </p>
          {persistent.map(topic => (
            <div key={topic.topic} className="observation mb-4 bg-sage-100 border-sage-200">
              <h3>{topic.topic}</h3>
              <p>
                {topic.postCount} posts. Below-average engagement. You kept going anyway.
              </p>
            </div>
          ))}
          <div className="mb-8"><ConfidenceDot level="high" /></div>
        </>
      )}

      {/* ── Recurring phrases ────────────────────── */}
      {narrativeRepetition.value.length > 0 && (
        <>
          <h2 className="text-[24px] font-semibold text-ink-900 tracking-tight mt-14 mb-2">
            Phrases you return to
          </h2>
          <p className="text-[15px] text-ink-400 leading-relaxed mb-6">
            Phrases that appeared in three or more posts. Repetition is normal
            in any sustained writing — it can mean conviction, habit, or
            a developing voice.
          </p>
          <div className="space-y-3">
            {narrativeRepetition.value.slice(0, 8).map(phrase => (
              <div key={phrase.phrase} className="observation py-3 px-5">
                <p className="text-[16px] text-ink-700 italic">&ldquo;{phrase.phrase}&rdquo;</p>
                <p className="font-sans text-[12px] text-ink-300 mt-1">
                  {phrase.occurrences} times &middot; {phrase.temporalSpread}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4"><ConfidenceDot level="medium" /></div>
        </>
      )}

      {/* ── Echoes ───────────────────────────────── */}
      {echoes.length > 0 && (
        <>
          <h2 className="text-[24px] font-semibold text-ink-900 tracking-tight mt-14 mb-2">
            Echoes across time
          </h2>
          <p className="text-[15px] text-ink-400 leading-relaxed mb-6">
            Phrasing that reappeared in posts written months apart. This could
            be habitual language, deliberate callback, or coincidence — the
            tool can&apos;t tell which.
          </p>
          <div className="space-y-3">
            {echoes.map(([phrase, events]) => (
              <div key={phrase} className="observation py-3 px-5">
                <p className="text-[16px] text-ink-700 italic">&ldquo;{phrase}&rdquo;</p>
                <p className="font-sans text-[12px] text-ink-300 mt-1">
                  {events[0].daysBetween} days between occurrences
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4"><ConfidenceDot level="medium" /></div>
        </>
      )}

      {/* ── Engagement correlation ────────────────── */}
      {reinforcementCorrelation && (
        <>
          <h2 className="text-[24px] font-semibold text-ink-900 tracking-tight mt-14 mb-2">
            The feedback loop question
          </h2>
          <p className="text-[15px] text-ink-400 leading-relaxed mb-2">
            This chart asks: did topics that got more engagement one quarter
            show up more the next? A positive correlation is consistent with
            a feedback loop — but many other things could explain it too.
            This is the most uncertain analysis we show.
          </p>
          <AreaChart data={reinforcementCorrelation.value} confidence="low" color="coral" caption="Engagement-frequency correlation by quarter" />
        </>
      )}

      {/* ── Closing ──────────────────────────────── */}
      <div className="mt-16 pt-8 border-t border-warm-200">
        <p className="text-[17px] text-ink-500 leading-relaxed">
          Seeing these patterns doesn&apos;t mean the algorithm made you do
          anything. It means you can now notice things that were happening
          quietly in the background of your posting. Whether any of it
          matters — and what to do about it — is for you to decide.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link href="/portrait" className="font-sans text-[14px] text-violet-600 hover:text-violet-700 font-medium">
          &larr; Back to portrait
        </Link>
        <Link href="/drift" className="font-sans text-[14px] text-violet-600 hover:text-violet-700 font-medium">
          See your drift &rarr;
        </Link>
      </div>
    </div>
  );
}
