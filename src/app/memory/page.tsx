'use client';

import { useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { HowToRead } from '@/components/shared/HowToRead';
import { CaveatPanel } from '@/components/shared/CaveatPanel';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { GovernanceBlock } from '@/components/shared/GovernanceBlock';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function MemoryPage() {
  const { activeProfile, analysis, isLoaded } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div>
        <PageHeader
          title="Memory & Recirculation"
          subtitle="How past self-presentations resurface in later posting."
        />
        <div className="reading-column px-6 pb-24">
          <p className="text-[15px] text-charcoal-500 leading-relaxed mb-8">
            This page examines how phrasing and ideas from earlier posts
            reappear in later ones. Select a demo profile to begin.
          </p>
          <ProfileSwitcher />
        </div>
      </div>
    );
  }

  const { memoryEvents } = analysis;

  // Group events by shared phrase, take top instances
  const grouped = useMemo(() => {
    const phraseMap = new Map<string, typeof memoryEvents.value>();
    for (const ev of memoryEvents.value) {
      if (!phraseMap.has(ev.sharedPhrase)) phraseMap.set(ev.sharedPhrase, []);
      phraseMap.get(ev.sharedPhrase)!.push(ev);
    }
    return Array.from(phraseMap.entries())
      .sort((a, b) => b[1][0].daysBetween - a[1][0].daysBetween)
      .slice(0, 12);
  }, [memoryEvents]);

  // Compute temporal distribution
  const avgDaysBetween = memoryEvents.value.length > 0
    ? Math.round(memoryEvents.value.reduce((s, e) => s + e.daysBetween, 0) / memoryEvents.value.length)
    : 0;

  // Find the post content for display
  const getPostText = (postId: string): string => {
    const post = activeProfile!.posts.find(p => p.id === postId);
    return post ? post.content.text.slice(0, 120) + (post.content.text.length > 120 ? '…' : '') : '';
  };

  return (
    <div>
      <PageHeader
        title="Memory & Recirculation"
        subtitle={`Examining: ${activeProfile!.label}`}
      />

      <div className="reading-column px-6 pb-24">
        <div className="prose-body text-[15px] text-charcoal-700 leading-[1.8] mt-4 mb-6">
          <p>
            Platforms do not only shape what users post in the present.
            Through memory features, resharing mechanics, and the simple
            act of having an archive, they also mediate the relationship
            between past and present self-presentation. This page examines
            one dimension of that relationship: when phrasing from earlier
            posts reappears in later ones.
          </p>
        </div>

        <CaveatPanel title="What this analysis cannot determine.">
          <p>
            When the same phrase appears in posts separated by weeks or months,
            this tool cannot determine why. Possible explanations include:
            habitual language, professional vocabulary, deliberate callback,
            platform-prompted memory features, or coincidence. The recurrences
            shown below are observed in the text. Their cause is not.
          </p>
        </CaveatPanel>

        <HowToRead>
          This page shows phrases of four or more words that appear in posts
          separated by at least 30 days. The phrase recurrence is directly
          observed in the data. The interpretation of what it means — whether
          it reflects deliberate self-reference, habitual language, or
          platform-mediated remembering — is left to you.
        </HowToRead>

        {/* Summary */}
        {memoryEvents.value.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 my-10">
              <div className="py-4 border-b border-cream-200">
                <p className="font-interface text-[10px] text-charcoal-400 uppercase tracking-widest mb-1">
                  Recurrence Events
                </p>
                <p className="font-mono text-[18px] text-charcoal-900">
                  {memoryEvents.value.length}
                </p>
              </div>
              <div className="py-4 border-b border-cream-200">
                <p className="font-interface text-[10px] text-charcoal-400 uppercase tracking-widest mb-1">
                  Avg. Time Between
                </p>
                <p className="font-mono text-[18px] text-charcoal-900">
                  {avgDaysBetween} days
                </p>
              </div>
            </div>
            <EpistemicBadge status={memoryEvents.status} />

            <SectionDivider />

            {/* Recurrence Details */}
            <h2 className="text-[22px] text-charcoal-900 mb-3">
              Recurring Phrases Across Time
            </h2>
            <p className="text-[14px] text-charcoal-500 leading-relaxed mb-6">
              Phrases that appear in posts separated by at least 30 days.
              Longer temporal gaps are shown first — they represent the
              most distant &ldquo;echoes&rdquo; in the posting history.
            </p>

            <div className="space-y-6">
              {grouped.map(([phrase, events]) => {
                const first = events[0];
                return (
                  <div key={phrase} className="border-t border-cream-200 pt-5">
                    <p className="text-[15px] text-charcoal-900 italic mb-2">
                      &ldquo;{phrase}&rdquo;
                    </p>
                    <div className="space-y-2">
                      {events.slice(0, 2).map((ev, i) => (
                        <div key={i} className="border-l border-cream-300 pl-4">
                          <p className="font-interface text-[10px] text-charcoal-400 tracking-wide mb-1">
                            {new Date(ev.earlierDate).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                            {' → '}
                            {new Date(ev.laterDate).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                            <span className="ml-2 text-charcoal-300">({ev.daysBetween} days apart)</span>
                          </p>
                          <p className="text-[12px] text-charcoal-500 leading-relaxed">
                            {getPostText(ev.earlierPostId)}
                          </p>
                        </div>
                      ))}
                    </div>
                    {events.length > 2 && (
                      <p className="font-interface text-[10px] text-charcoal-300 mt-2">
                        + {events.length - 2} more occurrence{events.length > 3 ? 's' : ''}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <EpistemicBadge status="inferred" />
            </div>

            <p className="mt-6 text-[13px] italic text-charcoal-400 leading-relaxed">
              Phrase recurrence across time is a normal feature of any
              sustained body of writing. Professional vocabulary, personal
              idiom, and thematic consistency all produce recurrence
              patterns. The presence of echoes does not, by itself,
              indicate platform-mediated memory.
            </p>
          </>
        ) : (
          <div className="py-12">
            <p className="text-[15px] text-charcoal-400">
              No phrase recurrences detected with at least 30 days between
              occurrences. This may indicate a diverse vocabulary or a
              dataset too small to detect temporal echoes.
            </p>
          </div>
        )}

        <div className="mt-12">
          <GovernanceBlock>
            Most major platforms offer memory features that resurface past
            posts on their anniversary. These features select which memories
            to present and which to omit. The criteria for selection are not
            publicly disclosed. This creates a platform-curated version of
            the user&apos;s past that may not reflect the user&apos;s own priorities
            for remembering. Whether such features influence subsequent
            self-expression — by reinforcing certain self-narratives over
            others — is an open research question.
          </GovernanceBlock>
        </div>
      </div>
    </div>
  );
}
