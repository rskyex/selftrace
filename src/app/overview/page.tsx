'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/shared/PageHeader';
import { InsightCard } from '@/components/shared/InsightCard';
import { AreaChart } from '@/components/shared/AreaChart';
import { SparkLine } from '@/components/shared/SparkLine';
import { EmptyState } from '@/components/shared/EmptyState';
import { useData } from '@/lib/data/context';

export default function OverviewPage() {
  const { activeProfile, analysis } = useData();

  if (!activeProfile || !analysis) {
    return (
      <div>
        <PageHeader title="Overview" subtitle="Your posting patterns at a glance." />
        <EmptyState
          message="Connect your data or load a demo profile to see your overview."
          actions={[{ label: 'Connect data', href: '/connect' }]}
        />
      </div>
    );
  }

  const { dataQuality } = activeProfile;
  const entropy = analysis.topicEntropy.value;
  const firstEntropy = entropy[0]?.value ?? 0;
  const lastEntropy = entropy[entropy.length - 1]?.value ?? 0;
  const entropyTrend = lastEntropy < firstEntropy * 0.85 ? 'down' : lastEntropy > firstEntropy * 1.15 ? 'up' : 'stable';

  const toneAssert = analysis.toneTrends.value.assertiveness;
  const firstAssert = toneAssert[0]?.value ?? 0;
  const lastAssert = toneAssert[toneAssert.length - 1]?.value ?? 0;
  const assertTrend = lastAssert > firstAssert + 0.1 ? 'up' : lastAssert < firstAssert - 0.1 ? 'down' : 'stable';

  const highEngTopics = analysis.engagementSensitivity?.value.filter(t => t.frequencyTrend === 'increasing') ?? [];

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle={activeProfile.label}
      />

      <div className="wide-column px-6 pb-24">
        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <InsightCard
            label="Total Posts"
            value={dataQuality.totalPosts.toLocaleString()}
            detail={`${dataQuality.averagePostsPerMonth}/month average`}
            status="observed"
          />
          <InsightCard
            label="Time Span"
            value={`${activeProfile.timePeriods.length * 3}mo`}
            detail={`${activeProfile.platform}`}
            status="observed"
          />
          <InsightCard
            label="Topic Diversity"
            value={lastEntropy.toFixed(1)}
            detail={`${entropyTrend === 'down' ? 'Narrowing' : entropyTrend === 'up' ? 'Broadening' : 'Stable'} over time`}
            trend={entropyTrend}
            status="inferred"
          />
          <InsightCard
            label="Voice Shift"
            value={`${Math.abs(lastAssert - firstAssert).toFixed(2)}`}
            detail={`Assertiveness ${assertTrend === 'up' ? 'increased' : assertTrend === 'down' ? 'decreased' : 'stable'}`}
            trend={assertTrend}
            status="inferred"
          />
        </div>

        {/* Posting frequency chart */}
        <AreaChart
          data={analysis.postingFrequency.value}
          caption="Posting frequency over time"
          status={analysis.postingFrequency.status}
        />

        {/* Quick insights */}
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          <Link href="/drift" className="card p-5 group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-semibold text-charcoal-900">Your Drift</h3>
              <span className="text-[13px] text-accent-500 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
            <div className="flex items-center gap-3">
              <SparkLine data={entropy} width={100} height={24} />
              <span className="text-[12px] text-charcoal-400">
                Topic diversity: {firstEntropy.toFixed(1)} &rarr; {lastEntropy.toFixed(1)}
              </span>
            </div>
          </Link>

          <Link href="/reinforcement" className="card p-5 group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-semibold text-charcoal-900">Reinforcement</h3>
              <span className="text-[13px] text-accent-500 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
            <p className="text-[12px] text-charcoal-400">
              {highEngTopics.length > 0
                ? `${highEngTopics.length} topic${highEngTopics.length > 1 ? 's' : ''} show engagement-frequency correlation`
                : 'Explore engagement patterns'}
            </p>
          </Link>

          <Link href="/identity" className="card p-5 group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-semibold text-charcoal-900">Identity</h3>
              <span className="text-[13px] text-accent-500 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
            <p className="text-[12px] text-charcoal-400">
              {analysis.narrativeRepetition.value.length > 0
                ? `${analysis.narrativeRepetition.value.length} recurring phrases detected`
                : 'Explore self-presentation patterns'}
            </p>
          </Link>
        </div>

        {/* Tone snapshot */}
        <div className="card p-5 mt-5">
          <h3 className="text-[15px] font-semibold text-charcoal-900 mb-4">Tone snapshot</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['assertiveness', 'emotionality', 'formality', 'urgency'] as const).map((marker) => {
              const series = analysis.toneTrends.value[marker];
              const first = series[0]?.value ?? 0;
              const last = series[series.length - 1]?.value ?? 0;
              return (
                <div key={marker} className="flex items-center gap-3">
                  <div>
                    <p className="text-[11px] text-charcoal-400 uppercase tracking-wider">{marker}</p>
                    <p className="text-[14px] font-medium text-charcoal-700">
                      {first.toFixed(2)} &rarr; {last.toFixed(2)}
                    </p>
                  </div>
                  <SparkLine data={series} width={60} height={20} />
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[12px] text-charcoal-300">
            Approximate heuristic measures. Not precise. <Link href="/how-it-works" className="text-accent-500 hover:text-accent-600">Learn more</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
