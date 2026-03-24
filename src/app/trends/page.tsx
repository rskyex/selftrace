'use client';

import Link from 'next/link';
import { AreaChart } from '@/components/shared/AreaChart';
import { SparkLine } from '@/components/shared/SparkLine';
import { ConfidenceDot } from '@/components/shared/ConfidenceDot';
import { TopicStreamChart } from '@/components/timeline/TopicStreamChart';
import { TimelineBand } from '@/components/timeline/TimelineBand';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function TrendsPage() {
  const { activeProfile, analysis, isLoaded } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div className="reading-column px-6 pt-24 pb-24">
        <h1 className="text-[32px] font-bold tracking-tight text-ink-900 mb-4">Your trends</h1>
        <p className="text-ink-400 mb-10">How your patterns shifted over time.</p>
        <ProfileSwitcher />
      </div>
    );
  }

  const { vocabularyDrift, topicEntropy, toneTrends } = analysis;
  const e = topicEntropy.value;
  const eFirst = e[0]?.value ?? 0, eLast = e[e.length - 1]?.value ?? 0;
  const narrowed = eLast < eFirst * 0.75;

  return (
    <div>
      <div className="reading-column px-6 pt-24">
        <h1 className="text-[32px] font-bold tracking-tight text-ink-900 mb-2">Your trends</h1>
        <p className="text-[17px] text-ink-400 mb-10">
          How things shifted over time — gradually enough you might not have noticed.
        </p>
      </div>

      <div className="content-column px-6">
        <TimelineBand data={analysis.postingFrequency.value} />
        <p className="font-sans text-[12px] text-ink-300 mt-1 mb-10 text-center">Posting density by month</p>
      </div>

      <div className="reading-column px-6 pb-24">
        {/* Topic focus */}
        <h2 className="text-[24px] font-bold text-ink-900 mb-2">Where your focus went</h2>
        <p className="text-[15px] text-ink-400 leading-relaxed mb-4">
          {narrowed
            ? 'Your topics narrowed over time. You started with a wider range and gradually concentrated on fewer. That could mean deepening expertise, intentional focus, or drifting toward what gets response.'
            : 'Your topic range stayed fairly broad. You didn\'t narrow toward a single focus the way some posting histories do.'}
        </p>
        <ConfidenceDot level="medium" />

        <div className="content-column -mx-6 my-6">
          <TopicStreamChart data={analysis.topicDistribution.value} />
        </div>

        {/* Diversity */}
        <h2 className="text-[24px] font-bold text-ink-900 mt-14 mb-2">How spread out your interests were</h2>
        <p className="text-[15px] text-ink-400 mb-2">
          {narrowed ? `Yours went from ${eFirst.toFixed(1)} to ${eLast.toFixed(1)} — a noticeable narrowing.` : 'Yours stayed relatively stable.'}
        </p>
        <AreaChart data={e} confidence="medium" />

        {/* Vocabulary */}
        <h2 className="text-[24px] font-bold text-ink-900 mt-14 mb-2">Words that changed</h2>
        <p className="text-[15px] text-ink-400 mb-6">Some words became more central to how you write. Others faded.</p>
        <div className="space-y-1">
          {vocabularyDrift.value.slice(0, 8).map(t => (
            <div key={t.term} className="flex items-center gap-3 py-2.5 border-b border-linen-100">
              <span className="font-mono text-[14px] text-ink-700 w-36">{t.term}</span>
              <span className={`pill text-[12px] ${t.direction === 'emerging' ? 'bg-coral-100 text-coral-700' : t.direction === 'fading' ? 'bg-linen-200 text-ink-400' : 'bg-linen-100 text-ink-400'}`}>{t.direction}</span>
              <span className="font-mono text-[12px] text-ink-300 ml-auto">{t.earlierFrequency} &rarr; {t.laterFrequency}</span>
            </div>
          ))}
        </div>
        <div className="mt-3"><ConfidenceDot level="medium" /></div>

        {/* Tone */}
        <h2 className="text-[24px] font-bold text-ink-900 mt-14 mb-2">How your tone shifted</h2>
        <p className="text-[15px] text-ink-400 mb-6">Rough approximations. Think of these as directional, not precise.</p>
        <div className="space-y-3">
          {(['assertiveness', 'emotionality', 'formality', 'urgency'] as const).map(m => {
            const s = toneTrends.value[m];
            const f = s[0]?.value ?? 0, l = s[s.length - 1]?.value ?? 0, d = l - f;
            if (Math.abs(d) < 0.06) return null;
            return (
              <div key={m} className="flex items-center gap-4 py-2.5 border-b border-linen-100">
                <span className="font-sans text-[14px] text-ink-500 w-28 capitalize">{m}</span>
                <SparkLine data={s} width={100} height={22} />
                <span className="font-sans text-[13px] text-ink-400 ml-auto">
                  {f.toFixed(2)} &rarr; {l.toFixed(2)}
                  <span className="text-ink-300 ml-1">({d > 0 ? '+' : ''}{d.toFixed(2)})</span>
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-3"><ConfidenceDot level="low" /></div>
        <p className="mt-4 text-[14px] text-ink-400 italic">
          Could reflect life changes, evolving interests, audience shifts, or platform dynamics. Probably a mix.
        </p>

        <div className="mt-16 flex flex-wrap gap-6">
          <Link href="/results" className="font-sans text-[14px] text-coral-600 hover:text-coral-700 font-semibold">&larr; Your results</Link>
          <Link href="/what-stuck" className="font-sans text-[14px] text-coral-600 hover:text-coral-700 font-semibold">What stuck &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
