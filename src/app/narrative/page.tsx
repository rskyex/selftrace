'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { HowToRead } from '@/components/shared/HowToRead';
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
          <p className="text-[15px] text-ink-500 leading-relaxed mb-8">
            This page examines how recurring language patterns, self-descriptions,
            and rhetorical templates develop over time. Select a demo profile to begin.
          </p>
          <ProfileSwitcher />
        </div>
      </div>
    );
  }

  const { narrativeRepetition, selfDescriptionShift } = analysis;

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
        subtitle={`Examining: ${activeProfile!.label}`}
      />

      <div className="reading-column px-6 pb-24">
        <HowToRead>
          This page examines narrative patterns — recurring self-descriptions,
          repeated phrases, and rhetorical templates. These are interpretive
          readings, not objective measurements. Narrative patterns may reflect
          genuine identity, strategic self-presentation, platform adaptation,
          or all three simultaneously. The tool identifies patterns. It does not
          judge their authenticity or assign their cause.
        </HowToRead>

        <div className="mt-10 prose-body text-[15px] text-ink-700 leading-relaxed">
          <p>
            Over time, people who post regularly tend to develop recognizable
            patterns — ways of describing themselves, rhetorical structures
            they return to, phrases that recur. This is not inherently
            problematic. It may represent a maturing voice, a consistent
            professional identity, or a set of convictions that deepen with
            repetition.
          </p>
          <p>
            The question this page raises is narrower: do these patterns
            correlate with anything observable in the data, and if so, is
            the trajectory worth noticing? Not because repetition is wrong,
            but because patterns that go unnoticed are patterns that cannot
            be chosen.
          </p>
        </div>

        <SectionDivider />

        {/* ── Self-Description Shift ───────────────────────── */}
        <h2 className="text-[22px] text-ink-900 mb-3">
          Self-Descriptions: Earlier vs. Later
        </h2>
        <p className="text-[14px] text-ink-500 leading-relaxed mb-2">
          How you described yourself in the first half of the dataset compared
          to the second half. Self-descriptions are identified through pattern
          matching (&ldquo;as a...&rdquo;, &ldquo;I am a...&rdquo;, &ldquo;in
          my experience...&rdquo;) — this classification is approximate and may
          miss non-standard forms or misidentify rhetorical uses.
        </p>
        <div className="mb-6">
          <EpistemicBadge status="inferred" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="font-sans text-[11px] text-ink-400 uppercase tracking-widest mb-4">
              Earlier Period
            </h3>
            {earlyDescs.length === 0 ? (
              <p className="text-[14px] text-ink-300 italic">
                No self-descriptions detected in this period.
              </p>
            ) : (
              <div className="space-y-2.5">
                {earlyDescs.map(([phrase, data]) => (
                  <div key={phrase} className="py-2 border-b border-linen-200">
                    <span className="text-[14px] text-ink-700 italic">&ldquo;{phrase}&rdquo;</span>
                    <div className="font-sans text-[10px] text-ink-400 mt-0.5">
                      {data.count} occurrence{data.count > 1 ? 's' : ''} · {data.pattern.replace(/_/g, ' ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-sans text-[11px] text-ink-400 uppercase tracking-widest mb-4">
              Later Period
            </h3>
            {lateDescs.length === 0 ? (
              <p className="text-[14px] text-ink-300 italic">
                No self-descriptions detected in this period.
              </p>
            ) : (
              <div className="space-y-2.5">
                {lateDescs.map(([phrase, data]) => (
                  <div key={phrase} className="py-2 border-b border-linen-200">
                    <span className="text-[14px] text-ink-700 italic">&ldquo;{phrase}&rdquo;</span>
                    <div className="font-sans text-[10px] text-ink-400 mt-0.5">
                      {data.count} occurrence{data.count > 1 ? 's' : ''} · {data.pattern.replace(/_/g, ' ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <SectionDivider />

        {/* ── Recurring Phrases ─────────────────────────────── */}
        <h2 className="text-[22px] text-ink-900 mb-3">
          Recurring Phrases
        </h2>
        <p className="text-[14px] text-ink-500 leading-relaxed mb-2">
          Phrases of 3–5 words that appear in three or more posts, filtered to
          remove common expressions. The &ldquo;temporal spread&rdquo; column
          indicates whether occurrences are concentrated early, distributed
          evenly, or escalating in the later period.
        </p>
        <div className="mb-6">
          <EpistemicBadge status={narrativeRepetition.status} />
        </div>

        <div className="space-y-1">
          {narrativeRepetition.value.slice(0, 12).map((phrase) => (
            <div key={phrase.phrase} className="flex items-center gap-3 py-2.5 border-b border-linen-200">
              <span className="text-[14px] text-ink-700 italic flex-1">
                &ldquo;{phrase.phrase}&rdquo;
              </span>
              <span className="font-mono text-[10px] text-ink-400 w-8 text-right">
                ×{phrase.occurrences}
              </span>
              <span className="font-sans text-[10px] text-ink-400 w-20 text-center uppercase tracking-wide">
                {phrase.temporalSpread}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[13px] italic text-ink-400 leading-relaxed">
          Repetition in self-expression is a normal feature of sustained writing.
          It may reflect a developing voice, professional vocabulary, deliberate
          emphasis, or habitual expression. The presence of recurring phrases
          does not, by itself, indicate platform influence.
        </p>

        <div className="mt-12">
          <GovernanceBlock>
            Platforms that reward consistency and recognizability — through
            algorithmic amplification of accounts with clear topical focus, or
            through features that encourage personal branding — may create
            conditions favorable to narrative compression: the gradual reduction
            of self-presentation complexity toward a more legible, categorizable
            form. This is a structural observation about platform incentives, not
            a claim about any individual user&apos;s experience or choices.
          </GovernanceBlock>
        </div>
      </div>
    </div>
  );
}
