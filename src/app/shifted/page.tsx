'use client';

import Link from 'next/link';
import { AreaChart } from '@/components/shared/AreaChart';
import { ConfidenceDot } from '@/components/shared/ConfidenceDot';
import { CorridorChart } from '@/components/charts/CorridorChart';
import { TopicStreamChart } from '@/components/timeline/TopicStreamChart';
import { TimelineBand } from '@/components/timeline/TimelineBand';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function ShiftedPage() {
  const { activeProfile, analysis, isLoaded } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div className="reading-column px-6 pt-28 pb-24">
        <h1 className="text-[30px] font-bold tracking-tight text-ink-900 mb-4">How things shifted</h1>
        <p className="text-ink-500 mb-10">Load a profile to see drift over time.</p>
        <ProfileSwitcher />
      </div>
    );
  }

  const { postingFrequency, topicEntropy, topicDistribution, vocabularyDrift, toneTrends } = analysis;
  const e = topicEntropy.value;
  const eFirst = e[0]?.value ?? 0, eLast = e[e.length - 1]?.value ?? 0;
  const narrowed = eLast < eFirst * 0.75;

  return (
    <div>
      <div className="reading-column px-6 pt-28">
        <h1 className="text-[30px] font-bold tracking-tight text-ink-900 mb-3">
          How things shifted
        </h1>
        <p className="text-[17px] text-ink-500 leading-[1.8] mb-16">
          Change is normal. People evolve. What&apos;s worth examining is the shape of the
          change &mdash; whether it looks like deliberate growth, natural drift, or something
          that has the quiet fingerprints of environmental mediation on it.
        </p>
      </div>

      {/* ── Posting density ──────────────────────── */}
      <div className="content-column px-6 mb-4">
        <TimelineBand data={postingFrequency.value} />
        <p className="font-sans text-[11px] text-ink-300 text-center mt-1">Posting density by month</p>
      </div>

      <div className="reading-column px-6 pb-24">
        {/* ── The Corridor ───────────────────────── */}
        <section className="mb-20 mt-16">
          <h2 className="text-[22px] font-semibold text-ink-900 tracking-tight mb-4">
            Your epistemic corridor
          </h2>
          <p className="text-[16px] text-ink-500 leading-[1.8] mb-2">
            This shows the width of your world over time &mdash; how many different
            subjects you engaged with in each period.
            {narrowed
              ? ' Yours narrowed. You started with a wider range and gradually concentrated on fewer topics.'
              : ' Yours stayed relatively open.'}
          </p>
          <p className="text-[15px] text-ink-500 leading-[1.8] mb-2">
            {narrowed
              ? 'A narrowing corridor can mean expertise deepening, intentional focus, or the environment selecting certain directions. It\'s usually some combination.'
              : 'A stable corridor can mean deliberate breadth, or an environment that didn\'t strongly select for specialization.'}
          </p>
          <CorridorChart data={e} />
          <ConfidenceDot level="patterned" />
        </section>

        {/* ── Topic stream ───────────────────────── */}
        <section className="mb-20">
          <h2 className="text-[22px] font-semibold text-ink-900 tracking-tight mb-4">
            Where your attention went
          </h2>
          <p className="text-[16px] text-ink-500 leading-[1.8] mb-2">
            The composition of your posts over time. What grew, what shrank, what held steady.
          </p>
          <TopicStreamChart data={topicDistribution.value} />
          <ConfidenceDot level="counted" />
        </section>

        {/* ── Vocabulary ─────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-[22px] font-semibold text-ink-900 tracking-tight mb-4">
            Words that changed
          </h2>
          <p className="text-[16px] text-ink-500 leading-[1.8] mb-6">
            Some words became more central to how you write. Others faded. The character
            of the change matters &mdash; did vocabulary become more specialized? More
            in-group? More platform-native?
          </p>
          <div className="space-y-1">
            {vocabularyDrift.value.slice(0, 10).map(t => (
              <div key={t.term} className="flex items-center gap-3 py-3 border-b border-linen-100">
                <span className="font-mono text-[14px] text-ink-700 w-36">{t.term}</span>
                <span className={`pill text-[12px] ${
                  t.direction === 'emerging' ? 'bg-umber-100 text-umber-700'
                    : t.direction === 'fading' ? 'bg-linen-200 text-ink-400'
                    : 'bg-linen-100 text-ink-400'
                }`}>{t.direction}</span>
                <span className="font-mono text-[12px] text-ink-400 ml-auto">{t.earlierFrequency} &rarr; {t.laterFrequency}</span>
              </div>
            ))}
          </div>
          <div className="mt-3"><ConfidenceDot level="counted" /></div>
        </section>

        {/* ── Tone trajectory ────────────────────── */}
        <section className="mb-20">
          <h2 className="text-[22px] font-semibold text-ink-900 tracking-tight mb-4">
            How your tone evolved
          </h2>
          <p className="text-[16px] text-ink-500 leading-[1.8] mb-6">
            Rough approximations based on word patterns. These capture something about
            how you write, not what you feel. Think of them as directional, not precise.
          </p>
          {(['assertiveness', 'emotionality', 'formality', 'urgency'] as const).map(m => {
            const s = toneTrends.value[m];
            const f = s[0]?.value ?? 0, l = s[s.length - 1]?.value ?? 0, d = l - f;
            if (Math.abs(d) < 0.04) return null;
            return (
              <div key={m}>
                <AreaChart data={s} color="trace" height={130} caption={`${m}: ${f.toFixed(2)} → ${l.toFixed(2)} (${d > 0 ? '+' : ''}${d.toFixed(2)})`} confidence="interpretive" />
              </div>
            );
          })}
        </section>

        {/* ── Closing ────────────────────────────── */}
        <p className="text-[16px] text-ink-500 leading-[1.8] border-t border-linen-200 pt-10">
          These shifts could reflect life changes, evolving interests, audience dynamics,
          platform incentives, or all of the above. The product of a self under reconstruction
          looks like this &mdash; gradual, layered, and usually invisible until you look at it
          this way.
        </p>

        <div className="mt-12 flex flex-wrap gap-6">
          <Link href="/selves" className="text-link text-[14px]">&larr; The two selves</Link>
          <Link href="/kept" className="text-link text-[14px]">What you kept &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
