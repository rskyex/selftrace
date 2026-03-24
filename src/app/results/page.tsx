'use client';

import Link from 'next/link';
import { AreaChart } from '@/components/shared/AreaChart';
import { SparkLine } from '@/components/shared/SparkLine';
import { ConfidenceDot } from '@/components/shared/ConfidenceDot';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function ResultsPage() {
  const { activeProfile, analysis, isLoaded, selfPortrait } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div className="reading-column px-6 pt-24 pb-24">
        <h1 className="text-[32px] font-bold tracking-tight text-ink-900 mb-4">Your results</h1>
        <p className="text-ink-400 mb-10">Load a profile to see your patterns.</p>
        <ProfileSwitcher />
      </div>
    );
  }

  const profile = activeProfile!;
  const posts = profile.posts;
  const half = Math.floor(posts.length / 2);

  // Top topics
  const topicCounts: Record<string, number> = {};
  for (const p of posts) { if (p.derived) for (const t of p.derived.topics) topicCounts[t.topic] = (topicCounts[t.topic] || 0) + 1; }
  const topTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Tone
  const tA = analysis.toneTrends.value.assertiveness;
  const assertFirst = tA[0]?.value ?? 0, assertLast = tA[tA.length - 1]?.value ?? 0;
  const toneWord = assertLast > assertFirst + 0.1 ? 'more assertive' : assertLast < assertFirst - 0.1 ? 'softer' : 'fairly consistent';

  // Engagement
  const eng = analysis.engagementSensitivity;
  const avgEng = eng ? eng.value.reduce((s, t) => s + t.averageEngagement, 0) / eng.value.length : 0;
  const reinforced = eng?.value.filter(t => t.frequencyTrend === 'increasing' && t.averageEngagement > avgEng).slice(0, 3) ?? [];
  const kept = eng?.value.filter(t => t.averageEngagement < avgEng * 0.5 && t.frequencyTrend !== 'decreasing').slice(0, 3) ?? [];

  // Self-descriptions
  const lateDescs = analysis.selfDescriptionShift.value.late;
  const descCounts: Record<string, number> = {};
  for (const d of lateDescs) descCounts[d.phrase] = (descCounts[d.phrase] || 0) + 1;
  const topDescs = Object.entries(descCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

  const startDate = new Date(profile.dataQuality.dateRange.start).toLocaleDateString('en', { month: 'long', year: 'numeric' });
  const endDate = new Date(profile.dataQuality.dateRange.end).toLocaleDateString('en', { month: 'long', year: 'numeric' });

  return (
    <div className="reading-column px-6 pt-24 pb-24">
      <h1 className="text-[32px] font-bold tracking-tight text-ink-900 mb-1">
        Here&apos;s what we noticed.
      </h1>
      <p className="font-sans text-[14px] text-ink-300 mb-14">
        Based on {profile.dataQuality.totalPosts.toLocaleString()} posts &middot; {startDate} to {endDate}
      </p>

      {/* ── The Mirror ───────────────────────────── */}
      {selfPortrait && selfPortrait.topics && (
        <section className="mb-16">
          <h2 className="text-[24px] font-bold text-ink-900 mb-6">What you told us vs. what your posts show</h2>

          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <div className="observation">
              <h3>What you told us</h3>
              <p className="mb-2"><strong className="text-ink-700">Topics that matter:</strong> <em>{selfPortrait.topics}</em></p>
              {selfPortrait.values && <p className="mb-2"><strong className="text-ink-700">How you describe yourself:</strong> <em>{selfPortrait.voice || selfPortrait.values}</em></p>}
              {selfPortrait.driftedFrom && <p><strong className="text-ink-700">What you think you post about:</strong> <em>{selfPortrait.driftedFrom}</em></p>}
            </div>

            <div className="observation-highlight">
              <h3>What your posts show</h3>
              <p className="mb-3">Your most frequent topics:</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {topTopics.map(([t, c]) => (
                  <span key={t} className="pill bg-coral-100 text-coral-700">{t} <span className="text-coral-500 ml-1 text-[11px]">{c}</span></span>
                ))}
              </div>
              <p>Your voice has been {toneWord} over time.</p>
              {topDescs.length > 0 && <p className="mt-2">You describe yourself as: <em>&ldquo;{topDescs[0][0]}&rdquo;</em></p>}
            </div>
          </div>

          <p className="text-[15px] text-ink-400 italic leading-relaxed">
            These differences don&apos;t mean your self-image is wrong. They mean
            what you notice about yourself and what shows up in the data are
            sometimes different things. That gap is often the most interesting part.
          </p>
          <div className="mt-2"><ConfidenceDot level="medium" /></div>
        </section>
      )}

      {/* ── Snapshot ─────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-[24px] font-bold text-ink-900 mb-4">Your snapshot</h2>

        <div className="observation mb-4">
          <p>
            Across {profile.dataQuality.totalPosts.toLocaleString()} posts
            over about {profile.timePeriods.length * 3} months, your most
            frequent topics were <strong>{topTopics.slice(0, 3).map(([t]) => t).join(', ')}</strong>.
            Your voice became {toneWord} over time.
            {reinforced.length > 0 && ` Some of what you posted most about was also what got the most attention.`}
          </p>
        </div>

        <AreaChart data={analysis.postingFrequency.value} caption="How often you posted, month by month" confidence="high" />
      </section>

      {/* ── What got attention ────────────────────── */}
      {reinforced.length > 0 && (
        <section className="mb-16">
          <h2 className="text-[24px] font-bold text-ink-900 mb-2">What got attention</h2>
          <p className="text-[15px] text-ink-400 mb-6">
            These topics got more engagement than average — and you posted about them
            more over time. Worth noticing, even if the attention didn&apos;t cause it.
          </p>
          {reinforced.map(t => (
            <div key={t.topic} className="observation mb-3">
              <h3>{t.topic}</h3>
              <p className="font-sans text-[13px]">{t.postCount} posts &middot; above-average response &middot; frequency increased</p>
            </div>
          ))}
          <ConfidenceDot level="low" />
        </section>
      )}

      {/* ── What you kept ────────────────────────── */}
      {kept.length > 0 && (
        <section className="mb-16">
          <h2 className="text-[24px] font-bold text-ink-900 mb-2">What you kept anyway</h2>
          <p className="text-[15px] text-ink-400 mb-6">
            These persisted despite low engagement. That says something.
          </p>
          {kept.map(t => (
            <div key={t.topic} className="observation-sage mb-3">
              <h3>{t.topic}</h3>
              <p className="font-sans text-[13px]">{t.postCount} posts &middot; low engagement &middot; you kept going</p>
            </div>
          ))}
          <ConfidenceDot level="high" />
        </section>
      )}

      {/* ── Tone snapshot ────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-[24px] font-bold text-ink-900 mb-2">Your tone</h2>
        <p className="text-[15px] text-ink-400 mb-6">
          Rough signals based on word patterns, not precise measurements.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {(['assertiveness', 'emotionality', 'formality', 'urgency'] as const).map(m => {
            const s = analysis.toneTrends.value[m];
            const f = s[0]?.value ?? 0, l = s[s.length - 1]?.value ?? 0;
            return (
              <div key={m} className="observation text-center py-4">
                <p className="font-sans text-[11px] text-ink-400 uppercase tracking-wider mb-2">{m}</p>
                <SparkLine data={s} width={80} height={22} />
                <p className="font-sans text-[14px] text-ink-700 mt-2">{f.toFixed(2)} &rarr; {l.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-3"><ConfidenceDot level="low" /></div>
      </section>

      {/* ── Closing ──────────────────────────────── */}
      <div className="border-t border-linen-200 pt-10 mt-10">
        <p className="text-[18px] text-ink-500 leading-relaxed mb-2">
          These are patterns, not a verdict. Some will feel right. Some might
          surprise you. What you do with them is entirely up to you.
        </p>
        <p className="text-[16px] text-ink-400 italic">
          Patterns you can see are patterns you can choose.
        </p>
      </div>

      {/* ── Go deeper ────────────────────────────── */}
      <div className="mt-12 flex flex-wrap gap-6">
        <Link href="/trends" className="font-sans text-[14px] text-coral-600 hover:text-coral-700 font-semibold">
          See how things shifted over time &rarr;
        </Link>
        <Link href="/what-stuck" className="font-sans text-[14px] text-coral-600 hover:text-coral-700 font-semibold">
          See what stuck &rarr;
        </Link>
      </div>
    </div>
  );
}
