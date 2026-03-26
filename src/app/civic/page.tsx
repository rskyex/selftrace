'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { GovernanceBlock } from '@/components/shared/GovernanceBlock';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function CivicPage() {
  const { activeProfile, analysis, isLoaded } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div>
        <PageHeader title="Civic Lens" subtitle="From individual patterns to collective questions." />
        <div className="wide-column px-6 pb-24">
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
        subtitle={`Collective questions from ${activeProfile!.label.toLowerCase()}'s patterns`}
      />

      <div className="wide-column px-6 pb-24">
        <p className="text-[15px] text-ink-500 leading-relaxed mb-10 max-w-lg">
          If platform incentives shape self-presentation for millions of
          users simultaneously, the effects aren&apos;t only personal — they&apos;re
          civic. These questions connect patterns in your data to bigger
          structural concerns.
        </p>

        <div className="space-y-6">
          {civicQuestions.value.map((q, i) => (
            <div key={i} className="card p-6">
              <h2 className="font-display text-[18px] text-ink-900 mb-3">
                {q.question}
              </h2>
              <p className="text-[14px] text-ink-500 leading-relaxed mb-4">
                {q.context}
              </p>
              {q.dataConnection && (
                <div className="bg-accent-50 rounded-lg px-4 py-3 mb-3">
                  <p className="text-[11px] font-medium text-accent-700 uppercase tracking-wider mb-1">
                    Data connection
                  </p>
                  <p className="text-[13px] text-charcoal-600 leading-relaxed">
                    {q.dataConnection}
                  </p>
                </div>
              )}
              <EpistemicBadge status={q.status} />
            </div>
          ))}
        </div>

        <GovernanceBlock>
          These questions are research questions — genuinely open, not
          rhetorical. If you have better questions, that&apos;s itself a
          contribution to the inquiry.
        </GovernanceBlock>
      </div>
    </div>
  );
}
