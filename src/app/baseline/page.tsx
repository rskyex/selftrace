'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { HowToRead } from '@/components/shared/HowToRead';
import { EmptyState } from '@/components/shared/EmptyState';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { AreaChart } from '@/components/shared/AreaChart';
import { useData } from '@/lib/data/context';

export default function BaselinePage() {
  const { activeProfile, analysis } = useData();

  if (!activeProfile || !analysis) {
    return (
      <div>
        <PageHeader title="Baseline Profile" subtitle="A factual summary of the loaded dataset." />
        <EmptyState
          message="This view requires a loaded dataset. Select a demo profile to begin."
          actions={[{ label: 'Load demo dataset', href: '/import' }]}
        />
      </div>
    );
  }

  const { dataQuality, timePeriods } = activeProfile;

  return (
    <div>
      <PageHeader
        title="Baseline Profile"
        subtitle="A factual summary of the data, before any interpretive analysis."
      />

      <div className="reading-column px-6 pb-24">
        <HowToRead>
          This page shows direct counts and distributions from the loaded
          dataset. No pattern analysis or interpretation has been applied.
          Everything here is labeled &ldquo;observed.&rdquo; If something
          looks wrong, the data may have been parsed incorrectly.
        </HowToRead>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 my-10">
          {[
            { label: 'Total Posts', value: String(dataQuality.totalPosts) },
            { label: 'Months', value: String(timePeriods.length * 3) },
            { label: 'Avg / Month', value: String(dataQuality.averagePostsPerMonth) },
            { label: 'Platform', value: activeProfile.platform },
          ].map((stat) => (
            <div key={stat.label} className="py-4 border-b border-cream-200">
              <p className="font-interface text-[10px] text-charcoal-400 uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <p className="font-mono text-[18px] text-charcoal-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 my-2">
          <EpistemicBadge status="observed" />
          <span className="font-interface text-[10px] text-charcoal-300">
            {dataQuality.dateRange.start.slice(0, 10)} to {dataQuality.dateRange.end.slice(0, 10)}
          </span>
        </div>

        {/* Posting Frequency */}
        <h2 className="text-[22px] text-charcoal-900 mt-14 mb-3">
          Posting Frequency, by Month
        </h2>
        <AreaChart
          data={analysis.postingFrequency.value}
          caption={analysis.postingFrequency.evidence}
          confidence="medium"
        />

        {/* Data Quality */}
        <h2 className="text-[22px] text-charcoal-900 mt-14 mb-4">
          Data Quality
        </h2>
        <div className="space-y-3 text-[14px] text-charcoal-700 leading-relaxed">
          <p>
            {dataQuality.hasEngagementData
              ? 'Engagement data (likes, shares, replies, views) is present.'
              : 'This dataset does not include engagement data. Reinforcement analysis will be unavailable.'}
          </p>
          {dataQuality.missingFields.length > 0 ? (
            <p className="text-charcoal-500">
              Missing fields: {dataQuality.missingFields.join(', ')}.
            </p>
          ) : (
            <p className="text-charcoal-400">
              No expected fields are missing.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
