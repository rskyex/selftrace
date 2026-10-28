// ── Feature flags ─────────────────────────────────────────────────────────────
// NEXT_PUBLIC_ENABLE_SOCIAL_CONNECT (default: off) turns on connecting an X
// account. That path is not browser-only: it stores OAuth tokens, imported post
// text and raw post JSON in Supabase and runs the analysis on the server. With
// the flag off the connect option is hidden, the /api/oauth and /api/social
// routes return 404, and every privacy statement describes the browser-only
// demo build. With it on, the copy says what is stored.

export const SOCIAL_CONNECT_ENABLED = process.env.NEXT_PUBLIC_ENABLE_SOCIAL_CONNECT === 'true';

/** Response for the social-connect API routes when the flag is off. */
export function socialConnectDisabledResponse(): Response {
  return Response.json({ error: 'Social account connection is not enabled in this deployment.' }, { status: 404 });
}
