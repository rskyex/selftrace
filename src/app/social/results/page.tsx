'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { createClient } from '@/lib/supabase/client';
import type { SocialAnalysisResult } from '@/lib/analysis/social';
import Link from 'next/link';

interface AnalysisRun {
  id: string;
  status: string;
  post_count: number;
  completed_at: string | null;
  results: SocialAnalysisResult | null;
}

function ResultsInner() {
  const searchParams = useSearchParams();
  const runId = searchParams.get('runId');

  const [run, setRun] = useState<AnalysisRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!runId) {
      setError('No analysis run specified.');
      setLoading(false);
      return;
    }
    fetchRun(runId);
  }, [runId]);

  async function fetchRun(id: string) {
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from('analysis_runs')
      .select('id, status, post_count, completed_at, results')
      .eq('id', id)
      .single();

    if (err || !data) {
      setError('Analysis run not found.');
      setLoading(false);
      return;
    }

    setRun(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="pt-32 text-center">
        <p className="text-[14px] text-ink-400 font-sans">Loading analysis results...</p>
      </div>
    );
  }

  if (error || !run) {
    return (
      <div className="pt-32 text-center">
        <p className="text-[14px] text-red-600 font-sans">{error ?? 'Unknown error'}</p>
      </div>
    );
  }

  if (run.status === 'running') {
    return (
      <div className="pt-32 text-center">
        <p className="text-[14px] text-ink-400 font-sans">Analysis is still running...</p>
      </div>
    );
  }

  if (run.status === 'failed') {
    return (
      <div className="pt-32 text-center">
        <p className="text-[14px] text-red-600 font-sans">Analysis failed. Please try again.</p>
      </div>
    );
  }

  const results = run.results;
  if (!results) {
    return (
      <div className="pt-32 text-center">
        <p className="text-[14px] text-ink-400 font-sans">No results available.</p>
      </div>
    );
  }

  const { postingFrequency, repeatedPhrases, topicClusters, selfDescriptionChanges, summary } = results;

  return (
    <div>
      <PageHeader
        title="Your trace"
        subtitle={`${summary.totalPosts} posts on ${summary.platform.toUpperCase()} \u2014 ${summary.dominantTrend}`}
      />

      <div className="wide-column px-6 pb-24 space-y-10">

        {/* ── Posting Frequency ──────────────────────────── */}
        <section>
          <SectionTitle title="Posting frequency" status="observed" />
          <div className="card p-8">
            <div className="grid grid-cols-3 gap-6 mb-6">
              <Stat label="Total posts" value={postingFrequency.totalPosts} />
              <Stat label="Avg per month" value={postingFrequency.averagePerMonth} />
              <Stat label="Peak month" value={postingFrequency.peakMonth?.month ?? 'N/A'} />
            </div>

            {/* Simple bar chart */}
            <div className="surface-quiet p-4">
              <div className="flex items-end gap-[2px] h-32">
                {postingFrequency.monthly.map((m) => {
                  const maxCount = Math.max(...postingFrequency.monthly.map((x) => x.count));
                  const height = maxCount > 0 ? (m.count / maxCount) * 100 : 0;
                  return (
                    <div
                      key={m.month}
                      className="flex-1 bg-umber-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                      style={{ height: `${height}%` }}
                      title={`${m.month}: ${m.count} posts`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-ink-400 font-sans">
                <span>{postingFrequency.monthly[0]?.month}</span>
                <span>{postingFrequency.monthly[postingFrequency.monthly.length - 1]?.month}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Repeated Phrases ───────────────────────────── */}
        <section>
          <SectionTitle title="Repeated phrases" status="inferred" />
          {repeatedPhrases.length === 0 ? (
            <div className="observation">
              <p>No phrases repeated 3+ times were detected in your posts.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {repeatedPhrases.slice(0, 12).map((p, i) => (
                <div key={i} className="card p-5">
                  <p className="text-[16px] font-serif text-ink-900 mb-2">
                    &ldquo;{p.phrase}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 text-[12px] text-ink-400 font-sans">
                    <span>{p.count} times</span>
                    <span className={`pill text-[11px] ${
                      p.spread === 'escalating'
                        ? 'bg-umber-100 text-umber-700'
                        : p.spread === 'distributed'
                          ? 'bg-linen-200 text-ink-500'
                          : 'bg-sage-100 text-sage-700'
                    }`}>
                      {p.spread}
                    </span>
                    <span>
                      {new Date(p.firstSeen).toLocaleDateString()} &mdash;{' '}
                      {new Date(p.lastSeen).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Topic Clusters ─────────────────────────────── */}
        <section>
          <SectionTitle title="Topic clusters" status="inferred" />
          {topicClusters.length === 0 ? (
            <div className="observation">
              <p>Not enough data to detect topic clusters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topicClusters.slice(0, 10).map((c, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-sans text-[15px] font-medium text-ink-900 capitalize">
                      {c.topic}
                    </h4>
                    <span className={`pill text-[11px] ${
                      c.trend === 'increasing'
                        ? 'bg-umber-100 text-umber-700'
                        : c.trend === 'decreasing'
                          ? 'bg-linen-200 text-ink-500'
                          : 'bg-sage-100 text-sage-700'
                    }`}>
                      {c.trend}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1 h-2 bg-linen-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-umber-500 rounded-full"
                        style={{ width: `${Math.min(c.percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-[12px] text-ink-400 font-sans w-16 text-right">
                      {c.postCount} posts
                    </span>
                  </div>
                  {c.topWords.length > 1 && (
                    <p className="text-[12px] text-ink-300 font-sans">
                      Related: {c.topWords.slice(1).join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Self-Description Changes ───────────────────── */}
        <section>
          <SectionTitle title="Self-description over time" status="inferred" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="observation">
              <h3>Earlier period</h3>
              {selfDescriptionChanges.early.length === 0 ? (
                <p className="text-[14px] text-ink-400 italic">No self-descriptions detected.</p>
              ) : (
                <ul className="space-y-2 mt-2">
                  {selfDescriptionChanges.early.map((m, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={`mt-1.5 dot ${
                        m.pattern === 'role_claim' ? 'dot-counted' :
                        m.pattern === 'expertise_signal' ? 'dot-patterned' : 'dot-interpretive'
                      }`} />
                      <div>
                        <p className="text-[14px] text-ink-700">&ldquo;{m.phrase}&rdquo;</p>
                        <p className="text-[11px] text-ink-300 font-sans">
                          {m.pattern.replace(/_/g, ' ')} &middot; {new Date(m.date).toLocaleDateString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="observation-umber">
              <h3>Later period</h3>
              {selfDescriptionChanges.late.length === 0 ? (
                <p className="text-[14px] text-ink-400 italic">No self-descriptions detected.</p>
              ) : (
                <ul className="space-y-2 mt-2">
                  {selfDescriptionChanges.late.map((m, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={`mt-1.5 dot ${
                        m.pattern === 'role_claim' ? 'dot-counted' :
                        m.pattern === 'expertise_signal' ? 'dot-patterned' : 'dot-interpretive'
                      }`} />
                      <div>
                        <p className="text-[14px] text-ink-700">&ldquo;{m.phrase}&rdquo;</p>
                        <p className="text-[11px] text-ink-300 font-sans">
                          {m.pattern.replace(/_/g, ' ')} &middot; {new Date(m.date).toLocaleDateString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {selfDescriptionChanges.shifts.length > 0 && (
            <div className="observation-sage mt-6">
              <h3>Detected shifts</h3>
              <ul className="space-y-1 mt-2">
                {selfDescriptionChanges.shifts.map((s, i) => (
                  <li key={i} className="text-[14px] text-ink-700 flex items-center gap-2">
                    <span className="dot dot-patterned" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* ── Navigation ─────────────────────────────────── */}
        <div className="threshold">
          <p>This is what your data shows. What parts feel like yours?</p>
        </div>

        <div className="flex justify-center gap-4">
          <Link href="/social" className="btn-secondary">
            Back to accounts
          </Link>
          <Link href="/connect" className="btn-tertiary">
            Try with a demo profile &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title, status }: { title: string; status: 'observed' | 'inferred' | 'speculative' }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="font-display text-[22px] text-ink-900">{title}</h2>
      <EpistemicBadge status={status} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-[12px] text-ink-400 font-sans uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-[22px] font-display text-ink-900">{value}</p>
    </div>
  );
}

export default function SocialResultsPage() {
  return (
    <Suspense fallback={null}>
      <ResultsInner />
    </Suspense>
  );
}
