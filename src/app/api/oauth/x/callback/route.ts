import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isSupabaseConfigured, createServerSupabase, createServiceClient } from '@/lib/supabase/server';
import { getConnector } from '@/lib/platforms/registry';
import { getAppUrl } from '@/lib/platforms/env';

export async function GET(request: NextRequest) {
  const appUrl = getAppUrl();
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  // Handle denial or errors from X
  if (error) {
    return NextResponse.redirect(`${appUrl}/start?error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${appUrl}/start?error=missing_params`);
  }

  // Guard: infrastructure must be configured
  if (!isSupabaseConfigured()) {
    console.error('[oauth/x/callback] Supabase is not configured.');
    return NextResponse.redirect(`${appUrl}/start?error=oauth_not_configured`);
  }

  // Validate state
  const cookieStore = await cookies();
  const savedState = cookieStore.get('x_oauth_state')?.value;
  const codeVerifier = cookieStore.get('x_code_verifier')?.value;

  if (!savedState || state !== savedState || !codeVerifier) {
    console.error('[oauth/x/callback] State mismatch or missing verifier.', {
      hasState: !!savedState,
      stateMatch: state === savedState,
      hasVerifier: !!codeVerifier,
    });
    return NextResponse.redirect(`${appUrl}/start?error=invalid_state`);
  }

  // Clear OAuth cookies
  cookieStore.delete('x_oauth_state');
  cookieStore.delete('x_code_verifier');

  // Verify authenticated user
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${appUrl}/start?error=not_authenticated`);
  }

  try {
    const connector = getConnector('x');

    // Exchange authorization code for tokens
    const tokens = await connector.exchangeCode(code, codeVerifier);

    // Fetch the user's X profile
    const profile = await connector.fetchProfile(tokens.accessToken);

    // Store connected account using service client (bypasses RLS for upsert)
    const service = createServiceClient();
    const { error: dbError } = await service
      .from('connected_accounts')
      .upsert(
        {
          user_id: user.id,
          platform: 'x',
          platform_user_id: profile.platformUserId,
          platform_username: profile.username,
          platform_display_name: profile.displayName,
          platform_avatar_url: profile.avatarUrl,
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
          token_expires_at: tokens.expiresAt?.toISOString(),
          scopes: tokens.scopes,
          status: 'active',
          connected_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,platform,platform_user_id' },
      );

    if (dbError) {
      console.error('[oauth/x/callback] Failed to save connected account:', dbError);
      return NextResponse.redirect(`${appUrl}/start?error=save_failed`);
    }

    return NextResponse.redirect(`${appUrl}/start?connected=x&username=${profile.username}`);
  } catch (err) {
    console.error('[oauth/x/callback] Error:', err);
    const message = err instanceof Error ? err.message : 'unknown_error';
    return NextResponse.redirect(`${appUrl}/start?error=${encodeURIComponent(message)}`);
  }
}
