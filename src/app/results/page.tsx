'use client';

import Link from 'next/link';
import { AreaChart } from '@/components/shared/AreaChart';
import { ConfidenceDot } from '@/components/shared/ConfidenceDot';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function ResultsPage() {
  const { activeProfile, analysis, isLoaded, selfPortrait } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div className="reading-column px-6 pt-24 pb-24">
        <h1 className="font-display text-[30px] md:text-[36px] tracking-tight text-ink-900 leading-[1.1] mb-4">
          Your results
        </h1>
        <p className="text-ink-500 mb-10">Load a profile to begin.</p>
        <ProfileSwitcher />
      </div>
    );
  }

  const profile = activeProfile!;
  const startDate = new Date(profile.dataQuality.dateRange.start).toLocaleDateString('en', { month: 'long', year: 'numeric' });
  const endDate = new Date(profile.dataQuality.dateRange.end).toLocaleDateString('en', { month: 'long', year: 'numeric' });

  // Top topics
  const topicCounts: Record<string, number> = {};
  for (const p of profile.posts) { if (p.derived) for (const t of p.derived.topics) topicCounts[t.topic] = (topicCounts[t.topic] || 0) + 1; }
  const topTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Entropy direction
  const e = analysis.topicEntropy.value;
  const eFirst = e[0]?.value ?? 0, eLast = e[e.length - 1]?.value ?? 0;
  const narrowed = eLast < eFirst * 0.75;

  // Engagement
  const eng = analysis.engagementSensitivity;
  const avgEng = eng ? eng.value.reduce((s, t) => s + t.averageEngagement, 0) / eng.value.length : 0;
  const reinforced = eng?.value.filter(t => t.frequencyTrend === 'increasing' && t.averageEngagement > avgEng).slice(0, 3) ?? [];
  const kept = eng?.value.filter(t => t.averageEngagement < avgEng * 0.5 && t.frequencyTrend !== 'decreasing').slice(0, 3) ?? [];

  return (
    <div className="reading-column px-6 pt-24 pb-24">
      {/* ── Frame ────────────────────────────────── */}
      <div className="mb-20">
        <p className="font-sans text-[12px] text-ink-400 tracking-[0.15em] mb-8">
          {profile.dataQuality.totalPosts.toLocaleString()} posts &middot; {startDate} to {endDate}
        </p>

        <div className="prose-body text-[18px] text-ink-700 leading-[1.85]">
          <p>Here is your posting history, read carefully.</p>
          <p>
            What follows isn&apos;t a personality test or a diagnosis. It&apos;s a reconstruction &mdash;
            a picture of your visible self assembled from what you wrote, when you wrote it,
            and how the environment around you responded.
          </p>
          <p className="text-ink-500">
            Some of what you see will match how you already understand yourself. Some of it
            may not. That gap &mdash; between how you experience yourself and what the traces
            show &mdash; is often where the most interesting questions live.
          </p>
          <p className="text-ink-500">
            We&apos;ll show you what we can see, name what it might mean, and be honest about
            what we can&apos;t know. The interpretation is yours.
          </p>
        </div>
      </div>

      {/* ── Your World ───────────────────────────── */}
      <div className="threshold">
        <p>Your world</p>
      </div>

      <section className="mb-20">
        <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-4">
          Your range of subjects over time
        </h2>
        <p className="text-[17px] text-ink-700 leading-[1.8] mb-2">
          Across {profile.dataQuality.totalPosts.toLocaleString()} posts, your most frequent
          topics were {topTopics.slice(0, 3).map(([t]) => t).join(', ')}.
          {narrowed
            ? ' Your range of subjects narrowed over this period \u2014 you engaged with fewer topics by the end than at the start.'
            : ' Your range of subjects stayed relatively broad throughout.'}
        </p>
        <p className="text-[16px] text-ink-500 leading-[1.8] mb-4">
          {narrowed
            ? 'This could mean deepening focus, intentional specialization, or a gradual drifting toward what the environment made easiest to talk about. Probably some of each.'
            : 'Not everyone narrows. A stable range can mean deliberate breadth, or that the feedback environment didn\u2019t strongly select for any single direction.'}
        </p>
        <ConfidenceDot level="patterned" />
        <AreaChart data={e} confidence="patterned" color="trace" caption="Topic diversity by quarter" />
      </section>

      {/* ── Your Self ────────────────────────────── */}
      <div className="threshold">
        <p>Your self</p>
      </div>

      {selfPortrait && selfPortrait.whatMatters && (
        <section className="mb-20">
          <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-4">
            What you told us, and what the traces show
          </h2>
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <div className="observation">
              <h3>How you described yourself</h3>
              {selfPortrait.whatMatters && <p className="mb-2 italic">&ldquo;{selfPortrait.whatMatters}&rdquo;</p>}
              {selfPortrait.returnTo && <p className="mb-2 text-[14px]">Returns to: <em>{selfPortrait.returnTo}</em></p>}
              {selfPortrait.mostVisible && <p className="mb-2 text-[14px]">Most visible side: <em>{selfPortrait.mostVisible}</em></p>}
              {selfPortrait.leastVisible && <p className="text-[14px]">Least visible: <em>{selfPortrait.leastVisible}</em></p>}
            </div>
            <div className="observation-umber">
              <h3>What the traces show</h3>
              <p className="mb-3">Your most frequent topics:</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {topTopics.map(([t, c]) => (
                  <span key={t} className="pill bg-umber-100 text-umber-700">{t} <span className="text-umber-500 ml-1 text-[11px]">{c}</span></span>
                ))}
              </div>
              {reinforced.length > 0 && <p className="text-[14px]">Reinforced: {reinforced.map(t => t.topic).join(', ')}</p>}
            </div>
          </div>
          <p className="text-[16px] text-ink-500 leading-[1.8]">
            Where these overlap, your self-knowledge lines up with the visible record.
            Where they diverge, something worth noticing may have happened in the space
            between &mdash; not an error in how you see yourself, but a gap between the
            self you experience and the self the data can see.
          </p>
          <div className="mt-2"><ConfidenceDot level="patterned" /></div>
        </section>
      )}

      {/* ── Brief reinforcement signal ───────────── */}
      {reinforced.length > 0 && (
        <section className="mb-20">
          <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-4">
            What the environment appeared to reward
          </h2>
          <p className="text-[16px] text-ink-500 leading-[1.8] mb-6">
            These topics received more engagement than average, and you posted about
            them more over time. The pattern is visible. Whether the attention caused
            the increase is something only you can feel.
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

      {/* ── Your Authorship ──────────────────────── */}
      <div className="threshold">
        <p>Your authorship</p>
      </div>

      {kept.length > 0 && (
        <section className="mb-20">
          <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mb-4">
            What you kept
          </h2>
          <p className="text-[16px] text-ink-500 leading-[1.8] mb-6">
            Below-average engagement, but you kept going. That persistence &mdash; continuing
            to express something because it matters to you, not because the environment
            rewards it &mdash; may be the clearest trace of your own agency.
          </p>
          {kept.map(t => (
            <div key={t.topic} className="observation-sage mb-3">
              <h3>{t.topic}</h3>
              <p className="font-sans text-[13px]">{t.postCount} posts &middot; low engagement &middot; you kept going</p>
            </div>
          ))}
          <div className="mt-2"><ConfidenceDot level="counted" /></div>
        </section>
      )}

      {/* ── Closing ──────────────────────────────── */}
      <section className="border-t border-linen-200 pt-14 mt-6 prose-body">
        <p className="text-[17px] text-ink-500 leading-[1.8]">
          These are traces, not verdicts. Some will match how you already understand
          yourself. Some may not. What you do with the difference is yours to decide.
        </p>
        <p className="font-display text-[18px] text-ink-400 italic">
          Patterns you can see are patterns you can choose.
        </p>
      </section>

      {/* ── Go deeper ────────────────────────────── */}
      <div className="mt-16 space-y-4">
        <Link href="/returning" className="text-link block text-[15px]">What keeps resurfacing &rarr;</Link>
        <Link href="/rewarded" className="text-link block text-[15px]">What the environment rewarded &rarr;</Link>
        <Link href="/selves" className="text-link block text-[15px]">The self you described and the self the traces show &rarr;</Link>
        <Link href="/shifted" className="text-link block text-[15px]">How things shifted &rarr;</Link>
        <Link href="/kept" className="text-link block text-[15px]">What you kept &rarr;</Link>
      </div>
    </div>
  );
}
