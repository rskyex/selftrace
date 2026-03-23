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
          message="This view requires posting history to analyze. Load a demo profile to begin."
          actions={[
            { label: 'Load demo dataset', href: '/import' },
          ]}
        />
      </div>
    );
  }

  const { dataQuality, timePeriods } = activeProfile;

  return (
    <div>
      <PageHeader
        title="Baseline Profile"
        subtitle="A factual summary of the data before any interpretive analysis."
      />

      <div className="reading-column px-6 pb-24">
        <HowToRead>
          This page shows a factual summary of the data you provided. No interpretation
          or pattern analysis has been applied. All figures are direct counts or
          distributions from your dataset. If something looks wrong, your data may
          have been parsed incorrectly.
        </HowToRead>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          {[
            { label: 'Total Posts', value: dataQuality.totalPosts },
            { label: 'Months Spanned', value: timePeriods.length * 3 },
            { label: 'Avg Posts/Month', value: dataQuality.averagePostsPerMonth },
            { label: 'Platform', value: activeProfile.platform },
          ].map((stat) => (
            <div key={stat.label} className="bg-cream-100 border border-cream-200 rounded-sm p-4">
              <p className="font-interface text-[11px] text-charcoal-500 uppercase tracking-wide mb-1">
                {stat.label}
              </p>
              <p className="font-mono text-[20px] text-charcoal-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 my-2 font-interface text-[11px] text-charcoal-500">
          <EpistemicBadge status="observed" />
          <span>·</span>
          <span>
            {dataQuality.totalPosts} posts · {dataQuality.dateRange.start.slice(0, 10)} to {dataQuality.dateRange.end.slice(0, 10)}
          </span>
        </div>

        {/* Posting Frequency */}
        <h2 className="text-[22px] text-charcoal-900 mt-12 mb-2">Posting Frequency, by Month</h2>
        <AreaChart
          data={analysis.postingFrequency.value}
          caption={analysis.postingFrequency.evidence}
          status={analysis.postingFrequency.status}
        />

        {/* Data Quality Notes */}
        <h2 className="text-[22px] text-charcoal-900 mt-12 mb-4">Data Quality</h2>
        <div className="space-y-2 text-[14px] text-charcoal-700">
          <p>
            {dataQuality.hasEngagementData
              ? 'Engagement data (likes, shares, replies, views) is present in this dataset.'
              : 'This dataset does not include engagement data. Reinforcement analysis will be unavailable.'}
          </p>
          {dataQuality.missingFields.length > 0 && (
            <p>
              Missing fields: {dataQuality.missingFields.join(', ')}.
            </p>
          )}
          {dataQuality.missingFields.length === 0 && (
            <p className="text-charcoal-500">
              No expected fields are missing from this dataset.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
