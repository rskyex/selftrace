'use client';

import Link from 'next/link';
import { AreaChart } from '@/components/shared/AreaChart';
import { ConfidenceDot } from '@/components/shared/ConfidenceDot';
import { SelectionLandscape } from '@/components/charts/SelectionLandscape';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function RewardedPage() {
  const { analysis, isLoaded } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div className="reading-column px-6 pt-28 pb-24">
        <h1 className="text-[30px] font-bold tracking-tight text-ink-900 mb-4">What the environment rewarded</h1>
        <p className="text-ink-500 mb-10">Load a profile to see engagement patterns.</p>
        <ProfileSwitcher />
      </div>
    );
  }

  const { engagementSensitivity, reinforcementCorrelation, toneTrends } = analysis;
  if (!engagementSensitivity) {
    return (
      <div className="reading-column px-6 pt-28 pb-24">
        <h1 className="text-[30px] font-bold tracking-tight text-ink-900 mb-4">What the environment rewarded</h1>
        <p className="text-ink-500">No engagement data available for this profile.</p>
      </div>
    );
  }

  const data = engagementSensitivity.value;
  const avgEng = data.reduce((s, t) => s + t.averageEngagement, 0) / data.length;
  const reinforced = data.filter(t => t.frequencyTrend === 'increasing' && t.averageEngagement > avgEng);
  const faded = data.filter(t => t.frequencyTrend === 'decreasing' && t.averageEngagement < avgEng);

  // Tone-reward: check if assertive posts got more engagement
  const tA = toneTrends.value.assertiveness;
  const aFirst = tA[0]?.value ?? 0, aLast = tA[tA.length - 1]?.value ?? 0;
  const toneShifted = Math.abs(aLast - aFirst) > 0.08;

  return (
    <div className="reading-column px-6 pt-28 pb-24">
      <h1 className="text-[30px] font-bold tracking-tight text-ink-900 mb-3">
        What the environment rewarded
      </h1>
      <p className="text-[17px] text-ink-500 leading-[1.8] mb-16">
        Every platform creates an ambient reward landscape &mdash; some expressions
        get more response, some get less. Over time, that landscape becomes part
        of the environment you&apos;re composing within. Here is what yours looked like.
      </p>

      {/* ── The Selection Landscape ──────────────── */}
      <section className="mb-20">
        <h2 className="text-[22px] font-semibold text-ink-900 tracking-tight mb-4">
          The selection landscape
        </h2>
        <p className="text-[16px] text-ink-500 leading-[1.8] mb-2">
          Each dot is a topic. Its position shows whether it got more or less engagement
          than average, and whether you posted about it more or less over time.
        </p>

        <SelectionLandscape data={data} />

        <p className="text-[15px] text-ink-500 leading-[1.8] mt-4">
          The upper-right quadrant shows topics that received more attention and became
          more frequent &mdash; the <em>reinforced self</em>. The lower-right shows topics
          you kept posting about despite low engagement &mdash; the <em>self-governed self</em>.
          The lower-left shows what faded quietly.
        </p>
        <div className="mt-2"><ConfidenceDot level="interpretive" /></div>
      </section>

      {/* ── Reinforced ───────────────────────────── */}
      {reinforced.length > 0 && (
        <section className="mb-20">
          <h2 className="text-[22px] font-semibold text-ink-900 tracking-tight mb-4">
            Patterns that appeared to be reinforced
          </h2>
          <p className="text-[16px] text-ink-500 leading-[1.8] mb-6">
            These topics got above-average response and became more frequent over time. That
            doesn&apos;t prove the attention caused the increase. But the correlation is there, and
            it&apos;s the kind of pattern that platforms are designed to create.
          </p>
          {reinforced.map(t => (
            <div key={t.topic} className="observation-umber mb-3">
              <h3>{t.topic}</h3>
              <p className="font-sans text-[13px]">{t.postCount} posts &middot; above-average engagement &middot; frequency increased</p>
            </div>
          ))}
          <div className="mt-2"><ConfidenceDot level="interpretive" /></div>
        </section>
      )}

      {/* ── What faded ───────────────────────────── */}
      {faded.length > 0 && (
        <section className="mb-20">
          <h2 className="text-[22px] font-semibold text-ink-900 tracking-tight mb-4">
            What faded quietly
          </h2>
          <p className="text-[16px] text-ink-500 leading-[1.8] mb-6">
            Low engagement, and you posted about these less over time. Something that
            was part of your expression and then wasn&apos;t. Could be a natural shift in
            interest. Could be the environment making space for other things instead.
          </p>
          {faded.slice(0, 4).map(t => (
            <div key={t.topic} className="observation mb-3" style={{ opacity: 0.7 }}>
              <h3>{t.topic}</h3>
              <p className="font-sans text-[13px]">{t.postCount} posts &middot; below-average engagement &middot; frequency decreased</p>
            </div>
          ))}
          <div className="mt-2"><ConfidenceDot level="interpretive" /></div>
        </section>
      )}

      {/* ── Feedback loop ────────────────────────── */}
      {reinforcementCorrelation && (
        <section className="mb-20">
          <h2 className="text-[22px] font-semibold text-ink-900 tracking-tight mb-4">
            The feedback loop question
          </h2>
          <p className="text-[16px] text-ink-500 leading-[1.8] mb-2">
            Did topics that got more attention in one quarter show up more in the next?
            This is our least certain analysis. The correlation exists in the data, but
            many things besides engagement could explain it.
          </p>
          <AreaChart data={reinforcementCorrelation.value} confidence="interpretive" color="trace" caption="Engagement-frequency correlation by quarter" />
        </section>
      )}

      {/* ── Tone and reward ──────────────────────── */}
      {toneShifted && (
        <section className="mb-20">
          <p className="text-[16px] text-ink-500 leading-[1.8]">
            Your tone also shifted over this period &mdash; becoming
            {aLast > aFirst ? ' more assertive' : ' softer'} over time. Whether that
            change was related to engagement patterns, life circumstances, or both,
            is something only you can know.
          </p>
          <div className="mt-2"><ConfidenceDot level="interpretive" /></div>
        </section>
      )}

      {/* ── Honest limits ────────────────────────── */}
      <div className="observation mt-8 mb-12">
        <h3>What we can&apos;t see</h3>
        <p>
          We don&apos;t have access to the platform&apos;s algorithm. We can&apos;t see what was
          shown to you, how your posts were ranked, or what was suppressed. We can
          only see what you wrote and how others responded. The invisible infrastructure
          remains invisible.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-6">
        <Link href="/returning" className="text-link text-[14px]">&larr; What keeps resurfacing</Link>
        <Link href="/selves" className="text-link text-[14px]">The two selves &rarr;</Link>
      </div>
    </div>
  );
}
