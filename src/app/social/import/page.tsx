'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { createClient } from '@/lib/supabase/client';

interface RawPost {
  id: string;
  platform_post_id: string;
  created_at: string;
  content_text: string | null;
  media_type: string;
  hashtags: string[];
  mentions: string[];
  is_repost: boolean;
  likes: number | null;
  shares: number | null;
  replies: number | null;
  views: number | null;
}

interface AccountInfo {
  id: string;
  platform: string;
  platform_username: string;
  platform_display_name: string;
}

function ImportPreviewInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const accountId = searchParams.get('accountId');

  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [posts, setPosts] = useState<RawPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) {
      setError('No account specified.');
      setLoading(false);
      return;
    }
    fetchData(accountId);
  }, [accountId]);

  async function fetchData(id: string) {
    const supabase = createClient();

    const [accountRes, postsRes] = await Promise.all([
      supabase
        .from('connected_accounts')
        .select('id, platform, platform_username, platform_display_name')
        .eq('id', id)
        .single(),
      supabase
        .from('posts_raw')
        .select('*')
        .eq('account_id', id)
        .order('created_at', { ascending: false }),
    ]);

    if (accountRes.error || !accountRes.data) {
      setError('Account not found.');
      setLoading(false);
      return;
    }

    setAccount(accountRes.data);
    setPosts(postsRes.data ?? []);
    setLoading(false);
  }

  async function handleAnalyze() {
    if (!accountId) return;
    setAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/social/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Analysis failed.');
        setAnalyzing(false);
        return;
      }

      router.push(`/social/results?runId=${data.runId}`);
    } catch {
      setError('Network error during analysis.');
      setAnalyzing(false);
    }
  }

  if (loading) {
    return (
      <div className="pt-32 text-center">
        <p className="text-[14px] text-ink-400 font-sans">Loading imported data...</p>
      </div>
    );
  }

  if (error && !account) {
    return (
      <div className="pt-32 text-center">
        <p className="text-[14px] text-red-600 font-sans">{error}</p>
      </div>
    );
  }

  const textPosts = posts.filter((p) => !p.is_repost && p.content_text);
  const dateRange = posts.length > 0
    ? {
        start: new Date(posts[posts.length - 1].created_at).toLocaleDateString(),
        end: new Date(posts[0].created_at).toLocaleDateString(),
      }
    : null;

  return (
    <div>
      <PageHeader
        title="Import preview"
        subtitle={
          account
            ? `@${account.platform_username} on ${account.platform.toUpperCase()} \u2014 ${posts.length} posts imported`
            : undefined
        }
      />

      <div className="wide-column px-6 pb-24">
        {/* Summary card */}
        <div className="card p-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Stat label="Total posts" value={posts.length} />
            <Stat label="Original posts" value={textPosts.length} />
            <Stat label="Reposts" value={posts.length - textPosts.length} />
            <Stat label="Date range" value={dateRange ? `${dateRange.start} \u2013 ${dateRange.end}` : 'N/A'} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-[14px] text-red-700 font-sans">
            {error}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={handleAnalyze}
            disabled={analyzing || textPosts.length === 0}
            className="px-6 py-3 bg-ink-900 hover:bg-ink-700 text-linen-50 text-[14px] font-sans font-medium rounded-full disabled:opacity-50"
          >
            {analyzing ? 'Running analysis...' : `Analyze ${textPosts.length} posts`}
          </button>
          <button
            onClick={() => router.push('/social')}
            className="btn-secondary !py-3 !px-6 !text-[14px]"
          >
            Back to accounts
          </button>
        </div>

        {textPosts.length === 0 ? (
          <div className="observation">
            <h3>No posts to preview</h3>
            <p>
              Import posts first from the account connection page, then return
              here to preview and analyze them.
            </p>
          </div>
        ) : (
          <>
            {/* Caveat */}
            <div className="observation-sage mb-8">
              <h3>Before you proceed</h3>
              <p>
                SelfTrace will analyze the text of your imported posts to detect
                posting patterns, repeated phrases, topic clusters, and
                self-description changes. This is pattern analysis, not
                judgment. The goal is to help you see what became visible and
                repeated over time.
              </p>
            </div>

            {/* Post preview list */}
            <h2 className="font-sans text-[16px] font-semibold text-ink-900 mb-4">
              Recent posts
            </h2>
            <div className="space-y-3">
              {textPosts.slice(0, 25).map((post) => (
                <div key={post.id} className="card p-5">
                  <p className="text-[15px] text-ink-700 leading-relaxed mb-2">
                    {post.content_text}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-[12px] text-ink-400 font-sans">
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    {post.likes !== null && <span>{post.likes} likes</span>}
                    {post.shares !== null && <span>{post.shares} shares</span>}
                    {post.replies !== null && <span>{post.replies} replies</span>}
                    {post.hashtags.length > 0 && (
                      <span>{post.hashtags.map((h) => `#${h}`).join(' ')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {textPosts.length > 25 && (
              <p className="mt-4 text-[13px] text-ink-300 font-sans text-center">
                Showing 25 of {textPosts.length} posts
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-[12px] text-ink-400 font-sans uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-[20px] font-display text-ink-900">{value}</p>
    </div>
  );
}

export default function ImportPreviewPage() {
  return (
    <Suspense fallback={null}>
      <ImportPreviewInner />
    </Suspense>
  );
}
