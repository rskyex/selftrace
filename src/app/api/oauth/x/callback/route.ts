import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerSupabase } from '@/lib/supabase/server';
import { getConnector } from '@/lib/platforms/registry';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  // Handle denial or errors from X
  if (error) {
    return NextResponse.redirect(`${appUrl}/connect?error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${appUrl}/connect?error=missing_params`);
  }

  // Validate state
  const cookieStore = await cookies();
  const savedState = cookieStore.get('x_oauth_state')?.value;
  const codeVerifier = cookieStore.get('x_code_verifier')?.value;

  if (!savedState || state !== savedState || !codeVerifier) {
    return NextResponse.redirect(`${appUrl}/connect?error=invalid_state`);
  }

  // Clear OAuth cookies
  cookieStore.delete('x_oauth_state');
  cookieStore.delete('x_code_verifier');

  // Verify authenticated user
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${appUrl}/connect?error=not_authenticated`);
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
      console.error('Failed to save connected account:', dbError);
      return NextResponse.redirect(`${appUrl}/connect?error=save_failed`);
    }

    return NextResponse.redirect(`${appUrl}/connect?connected=x&username=${profile.username}`);
  } catch (err) {
    console.error('X OAuth callback error:', err);
    const message = err instanceof Error ? err.message : 'unknown_error';
    return NextResponse.redirect(`${appUrl}/connect?error=${encodeURIComponent(message)}`);
  }
}
