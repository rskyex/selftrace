'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ConfidenceDot } from '@/components/shared/ConfidenceDot';
import { EchoMap } from '@/components/charts/EchoMap';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function ReturningPage() {
  const { analysis, isLoaded } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div className="reading-column px-6 pt-24 pb-24">
        <h1 className="font-display text-[30px] md:text-[36px] tracking-tight text-ink-900 leading-[1.1] mb-4">What keeps resurfacing</h1>
        <p className="text-ink-500 mb-10">Load a profile to see what recurs.</p>
        <ProfileSwitcher />
      </div>
    );
  }

  const { narrativeRepetition, memoryEvents, selfDescriptionShift } = analysis;

  // Group memory events by phrase
  const echoes = useMemo(() => {
    const m = new Map<string, typeof memoryEvents.value>();
    for (const ev of memoryEvents.value) {
      if (!m.has(ev.sharedPhrase)) m.set(ev.sharedPhrase, []);
      m.get(ev.sharedPhrase)!.push(ev);
    }
    return Array.from(m.entries())
      .sort((a, b) => b[1][0].daysBetween - a[1][0].daysBetween)
      .slice(0, 6);
  }, [memoryEvents]);

  // Self-description stability
  const earlyDescs = new Set(selfDescriptionShift.value.early.map(d => d.phrase));
  const lateDescs = new Set(selfDescriptionShift.value.late.map(d => d.phrase));
  const stableDescs = [...earlyDescs].filter(d => lateDescs.has(d));
  const newDescs = [...lateDescs].filter(d => !earlyDescs.has(d));
  const fadedDescs = [...earlyDescs].filter(d => !lateDescs.has(d));

  return (
    <div className="reading-column px-6 pt-24 pb-24">
      <h1 className="font-display text-[30px] md:text-[36px] tracking-tight text-ink-900 leading-[1.1] mb-3">
        What keeps resurfacing
      </h1>
      <p className="text-[17px] text-ink-500 leading-[1.8] mb-16">
        Some phrases, framings, and themes appear in your posts again and again &mdash;
        sometimes months apart. This is normal. We all have phrases we live inside,
        ideas we return to, ways of putting things that feel like ours. What&apos;s worth
        noticing is the pattern of return.
      </p>

      {/* ── Recurring phrases ────────────────────── */}
      {narrativeRepetition.value.length > 0 && (
        <section className="mb-20">
          <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-4">
            Phrases you return to
          </h2>
          <p className="text-[16px] text-ink-500 leading-[1.8] mb-6">
            These formulations appeared in three or more posts. Repetition can mean conviction,
            habit, a developing voice, or a narrative groove that deepened over time.
          </p>
          <div className="space-y-3">
            {narrativeRepetition.value.slice(0, 8).map(ph => (
              <div key={ph.phrase} className="observation py-5 px-6">
                <p className="text-[17px] text-ink-700 italic leading-snug">&ldquo;{ph.phrase}&rdquo;</p>
                <p className="font-sans text-[12px] text-ink-400 mt-2">{ph.occurrences} times &middot; {ph.temporalSpread} &middot; first: {new Date(ph.firstAppearance).toLocaleDateString('en', { month: 'short', year: 'numeric' })}</p>
              </div>
            ))}
          </div>
          <div className="mt-3"><ConfidenceDot level="counted" /></div>
        </section>
      )}

      {/* ── Echo map ─────────────────────────────── */}
      {memoryEvents.value.length > 0 && (
        <section className="mb-20">
          <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-4">
            Echoes across time
          </h2>
          <p className="text-[16px] text-ink-500 leading-[1.8] mb-2">
            Phrasing that reappeared months apart. Each line connects two occurrences of
            similar language. Dense threads show the ideas that kept coming back.
          </p>
          <EchoMap events={memoryEvents.value} />
          <div className="mt-3"><ConfidenceDot level="patterned" /></div>

          {echoes.length > 0 && (
            <div className="mt-8 space-y-3">
              {echoes.slice(0, 4).map(([phrase, events]) => (
                <div key={phrase} className="observation py-4 px-6">
                  <p className="text-[16px] text-ink-700 italic">&ldquo;{phrase}&rdquo;</p>
                  <p className="font-sans text-[12px] text-ink-400 mt-1">{events[0].daysBetween} days between occurrences</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Self-descriptions over time ──────────── */}
      {(stableDescs.length > 0 || newDescs.length > 0 || fadedDescs.length > 0) && (
        <section className="mb-20">
          <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-4">
            The self you built in words
          </h2>
          <p className="text-[16px] text-ink-500 leading-[1.8] mb-6">
            When you describe yourself in posts (&ldquo;as a…&rdquo;, &ldquo;in my experience…&rdquo;),
            you&apos;re constructing a narrative identity. Here&apos;s how those self-descriptions
            evolved.
          </p>

          {stableDescs.length > 0 && (
            <div className="mb-6">
              <p className="font-sans text-[13px] text-ink-400 mb-3">Stable throughout</p>
              {stableDescs.slice(0, 4).map(d => (
                <div key={d} className="observation-sage mb-2 py-3 px-5">
                  <p className="text-[15px] text-ink-700 italic">&ldquo;{d}&rdquo;</p>
                </div>
              ))}
            </div>
          )}

          {newDescs.length > 0 && (
            <div className="mb-6">
              <p className="font-sans text-[13px] text-ink-400 mb-3">Emerged later</p>
              {newDescs.slice(0, 4).map(d => (
                <div key={d} className="observation-umber mb-2 py-3 px-5">
                  <p className="text-[15px] text-ink-700 italic">&ldquo;{d}&rdquo;</p>
                </div>
              ))}
            </div>
          )}

          {fadedDescs.length > 0 && (
            <div className="mb-6">
              <p className="font-sans text-[13px] text-ink-400 mb-3">Faded over time</p>
              {fadedDescs.slice(0, 4).map(d => (
                <div key={d} className="observation mb-2 py-3 px-5" style={{ opacity: 0.6 }}>
                  <p className="text-[15px] text-ink-700 italic">&ldquo;{d}&rdquo;</p>
                </div>
              ))}
            </div>
          )}
          <ConfidenceDot level="patterned" />
        </section>
      )}

      {/* ── Closing ──────────────────────────────── */}
      <p className="text-[16px] text-ink-500 leading-[1.8] border-t border-linen-200 pt-10">
        What keeps resurfacing is neither good nor bad. It&apos;s evidence of a self
        being maintained through language &mdash; the same process that happens in
        thought and conversation, made visible because it happened in writing.
      </p>

      <div className="mt-12 flex flex-wrap gap-6">
        <Link href="/results" className="text-link text-[14px]">&larr; Overview</Link>
        <Link href="/rewarded" className="text-link text-[14px]">What the environment rewarded &rarr;</Link>
      </div>
    </div>
  );
}
