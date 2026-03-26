'use client';

import Link from 'next/link';
import { ConfidenceDot } from '@/components/shared/ConfidenceDot';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

const CATEGORY_LABELS: Record<string, string> = {
  engagement: 'Engagement',
  echo_chamber: 'Echo chamber',
  content_drift: 'Content drift',
  self_presentation: 'Self-presentation',
  attention: 'Attention',
};

const STRENGTH_COLORS: Record<string, string> = {
  subtle: 'bg-trace-300 text-trace-600',
  moderate: 'bg-umber-100 text-umber-700',
  strong: 'bg-umber-200 text-umber-700',
};

export default function AlgorithmInfluencePage() {
  const { algorithmInfluence, isLoaded } = useData();

  if (!isLoaded || !algorithmInfluence) {
    return (
      <div className="reading-column px-6 pt-24 pb-24">
        <h1 className="font-display text-[30px] md:text-[36px] tracking-tight text-ink-900 leading-[1.1] mb-4">
          Algorithm influence
        </h1>
        <p className="text-ink-500 mb-10">Load a profile to see algorithmic influence analysis.</p>
        <ProfileSwitcher />
      </div>
    );
  }

  const { sensitivityScore, patterns, engagementOptimization, echoChamber, platformSignals } = algorithmInfluence;
  const scorePercent = Math.round(sensitivityScore * 100);

  return (
    <div className="reading-column px-6 pt-24 pb-24">
      <header className="mb-16">
        <p className="font-sans text-[12px] text-ink-400 tracking-[0.2em] uppercase mb-5">
          Algorithmic influence
        </p>
        <h1 className="font-display text-[30px] md:text-[36px] tracking-tight text-ink-900 leading-[1.1] mb-4">
          How the algorithm may have shaped you
        </h1>
        <p className="text-[17px] text-ink-500 leading-[1.8]">
          Every platform has invisible architecture — recommendation algorithms, engagement
          metrics, content ranking systems. These create an environment that subtly shapes
          what you express, how often, and in what direction. Here&apos;s what the traces suggest.
        </p>
      </header>

      {/* ── Sensitivity Overview ──────────────────── */}
      <section className="mb-20">
        <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-6">
          Overall influence sensitivity
        </h2>
        <div className="observation py-8 px-8">
          <div className="flex items-center gap-6 mb-5">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" stroke="var(--color-linen-200)" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke="var(--color-umber-500)" strokeWidth="6"
                  strokeDasharray={`${scorePercent * 2.136} 213.6`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-sans text-[18px] font-semibold text-ink-900">{scorePercent}%</span>
              </div>
            </div>
            <div>
              <p className="font-sans text-[14px] font-medium text-ink-700 mb-1">
                Algorithm sensitivity score
              </p>
              <p className="text-[15px] text-ink-500 leading-[1.7]">
                {scorePercent < 25
                  ? 'Low sensitivity. Your posting patterns show few signs of algorithmic influence.'
                  : scorePercent < 50
                  ? 'Moderate sensitivity. Some patterns are consistent with algorithmic shaping.'
                  : scorePercent < 75
                  ? 'Notable sensitivity. Multiple patterns suggest the platform environment influenced your content direction.'
                  : 'High sensitivity. Strong signals that algorithmic environments shaped your expression.'}
              </p>
            </div>
          </div>
          <p className="text-[13px] text-ink-400 leading-[1.6]">
            This is not a verdict. Correlation is not causation. Many of these patterns could
            reflect natural evolution, life changes, or deliberate choices. The score aggregates
            observable signals — you decide what they mean.
          </p>
        </div>
        <div className="mt-3"><ConfidenceDot level="interpretive" /></div>
      </section>

      {/* ── Detected Patterns ────────────────────── */}
      {patterns.length > 0 && (
        <section className="mb-20">
          <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-6">
            Detected influence patterns
          </h2>
          <div className="space-y-4">
            {patterns.map((pattern, i) => (
              <div key={i} className="insight-panel !bg-white !p-0 overflow-hidden">
                <div className="px-7 py-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-display text-[18px] text-ink-900 leading-[1.3]">
                      {pattern.name}
                    </h3>
                    <span className={`pill text-[11px] flex-shrink-0 ${STRENGTH_COLORS[pattern.strength]}`}>
                      {pattern.strength}
                    </span>
                  </div>
                  <p className="text-[15px] text-ink-600 leading-[1.75] mb-3">
                    {pattern.description}
                  </p>
                  <p className="font-sans text-[12px] text-ink-400">
                    {pattern.evidence}
                  </p>
                  <span className={`inline-block mt-3 pill text-[10px] bg-linen-100 text-ink-400`}>
                    {CATEGORY_LABELS[pattern.category] || pattern.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3"><ConfidenceDot level="interpretive" /></div>
        </section>
      )}

      {/* ── Engagement Optimization ──────────────── */}
      <section className="mb-20">
        <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-4">
          Engagement optimization
        </h2>
        <div className={engagementOptimization.detected ? 'observation-umber' : 'observation'}>
          <h3>{engagementOptimization.detected ? 'Signals detected' : 'No strong signal'}</h3>
          <p>{engagementOptimization.description}</p>
          {engagementOptimization.detected && (
            <p className="font-sans text-[12px] text-ink-400 mt-3">
              Strength: {engagementOptimization.strength}
            </p>
          )}
        </div>
        <div className="mt-3"><ConfidenceDot level="interpretive" /></div>
      </section>

      {/* ── Echo Chamber Analysis ────────────────── */}
      <section className="mb-20">
        <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-4">
          Echo chamber indicators
        </h2>
        <p className="text-[16px] text-ink-500 leading-[1.8] mb-6">
          Three dimensions of narrowing that are consistent with algorithmic echo chambers.
          Not proof — but worth noticing.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="observation py-5 px-5 text-center">
            <p className="font-sans text-[24px] font-semibold text-ink-900 mb-1">
              {Math.round(echoChamber.topicConcentration * 100)}%
            </p>
            <p className="font-sans text-[12px] text-ink-400">Topic concentration</p>
          </div>
          <div className="observation py-5 px-5 text-center">
            <p className="font-sans text-[24px] font-semibold text-ink-900 mb-1">
              {Math.round(echoChamber.vocabularyConvergence * 100)}%
            </p>
            <p className="font-sans text-[12px] text-ink-400">Vocabulary convergence</p>
          </div>
          <div className="observation py-5 px-5 text-center">
            <p className="font-sans text-[24px] font-semibold text-ink-900 mb-1">
              {Math.round(echoChamber.toneNarrowing * 100)}%
            </p>
            <p className="font-sans text-[12px] text-ink-400">Tone narrowing</p>
          </div>
        </div>
        <p className="text-[15px] text-ink-500 leading-[1.8]">{echoChamber.description}</p>
        <div className="mt-3"><ConfidenceDot level="interpretive" /></div>
      </section>

      {/* ── Platform Signals ─────────────────────── */}
      <section className="mb-20">
        <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-6">
          Platform behavior signals
        </h2>
        <div className="space-y-3">
          {platformSignals.map((signal, i) => (
            <div key={i} className="flex items-start gap-4 py-4 border-b border-linen-100">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                signal.observed ? 'bg-umber-600' : 'bg-linen-300'
              }`} />
              <div>
                <p className="font-sans text-[14px] font-medium text-ink-700 mb-1">{signal.signal}</p>
                <p className="text-[14px] text-ink-500 leading-[1.6]">{signal.description}</p>
                <span className={`font-sans text-[11px] mt-1 inline-block ${
                  signal.observed ? 'text-umber-600' : 'text-ink-300'
                }`}>
                  {signal.observed ? 'Observed in your data' : 'Not detected'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Honest Limits ────────────────────────── */}
      <div className="observation-sage mb-12">
        <h3>What this analysis cannot do</h3>
        <p>
          We cannot see the algorithm. We don&apos;t know what was recommended to you,
          how your posts were ranked, or what was suppressed. We can only see the
          output — your posts — and look for patterns consistent with known
          algorithmic influence mechanisms.
        </p>
        <p className="mt-3">
          Every pattern here could have a non-algorithmic explanation. The value
          is not in certainty but in visibility — seeing patterns you can then
          evaluate with your own knowledge of your experience.
        </p>
      </div>

      <div className="flex flex-wrap gap-6">
        <Link href="/results" className="text-link text-[14px]">&larr; Overview</Link>
        <Link href="/rewarded" className="text-link text-[14px]">What the environment rewarded &rarr;</Link>
      </div>
    </div>
  );
}
