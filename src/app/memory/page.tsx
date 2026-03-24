'use client';

import { useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { GovernanceBlock } from '@/components/shared/GovernanceBlock';
import { InsightCard } from '@/components/shared/InsightCard';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function MemoryPage() {
  const { activeProfile, analysis, isLoaded } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div>
        <PageHeader title="Memory & Recirculation" subtitle="How past selves resurface." />
        <div className="wide-column px-6 pb-24">
          <ProfileSwitcher />
        </div>
      </div>
    );
  }

  const { memoryEvents } = analysis;

  const grouped = useMemo(() => {
    const phraseMap = new Map<string, typeof memoryEvents.value>();
    for (const ev of memoryEvents.value) {
      if (!phraseMap.has(ev.sharedPhrase)) phraseMap.set(ev.sharedPhrase, []);
      phraseMap.get(ev.sharedPhrase)!.push(ev);
    }
    return Array.from(phraseMap.entries())
      .sort((a, b) => b[1][0].daysBetween - a[1][0].daysBetween)
      .slice(0, 10);
  }, [memoryEvents]);

  const avgDaysBetween = memoryEvents.value.length > 0
    ? Math.round(memoryEvents.value.reduce((s, e) => s + e.daysBetween, 0) / memoryEvents.value.length)
    : 0;

  return (
    <div>
      <PageHeader
        title="Memory & Recirculation"
        subtitle={`Echoes in ${activeProfile!.label.toLowerCase()}'s posting history`}
      />

      <div className="wide-column px-6 pb-24">
        {memoryEvents.value.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-10">
              <InsightCard label="Recurrence Events" value={memoryEvents.value.length} status="inferred" />
              <InsightCard label="Avg. Time Between" value={`${avgDaysBetween}d`} status="inferred" />
            </div>

            <div className="space-y-4">
              {grouped.map(([phrase, events]) => (
                <div key={phrase} className="card p-5">
                  <p className="text-[15px] text-charcoal-900 italic mb-2">&ldquo;{phrase}&rdquo;</p>
                  {events.slice(0, 2).map((ev, i) => (
                    <p key={i} className="text-[12px] text-charcoal-400">
                      {new Date(ev.earlierDate).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                      {' → '}
                      {new Date(ev.laterDate).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                      <span className="ml-2 text-charcoal-300">({ev.daysBetween} days)</span>
                    </p>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <EpistemicBadge status="inferred" />
            </div>
          </>
        ) : (
          <p className="text-[15px] text-charcoal-400 py-12">
            No phrase recurrences found with 30+ days between occurrences.
          </p>
        )}

        <GovernanceBlock>
          Platforms offer memory features that resurface past posts on
          anniversaries. The selection criteria aren&apos;t disclosed. This creates
          a platform-curated relationship with your own past.
        </GovernanceBlock>
      </div>
    </div>
  );
}
