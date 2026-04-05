import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, createServiceClient } from '@/lib/supabase/server';
import { analyzeSocialPosts } from '@/lib/analysis/social';

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const accountId = body.accountId as string;

  if (!accountId) {
    return NextResponse.json({ error: 'accountId is required' }, { status: 400 });
  }

  // Verify account ownership
  const { data: account, error: accountError } = await supabase
    .from('connected_accounts')
    .select('*')
    .eq('id', accountId)
    .single();

  if (accountError || !account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  // Fetch all imported posts for this account
  const { data: posts, error: postsError } = await supabase
    .from('posts_raw')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: true });

  if (postsError) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }

  if (!posts || posts.length === 0) {
    return NextResponse.json({ error: 'No imported posts to analyze. Import posts first.' }, { status: 400 });
  }

  const service = createServiceClient();

  // Create analysis run record
  const { data: run, error: runError } = await service
    .from('analysis_runs')
    .insert({
      user_id: user.id,
      account_id: accountId,
      status: 'running',
      post_count: posts.length,
    })
    .select()
    .single();

  if (runError || !run) {
    return NextResponse.json({ error: 'Failed to create analysis run' }, { status: 500 });
  }

  try {
    const results = analyzeSocialPosts(posts, account.platform);

    // Save results
    await service
      .from('analysis_runs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        posting_frequency: results.postingFrequency,
        repeated_phrases: results.repeatedPhrases,
        topic_clusters: results.topicClusters,
        self_description_changes: results.selfDescriptionChanges,
        results: results,
      })
      .eq('id', run.id);

    return NextResponse.json({ runId: run.id, results });
  } catch (err) {
    console.error('Analysis error:', err);
    await service
      .from('analysis_runs')
      .update({
        status: 'failed',
        error_message: err instanceof Error ? err.message : 'Unknown error',
      })
      .eq('id', run.id);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
