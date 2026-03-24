'use client';

import Link from 'next/link';
import { AreaChart } from '@/components/shared/AreaChart';
import { SparkLine } from '@/components/shared/SparkLine';
import { ConfidenceDot } from '@/components/shared/ConfidenceDot';
import { TopicStreamChart } from '@/components/timeline/TopicStreamChart';
import { TimelineBand } from '@/components/timeline/TimelineBand';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function DriftPage() {
  const { activeProfile, analysis, isLoaded } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div className="reading-column px-6 pt-20 pb-24">
        <h1 className="text-[32px] font-semibold tracking-tight text-ink-900 mb-4">Your drift</h1>
        <p className="text-[17px] text-ink-400 leading-relaxed mb-10">
          How your posting patterns shifted over time — gradually enough that
          you might not have noticed.
        </p>
        <ProfileSwitcher />
      </div>
    );
  }

  const { vocabularyDrift, topicEntropy, toneTrends } = analysis;
  const entropy = topicEntropy.value;
  const firstE = entropy[0]?.value ?? 0;
  const lastE = entropy[entropy.length - 1]?.value ?? 0;
  const narrowed = lastE < firstE * 0.75;

  return (
    <div>
      <div className="reading-column px-6 pt-20">
        <h1 className="text-[32px] font-semibold tracking-tight text-ink-900 mb-2">
          Your drift
        </h1>
        <p className="text-[17px] text-ink-400 leading-relaxed mb-10">
          How <em>{activeProfile!.label.toLowerCase()}</em>&apos;s posting
          patterns changed over time.
        </p>
      </div>

      <TimelineBand data={analysis.postingFrequency.value} />

      <div className="reading-column px-6 pb-24">
        <p className="font-sans text-[13px] text-ink-300 mt-2 mb-12">
          Posting density by month — taller areas mean more posts
        </p>

        {/* ── Topic concentration ────────────────── */}
        <h2 className="text-[24px] font-semibold text-ink-900 tracking-tight mb-2">
          Where your focus went
        </h2>
        <p className="text-[15px] text-ink-400 leading-relaxed mb-4">
          {narrowed
            ? 'Your topics narrowed over time. You started with a wider range of subjects and gradually concentrated on fewer. That could mean deepening expertise, intentional focus, or drifting toward what gets response.'
            : 'Your topic range stayed relatively broad throughout. You didn\'t narrow toward a single focus the way some posting histories do.'
          }
        </p>
        <ConfidenceDot level="medium" />

        <div className="wide-column -mx-6 my-6">
          <TopicStreamChart data={analysis.topicDistribution.value} />
        </div>

        {/* ── Topic diversity ─────────────────────── */}
        <h2 className="text-[24px] font-semibold text-ink-900 tracking-tight mt-14 mb-2">
          Topic variety over time
        </h2>
        <p className="text-[15px] text-ink-400 leading-relaxed mb-2">
          How spread out your interests were each quarter.
          {narrowed
            ? ` Yours declined from ${firstE.toFixed(1)} to ${lastE.toFixed(1)} — a noticeable narrowing.`
            : ` Yours stayed relatively stable.`
          }
        </p>
        <AreaChart data={entropy} confidence="medium" color="violet" />

        {/* ── Vocabulary ──────────────────────────── */}
        <h2 className="text-[24px] font-semibold text-ink-900 tracking-tight mt-14 mb-2">
          Words that changed
        </h2>
        <p className="text-[15px] text-ink-400 leading-relaxed mb-6">
          Terms that became more or less frequent between the first and
          second half of your posting history.
        </p>
        <div className="space-y-2">
          {vocabularyDrift.value.slice(0, 8).map(term => (
            <div key={term.term} className="flex items-center gap-3 py-2 border-b border-warm-100">
              <span className="font-mono text-[14px] text-ink-700 w-36">{term.term}</span>
              <span className={`pill text-[12px] ${
                term.direction === 'emerging' ? 'bg-violet-100 text-violet-700' :
                term.direction === 'fading' ? 'bg-coral-100 text-coral-600' :
                'bg-warm-100 text-ink-400'
              }`}>{term.direction}</span>
              <span className="font-mono text-[12px] text-ink-300 ml-auto">
                {term.earlierFrequency} &rarr; {term.laterFrequency}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3"><ConfidenceDot level="medium" /></div>

        {/* ── Tone ────────────────────────────────── */}
        <h2 className="text-[24px] font-semibold text-ink-900 tracking-tight mt-14 mb-2">
          How your tone changed
        </h2>
        <p className="text-[15px] text-ink-400 leading-relaxed mb-6">
          Rough approximations based on word patterns. Think of these as
          directional signals, not measurements.
        </p>
        <div className="space-y-4">
          {(['assertiveness', 'emotionality', 'formality', 'urgency'] as const).map(marker => {
            const series = toneTrends.value[marker];
            const first = series[0]?.value ?? 0;
            const last = series[series.length - 1]?.value ?? 0;
            const diff = last - first;
            return (
              <div key={marker} className="flex items-center gap-4 py-2 border-b border-warm-100">
                <span className="font-sans text-[14px] text-ink-500 w-28 capitalize">{marker}</span>
                <SparkLine data={series} width={120} height={24} />
                <span className="font-sans text-[13px] text-ink-400 ml-auto">
                  {first.toFixed(2)} &rarr; {last.toFixed(2)}
                  {Math.abs(diff) > 0.08 && (
                    <span className="text-ink-300 ml-1">({diff > 0 ? '+' : ''}{diff.toFixed(2)})</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-3"><ConfidenceDot level="low" /></div>

        <p className="mt-6 text-[15px] text-ink-400 italic leading-relaxed">
          Changes in tone could reflect life circumstances, evolving interests,
          audience changes, world events, or platform dynamics. These signals
          can&apos;t tell you which.
        </p>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link href="/portrait" className="font-sans text-[14px] text-violet-600 hover:text-violet-700 font-medium">
            &larr; Back to portrait
          </Link>
          <Link href="/patterns" className="font-sans text-[14px] text-violet-600 hover:text-violet-700 font-medium">
            See what stuck &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
