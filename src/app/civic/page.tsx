'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { HowToRead } from '@/components/shared/HowToRead';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { GovernanceBlock } from '@/components/shared/GovernanceBlock';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function CivicPage() {
  const { activeProfile, analysis, isLoaded } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div>
        <PageHeader
          title="Civic Lens"
          subtitle="From individual patterns to collective questions about public discourse."
        />
        <div className="reading-column px-6 pb-24">
          <p className="text-[15px] text-charcoal-500 leading-relaxed mb-8">
            This page connects patterns observed in individual posting history
            to broader questions about platform governance and public discourse.
            Select a demo profile to see data-connected questions.
          </p>
          <ProfileSwitcher />
        </div>
      </div>
    );
  }

  const { civicQuestions } = analysis;

  return (
    <div>
      <PageHeader
        title="Civic Lens"
        subtitle={`From individual to collective: ${activeProfile!.label}`}
      />

      <div className="reading-column px-6 pb-24">
        <div className="prose-body text-[15px] text-charcoal-700 leading-[1.8] mt-4 mb-8">
          <p>
            The patterns examined in this tool concern one person&apos;s posting
            history. But platform incentive structures operate at scale. If
            reinforcement dynamics shape self-presentation for millions of
            users simultaneously, the effects are not only personal — they are
            civic.
          </p>
          <p>
            The questions below connect patterns observed in the loaded dataset
            to structural concerns about platform governance and public discourse.
            They are research questions — genuinely open, not rhetorical.
            Each has multiple valid answers. The data connections are
            illustrative, not probative.
          </p>
        </div>

        <HowToRead>
          Each question below includes a &ldquo;data connection&rdquo; that links
          the question to a pattern observed in your dataset. These connections
          show how individual patterns relate to collective questions — but they
          do not prove that platform dynamics caused the observed pattern. The
          individual level and the structural level are connected by plausibility,
          not by causal evidence.
        </HowToRead>

        <div className="mt-10 space-y-10">
          {civicQuestions.value.map((q, i) => (
            <div key={i} className="border-t border-cream-200 pt-8">
              <h2 className="text-[19px] text-charcoal-900 italic leading-snug mb-4">
                {q.question}
              </h2>
              <p className="text-[14px] text-charcoal-500 leading-relaxed mb-4">
                {q.context}
              </p>

              {q.dataConnection && (
                <div className="border-l border-teal-200 pl-5 py-2 mb-3">
                  <p className="font-interface text-[10px] text-charcoal-400 uppercase tracking-widest mb-1">
                    Data Connection
                  </p>
                  <p className="text-[13px] text-charcoal-700 leading-relaxed">
                    {q.dataConnection}
                  </p>
                </div>
              )}

              <EpistemicBadge status={q.status} />
            </div>
          ))}
        </div>

        <SectionDivider />

        <GovernanceBlock>
          The questions on this page operate at the boundary between individual
          observation and structural analysis. Current governance frameworks
          address content — what is said — but rarely address the conditions
          of expression — what is incentivized, repeated, and made visible.
          This page attempts to bridge that gap, not by providing answers, but
          by making the questions legible.
        </GovernanceBlock>

        <p className="mt-8 text-[13px] italic text-charcoal-400 leading-relaxed">
          These questions are posed in the spirit of genuine inquiry. If you
          have better questions, or if you believe these are the wrong
          questions, that response is itself a contribution to the research
          this tool invites.
        </p>
      </div>
    </div>
  );
}
