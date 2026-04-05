import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isSupabaseConfigured, createServerSupabase } from '@/lib/supabase/server';
import { getConnector } from '@/lib/platforms/registry';
import { isXOAuthConfigured, getAppUrl } from '@/lib/platforms/env';
import crypto from 'crypto';

export async function GET() {
  const appUrl = getAppUrl();

  // Guard: check that OAuth infrastructure is configured
  if (!isSupabaseConfigured()) {
    console.error('[oauth/x] Supabase is not configured. Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    return NextResponse.redirect(`${appUrl}/start?error=${encodeURIComponent('oauth_not_configured')}`);
  }

  if (!isXOAuthConfigured()) {
    console.error('[oauth/x] X OAuth is not configured. Missing X_CLIENT_ID, X_CLIENT_SECRET, or NEXT_PUBLIC_APP_URL.');
    return NextResponse.redirect(`${appUrl}/start?error=${encodeURIComponent('oauth_not_configured')}`);
  }

  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(`${appUrl}/start?error=not_authenticated`);
    }

    const connector = getConnector('x');
    const state = crypto.randomBytes(32).toString('hex');
    const codeVerifier = crypto.randomBytes(32).toString('base64url');

    // Store state and verifier in cookies for callback validation
    const cookieStore = await cookies();
    cookieStore.set('x_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });
    cookieStore.set('x_code_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });

    const authUrl = connector.getAuthUrl(state, codeVerifier);
    return NextResponse.redirect(authUrl);
  } catch (err) {
    console.error('[oauth/x] Failed to initiate OAuth flow:', err);
    const message = err instanceof Error ? err.message : 'unknown_error';
    return NextResponse.redirect(`${appUrl}/start?error=${encodeURIComponent(message)}`);
  }
}
