// ── Platform Environment Validation ─────────────────────────────────────────
// Checks whether OAuth credentials and supporting infra are configured.

/** Whether X (Twitter) OAuth credentials are present */
export function isXOAuthConfigured(): boolean {
  return !!(
    process.env.X_CLIENT_ID &&
    process.env.X_CLIENT_SECRET &&
    process.env.NEXT_PUBLIC_APP_URL
  );
}

/** Whether the full connection pipeline is available (Supabase + at least one platform) */
export function isConnectionAvailable(): boolean {
  const hasSupabase = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co'
  );

  return hasSupabase && isXOAuthConfigured();
}

/** Get the resolved app URL for redirects */
export function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url) {
    // Fallback for Vercel deployments
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    return 'http://localhost:3000';
  }
  return url;
}
