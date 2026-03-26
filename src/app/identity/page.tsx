'use client';

import { useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { HowToRead } from '@/components/shared/HowToRead';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { GovernanceBlock } from '@/components/shared/GovernanceBlock';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function IdentityPage() {
  const { activeProfile, analysis, isLoaded } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div>
        <PageHeader title="The Version of You That Performs" subtitle="How your online identity crystallized over time." />
        <div className="wide-column px-6 pb-24">
          <ProfileSwitcher />
        </div>
      </div>
    );
  }

  const { narrativeRepetition, selfDescriptionShift, memoryEvents } = analysis;

  const countPhrases = (markers: typeof selfDescriptionShift.value.early) => {
    const counts: Record<string, { count: number; pattern: string }> = {};
    for (const m of markers) {
      if (!counts[m.phrase]) counts[m.phrase] = { count: 0, pattern: m.pattern };
      counts[m.phrase].count++;
    }
    return Object.entries(counts).sort((a, b) => b[1].count - a[1].count).slice(0, 8);
  };

  const earlyDescs = countPhrases(selfDescriptionShift.value.early);
  const lateDescs = countPhrases(selfDescriptionShift.value.late);

  // Memory echoes
  const grouped = useMemo(() => {
    const phraseMap = new Map<string, typeof memoryEvents.value>();
    for (const ev of memoryEvents.value) {
      if (!phraseMap.has(ev.sharedPhrase)) phraseMap.set(ev.sharedPhrase, []);
      phraseMap.get(ev.sharedPhrase)!.push(ev);
    }
    return Array.from(phraseMap.entries())
      .sort((a, b) => b[1][0].daysBetween - a[1][0].daysBetween)
      .slice(0, 6);
  }, [memoryEvents]);

  return (
    <div>
      <PageHeader
        title="The Version of You That Performs"
        subtitle={`Identity patterns in ${activeProfile!.label.toLowerCase()}`}
      />

      <div className="wide-column px-6 pb-24">
        <HowToRead>
          This page looks at recurring self-descriptions, repeated phrases,
          and narrative patterns. These may reflect a maturing voice, a
          consistent identity, or adaptation to platform incentives. The tool
          identifies patterns — it doesn&apos;t judge their authenticity.
        </HowToRead>

        {/* Self-description shift */}
        <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 mt-10 mb-2">
          How you describe yourself
        </h2>
        <p className="text-[14px] text-ink-500 leading-relaxed mb-6 max-w-lg">
          Self-descriptions detected through pattern matching (&ldquo;as a...&rdquo;,
          &ldquo;in my experience...&rdquo;). The comparison shows how your
          self-presentation shifted between the first and second half of your
          posting history.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div className="card p-5">
            <h3 className="text-[13px] font-medium text-ink-400 uppercase tracking-wider mb-4">
              Earlier period
            </h3>
            {earlyDescs.length === 0 ? (
              <p className="text-[14px] text-ink-300 italic">No self-descriptions detected</p>
            ) : (
              <div className="space-y-3">
                {earlyDescs.map(([phrase, data]) => (
                  <div key={phrase}>
                    <p className="text-[14px] text-ink-700 italic">&ldquo;{phrase}&rdquo;</p>
                    <p className="text-[11px] text-ink-400 mt-0.5">
                      {data.count}x &middot; {data.pattern.replace(/_/g, ' ')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-5 bg-accent-50 border-accent-200">
            <h3 className="text-[13px] font-medium text-accent-700 uppercase tracking-wider mb-4">
              Later period
            </h3>
            {lateDescs.length === 0 ? (
              <p className="text-[14px] text-ink-300 italic">No self-descriptions detected</p>
            ) : (
              <div className="space-y-3">
                {lateDescs.map(([phrase, data]) => (
                  <div key={phrase}>
                    <p className="text-[14px] text-ink-700 italic">&ldquo;{phrase}&rdquo;</p>
                    <p className="text-[11px] text-ink-400 mt-0.5">
                      {data.count}x &middot; {data.pattern.replace(/_/g, ' ')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <EpistemicBadge status="inferred" />

        <SectionDivider />

        {/* Recurring phrases */}
        <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 mb-2">
          Your recurring phrases
        </h2>
        <p className="text-[14px] text-ink-500 leading-relaxed mb-6 max-w-lg">
          Phrases that appear in 3+ posts. Repetition is normal in sustained
          writing — it may reflect conviction, habit, or professional
          vocabulary.
        </p>

        <div className="card p-5">
          <div className="space-y-1">
            {narrativeRepetition.value.slice(0, 10).map((phrase) => (
              <div key={phrase.phrase} className="flex items-center gap-3 py-2.5 border-b border-linen-100 last:border-0">
                <span className="text-[14px] text-ink-700 italic flex-1">
                  &ldquo;{phrase.phrase}&rdquo;
                </span>
                <span className="font-mono text-[12px] text-ink-400 w-8 text-right">
                  &times;{phrase.occurrences}
                </span>
                <span className={`pill text-[10px] ${
                  phrase.temporalSpread === 'escalating' ? 'bg-accent-100 text-accent-700' :
                  phrase.temporalSpread === 'concentrated' ? 'bg-amber-100 text-amber-700' :
                  'bg-linen-100 text-ink-400'
                }`}>
                  {phrase.temporalSpread}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <EpistemicBadge status={narrativeRepetition.status} />
          </div>
        </div>

        <SectionDivider />

        {/* Memory echoes */}
        {grouped.length > 0 && (
          <>
            <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 mb-2">
              What you return to
            </h2>
            <p className="text-[14px] text-ink-500 leading-relaxed mb-6 max-w-lg">
              Phrasing that echoed across posts separated by 30+ days.
              This could be habitual language, deliberate callback, or
              coincidence — the tool can&apos;t tell which.
            </p>

            <div className="space-y-4">
              {grouped.map(([phrase, events]) => (
                <div key={phrase} className="card p-5">
                  <p className="text-[15px] text-ink-900 italic mb-2">
                    &ldquo;{phrase}&rdquo;
                  </p>
                  {events.slice(0, 2).map((ev, i) => (
                    <p key={i} className="text-[12px] text-ink-400">
                      {new Date(ev.earlierDate).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                      {' → '}
                      {new Date(ev.laterDate).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                      <span className="ml-2 text-ink-300">({ev.daysBetween} days apart)</span>
                    </p>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-3">
              <EpistemicBadge status="inferred" />
            </div>

            <SectionDivider />
          </>
        )}

        <GovernanceBlock>
          Platforms that reward consistency and recognizability may create
          conditions for narrative compression — the gradual reduction of
          self-presentation complexity toward a more legible form. This is
          a structural observation, not a claim about any individual.
        </GovernanceBlock>
      </div>
    </div>
  );
}
