'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { AreaChart } from '@/components/shared/AreaChart';
import { SparkLine } from '@/components/shared/SparkLine';
import { ConfidenceDot } from '@/components/shared/ConfidenceDot';
import { ProfileSwitcher } from '@/components/shared/ProfileSwitcher';
import { useData } from '@/lib/data/context';

export default function PortraitPage() {
  const { activeProfile, analysis, isLoaded, selfPortrait } = useData();

  if (!isLoaded || !analysis) {
    return (
      <div className="reading-column px-6 pt-24 pb-24">
        <h1 className="font-display text-[30px] md:text-[36px] tracking-tight text-ink-900 leading-[1.1] mb-4">
          Your portrait
        </h1>
        <p className="text-[17px] text-ink-400 leading-relaxed mb-10">
          Load a profile to see your patterns. Or start from the beginning.
        </p>
        <ProfileSwitcher />
        <Link href="/start" className="font-sans inline-block mt-6 text-[14px] text-violet-600 hover:text-violet-700 font-medium">
          &larr; Start from the beginning
        </Link>
      </div>
    );
  }

  const profile = activeProfile!;
  const posts = profile.posts;
  const halfPoint = Math.floor(posts.length / 2);

  // Top topics overall
  const topicCounts: Record<string, number> = {};
  for (const p of posts) {
    if (!p.derived) continue;
    for (const t of p.derived.topics) topicCounts[t.topic] = (topicCounts[t.topic] || 0) + 1;
  }
  const topTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Early vs late topics
  const earlyTopics: Record<string, number> = {};
  const lateTopics: Record<string, number> = {};
  for (const p of posts.slice(0, halfPoint)) {
    if (!p.derived) continue;
    for (const t of p.derived.topics) earlyTopics[t.topic] = (earlyTopics[t.topic] || 0) + 1;
  }
  for (const p of posts.slice(halfPoint)) {
    if (!p.derived) continue;
    for (const t of p.derived.topics) lateTopics[t.topic] = (lateTopics[t.topic] || 0) + 1;
  }
  const earlyTop = Object.entries(earlyTopics).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([t]) => t);
  const lateTop = Object.entries(lateTopics).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([t]) => t);
  const fadedTopics = earlyTop.filter(t => !lateTop.includes(t));

  // Tone shift
  const toneA = analysis.toneTrends.value.assertiveness;
  const assertFirst = toneA[0]?.value ?? 0;
  const assertLast = toneA[toneA.length - 1]?.value ?? 0;

  // Engagement
  const highEngTopics = analysis.engagementSensitivity?.value
    .filter(t => t.frequencyTrend === 'increasing')
    .sort((a, b) => b.averageEngagement - a.averageEngagement)
    .slice(0, 3) ?? [];

  const avgEng = analysis.engagementSensitivity
    ? analysis.engagementSensitivity.value.reduce((s, t) => s + t.averageEngagement, 0) / analysis.engagementSensitivity.value.length
    : 0;
  const keptAnyway = analysis.engagementSensitivity?.value
    .filter(t => t.averageEngagement < avgEng * 0.5 && t.frequencyTrend !== 'decreasing')
    .slice(0, 3) ?? [];

  // Self-descriptions
  const lateDescs = analysis.selfDescriptionShift.value.late;
  const descCounts: Record<string, number> = {};
  for (const d of lateDescs) descCounts[d.phrase] = (descCounts[d.phrase] || 0) + 1;
  const topDescs = Object.entries(descCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

  // Date range
  const startDate = new Date(profile.dataQuality.dateRange.start).toLocaleDateString('en', { month: 'long', year: 'numeric' });
  const endDate = new Date(profile.dataQuality.dateRange.end).toLocaleDateString('en', { month: 'long', year: 'numeric' });

  return (
    <div className="reading-column px-6 pt-24 pb-24">
      <h1 className="font-display text-[30px] md:text-[36px] tracking-tight text-ink-900 leading-[1.1] mb-2">
        Your portrait
      </h1>
      <p className="font-sans text-[14px] text-ink-300 mb-12">
        Based on {profile.dataQuality.totalPosts.toLocaleString()} posts
        from {startDate} to {endDate}
      </p>

      {/* ── Snapshot ─────────────────────────────── */}
      <div className="observation mb-10">
        <h3>Here&apos;s what we see</h3>
        <p>
          Across {profile.dataQuality.totalPosts.toLocaleString()} posts
          over about {profile.timePeriods.length * 3} months, your most
          frequent topics were{' '}
          <strong>{topTopics.slice(0, 3).map(([t]) => t).join(', ')}</strong>.
          {assertLast > assertFirst + 0.1
            ? ' Your voice became more assertive over time.'
            : assertLast < assertFirst - 0.1
            ? ' Your tone softened somewhat over time.'
            : ' Your tone stayed relatively consistent.'}
        </p>
      </div>

      {/* ── Self-portrait comparison ──────────────── */}
      {selfPortrait && selfPortrait.whatMatters && (
        <div className="observation mb-10 bg-umber-50 border-umber-200">
          <h3>What you said vs. what your data shows</h3>
          <p className="mb-4">
            You said what matters most to you is: <em>&ldquo;{selfPortrait.whatMatters}&rdquo;</em>
          </p>
          <p className="mb-2">
            Your data actually shows these as your most frequent topics:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {topTopics.slice(0, 5).map(([topic, count]) => (
              <span key={topic} className="pill bg-violet-100 text-violet-700">
                {topic} <span className="text-violet-400 ml-1">{count}</span>
              </span>
            ))}
          </div>
          <p className="text-[14px] text-ink-400 italic">
            This doesn&apos;t mean your self-image is wrong. It means what you
            notice about yourself and what shows up in the data are sometimes
            different. That&apos;s normal and interesting.
          </p>
          <div className="mt-2"><ConfidenceDot level="patterned" /></div>
        </div>
      )}

      {selfPortrait && selfPortrait.leastVisible && (
        <div className="observation mb-10">
          <h3>About what feels least visible</h3>
          <p>
            You said this side feels least visible: <em>&ldquo;{selfPortrait.leastVisible}&rdquo;</em>
          </p>
          {fadedTopics.length > 0 ? (
            <p className="mt-2">
              Your data shows these topics did fade from your earlier to later
              posts: <strong>{fadedTopics.join(', ')}</strong>. That lines up
              with what you noticed.
            </p>
          ) : (
            <p className="mt-2">
              In the data, your topic mix shifted but it&apos;s hard to match
              specific faded topics to what you described. The patterns might
              show up at a finer level than our topic analysis captures.
            </p>
          )}
          <div className="mt-2"><ConfidenceDot level="patterned" /></div>
        </div>
      )}

      {/* ── Posting frequency ────────────────────── */}
      <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mt-16 mb-2">
        Your posting over time
      </h2>
      <p className="text-[15px] text-ink-400 leading-relaxed mb-2">
        How often you posted, month by month.
      </p>
      <AreaChart data={analysis.postingFrequency.value} confidence="counted" />

      {/* ── What got rewarded ────────────────────── */}
      {highEngTopics.length > 0 && (
        <>
          <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mt-16 mb-2">
            What got attention
          </h2>
          <p className="text-[15px] text-ink-400 leading-relaxed mb-6">
            These topics earned above-average engagement — and you posted
            about them more over time. That correlation is worth noticing,
            even if it doesn&apos;t prove the attention caused it.
          </p>
          {highEngTopics.map(topic => (
            <div key={topic.topic} className="observation mb-4">
              <h3>{topic.topic}</h3>
              <p className="font-sans text-[14px] text-ink-400">
                {topic.postCount} posts &middot; above-average engagement &middot; frequency increased
              </p>
            </div>
          ))}
          <div className="mb-4"><ConfidenceDot level="interpretive" /></div>
        </>
      )}

      {/* ── What you kept ────────────────────────── */}
      {keptAnyway.length > 0 && (
        <>
          <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mt-16 mb-2">
            What you kept anyway
          </h2>
          <p className="text-[15px] text-ink-400 leading-relaxed mb-6">
            These topics persisted in your posting despite getting below-average
            engagement. They suggest something that matters to you independent
            of external feedback.
          </p>
          {keptAnyway.map(topic => (
            <div key={topic.topic} className="observation mb-4 bg-sage-100 border-sage-200">
              <h3>{topic.topic}</h3>
              <p className="font-sans text-[14px] text-ink-400">
                {topic.postCount} posts &middot; low engagement &middot; kept posting
              </p>
            </div>
          ))}
          <div className="mb-4"><ConfidenceDot level="counted" /></div>
        </>
      )}

      {/* ── How you describe yourself ────────────── */}
      {topDescs.length > 0 && (
        <>
          <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mt-16 mb-2">
            How you describe yourself (in your posts)
          </h2>
          <p className="text-[15px] text-ink-400 leading-relaxed mb-6">
            These phrases showed up in your more recent posts when you
            described yourself or your expertise.
          </p>
          <div className="space-y-3 mb-4">
            {topDescs.map(([phrase, count]) => (
              <div key={phrase} className="observation">
                <p className="text-[17px] text-ink-700 italic">&ldquo;{phrase}&rdquo;</p>
                <p className="font-sans text-[13px] text-ink-300 mt-1">appeared {count} times</p>
              </div>
            ))}
          </div>
          <ConfidenceDot level="patterned" />
        </>
      )}

      {/* ── Tone ─────────────────────────────────── */}
      <h2 className="font-display text-[22px] md:text-[24px] text-ink-900 tracking-tight mt-16 mb-2">
        Your tone
      </h2>
      <p className="text-[15px] text-ink-400 leading-relaxed mb-6">
        These are rough approximations based on word patterns — not precise
        measurements. Think of them as directional, not definitive.
      </p>
      <div className="grid grid-cols-2 gap-4">
        {(['assertiveness', 'emotionality', 'formality', 'urgency'] as const).map(marker => {
          const series = analysis.toneTrends.value[marker];
          const first = series[0]?.value ?? 0;
          const last = series[series.length - 1]?.value ?? 0;
          const changed = Math.abs(last - first) > 0.08;
          return (
            <div key={marker} className="observation text-center py-4">
              <p className="font-sans text-[12px] text-ink-400 uppercase tracking-wider mb-2">{marker}</p>
              <SparkLine data={series} width={80} height={24} />
              <p className="font-sans text-[14px] text-ink-700 mt-2">
                {first.toFixed(2)} &rarr; {last.toFixed(2)}
                {changed && <span className="text-ink-300"> &middot; {last > first ? 'increased' : 'decreased'}</span>}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Closing ──────────────────────────────── */}
      <div className="mt-20 pt-10 border-t border-warm-200">
        <p className="text-[17px] text-ink-500 leading-relaxed mb-2">
          These are patterns. They&apos;re not a verdict. Some might feel right.
          Some might surprise you. What you do with them is entirely up to you.
        </p>
        <p className="text-[15px] text-ink-400 italic">
          Patterns you can see are patterns you can choose.
        </p>
      </div>

      {/* ── Navigation ───────────────────────────── */}
      <div className="mt-12 flex flex-wrap gap-4">
        <Link href="/drift" className="font-sans text-[14px] text-violet-600 hover:text-violet-700 font-medium">
          See your drift in detail &rarr;
        </Link>
        <Link href="/patterns" className="font-sans text-[14px] text-violet-600 hover:text-violet-700 font-medium">
          See what stuck &rarr;
        </Link>
      </div>
    </div>
  );
}
