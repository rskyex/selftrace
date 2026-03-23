'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { HowToRead } from '@/components/shared/HowToRead';
import { EmptyState } from '@/components/shared/EmptyState';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { GovernanceBlock } from '@/components/shared/GovernanceBlock';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function NarrativePage() {
  const { activeProfile, analysis, isLoaded } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div>
        <PageHeader
          title="Narrative Identity"
          subtitle="How self-description and recurring language patterns evolve."
        />
        <div className="reading-column px-6 pb-24">
          <p className="text-[14px] text-charcoal-500 mb-6">
            Select a demo profile to begin analysis.
          </p>
          <ProfileSwitcher />
        </div>
      </div>
    );
  }

  const { narrativeRepetition, selfDescriptionShift } = analysis;

  // Aggregate self-description phrases
  const countPhrases = (markers: typeof selfDescriptionShift.value.early) => {
    const counts: Record<string, { count: number; pattern: string }> = {};
    for (const m of markers) {
      const key = m.phrase;
      if (!counts[key]) counts[key] = { count: 0, pattern: m.pattern };
      counts[key].count++;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 8);
  };

  const earlyDescs = countPhrases(selfDescriptionShift.value.early);
  const lateDescs = countPhrases(selfDescriptionShift.value.late);

  return (
    <div>
      <PageHeader
        title="Narrative Identity"
        subtitle={`Examining self-description patterns for: ${activeProfile!.label}`}
      />

      <div className="reading-column px-6 pb-24">
        <HowToRead>
          This page examines narrative patterns in your posting history — recurring
          self-descriptions, thematic arcs, and repeated phrases. These are
          interpretive readings, not objective measurements. Narrative patterns may
          reflect genuine identity, strategic self-presentation, platform adaptation,
          or all three. The tool identifies patterns. It does not judge their authenticity.
        </HowToRead>

        {/* Self-Description Shift */}
        <h2 className="text-[22px] text-charcoal-900 mt-10 mb-4">
          Self-Descriptions: Earlier vs. Later
        </h2>
        <p className="text-[14px] text-charcoal-500 leading-relaxed mb-6">
          How you described yourself in the first half of the dataset compared to
          the second half. Self-descriptions are identified through pattern matching
          (&ldquo;as a...&rdquo;, &ldquo;I am a...&rdquo;, &ldquo;in my experience...&rdquo;).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="font-interface text-[12px] text-charcoal-500 uppercase tracking-wide mb-3">
              Earlier Period
            </h3>
            {earlyDescs.length === 0 ? (
              <p className="text-[14px] text-charcoal-300 italic">No self-descriptions detected.</p>
            ) : (
              <div className="space-y-2">
                {earlyDescs.map(([phrase, data]) => (
                  <div key={phrase} className="py-2 border-b border-cream-200">
                    <span className="text-[14px] text-charcoal-700">&ldquo;{phrase}&rdquo;</span>
                    <span className="font-interface text-[11px] text-charcoal-300 ml-2">
                      × {data.count}
                    </span>
                    <span className="font-interface text-[10px] text-charcoal-300 ml-2">
                      {data.pattern.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-interface text-[12px] text-charcoal-500 uppercase tracking-wide mb-3">
              Later Period
            </h3>
            {lateDescs.length === 0 ? (
              <p className="text-[14px] text-charcoal-300 italic">No self-descriptions detected.</p>
            ) : (
              <div className="space-y-2">
                {lateDescs.map(([phrase, data]) => (
                  <div key={phrase} className="py-2 border-b border-cream-200">
                    <span className="text-[14px] text-charcoal-700">&ldquo;{phrase}&rdquo;</span>
                    <span className="font-interface text-[11px] text-charcoal-300 ml-2">
                      × {data.count}
                    </span>
                    <span className="font-interface text-[10px] text-charcoal-300 ml-2">
                      {data.pattern.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <EpistemicBadge status={selfDescriptionShift.status} />

        <SectionDivider />

        {/* Recurring Phrases */}
        <h2 className="text-[22px] text-charcoal-900 mb-4">
          Recurring Phrases
        </h2>
        <p className="text-[14px] text-charcoal-500 leading-relaxed mb-6">
          Phrases (3-5 words) that appear in three or more posts. Repetition in
          self-expression is natural and may reflect a developing voice, consistent
          expertise, or deliberate emphasis — not only platform reinforcement.
        </p>

        <div className="space-y-2">
          {narrativeRepetition.value.slice(0, 12).map((phrase) => (
            <div key={phrase.phrase} className="flex items-center gap-3 py-2 border-b border-cream-200">
              <span className="text-[14px] text-charcoal-900 flex-1">
                &ldquo;{phrase.phrase}&rdquo;
              </span>
              <span className="font-mono text-[11px] text-charcoal-500 w-10 text-right">
                ×{phrase.occurrences}
              </span>
              <span className={`font-interface text-[10px] px-2 py-0.5 rounded-sm w-20 text-center ${
                phrase.temporalSpread === 'escalating'
                  ? 'text-amber-700 bg-amber-100'
                  : phrase.temporalSpread === 'concentrated'
                  ? 'text-charcoal-500 bg-cream-100'
                  : 'text-charcoal-300 bg-cream-50'
              }`}>
                {phrase.temporalSpread}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <EpistemicBadge status={narrativeRepetition.status} />
        </div>

        <GovernanceBlock>
          Platforms that reward consistency and recognizability — through
          algorithmic amplification of accounts with clear topical focus, or
          through features that encourage &ldquo;branding&rdquo; — may create incentives
          for narrative compression: reducing the complexity of self-presentation
          to a more legible, categorizable form. This is a structural observation
          about platform design, not a claim about any individual user&apos;s choices.
        </GovernanceBlock>
      </div>
    </div>
  );
}
