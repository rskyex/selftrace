import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, createServiceClient } from '@/lib/supabase/server';
import { getConnector } from '@/lib/platforms/registry';
import type { PlatformId } from '@/lib/platforms/types';

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

  // Fetch the connected account (RLS ensures ownership)
  const { data: account, error: accountError } = await supabase
    .from('connected_accounts')
    .select('*')
    .eq('id', accountId)
    .single();

  if (accountError || !account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  if (account.status === 'revoked') {
    return NextResponse.json({ error: 'Account access has been revoked. Please reconnect.' }, { status: 403 });
  }

  const platform = account.platform as PlatformId;
  const connector = getConnector(platform);

  let accessToken = account.access_token;

  // Refresh token if expired
  if (account.token_expires_at && new Date(account.token_expires_at) < new Date()) {
    if (!account.refresh_token) {
      // Mark account as expired
      const service = createServiceClient();
      await service
        .from('connected_accounts')
        .update({ status: 'expired' })
        .eq('id', accountId);
      return NextResponse.json({ error: 'Token expired and no refresh token available. Please reconnect.' }, { status: 401 });
    }

    try {
      const newTokens = await connector.refreshAccessToken(account.refresh_token);
      accessToken = newTokens.accessToken;

      // Update stored tokens
      const service = createServiceClient();
      await service
        .from('connected_accounts')
        .update({
          access_token: newTokens.accessToken,
          refresh_token: newTokens.refreshToken ?? account.refresh_token,
          token_expires_at: newTokens.expiresAt?.toISOString(),
          status: 'active',
        })
        .eq('id', accountId);
    } catch {
      const service = createServiceClient();
      await service
        .from('connected_accounts')
        .update({ status: 'expired' })
        .eq('id', accountId);
      return NextResponse.json({ error: 'Failed to refresh token. Please reconnect.' }, { status: 401 });
    }
  }

  try {
    const posts = await connector.fetchRecentPosts(accessToken);

    if (posts.length === 0) {
      return NextResponse.json({ imported: 0, message: 'No posts found on this account.' });
    }

    // Insert posts into posts_raw (upsert to avoid duplicates)
    const service = createServiceClient();
    const rows = posts.map((p) => ({
      account_id: accountId,
      user_id: user.id,
      platform,
      platform_post_id: p.platformPostId,
      created_at: p.createdAt,
      content_text: p.contentText,
      media_type: p.mediaType,
      hashtags: p.hashtags,
      mentions: p.mentions,
      is_repost: p.isRepost,
      likes: p.likes,
      shares: p.shares,
      replies: p.replies,
      views: p.views,
      raw_json: p.rawJson,
    }));

    const { error: insertError } = await service
      .from('posts_raw')
      .upsert(rows, { onConflict: 'account_id,platform_post_id' });

    if (insertError) {
      console.error('Failed to insert posts:', insertError);
      return NextResponse.json({ error: 'Failed to save imported posts' }, { status: 500 });
    }

    // Update last_sync_at
    await service
      .from('connected_accounts')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', accountId);

    return NextResponse.json({ imported: posts.length });
  } catch (err) {
    if (err instanceof Error && err.message === 'EXPIRED_TOKEN') {
      const service = createServiceClient();
      await service
        .from('connected_accounts')
        .update({ status: 'expired' })
        .eq('id', accountId);
      return NextResponse.json({ error: 'Token expired. Please reconnect.' }, { status: 401 });
    }
    console.error('Import error:', err);
    return NextResponse.json({ error: 'Failed to import posts' }, { status: 500 });
  }
}
