// ── X (Twitter) Platform Connector ──────────────────────────────────────────
// Uses OAuth 2.0 with PKCE as per X API v2 documentation.
// Requires X_CLIENT_ID and X_CLIENT_SECRET environment variables.

import type { PlatformConnector, OAuthTokens, PlatformProfile, RawPost } from './types';
import { getAppUrl } from './env';

const X_AUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const X_TOKEN_URL = 'https://api.twitter.com/2/oauth2/token';
const X_API_BASE = 'https://api.twitter.com/2';

const SCOPES = ['tweet.read', 'users.read', 'offline.access'];

function getCallbackUrl(): string {
  return `${getAppUrl()}/api/oauth/x/callback`;
}

export const xConnector: PlatformConnector = {
  platformId: 'x',

  getAuthUrl(state: string, codeVerifier: string): string {
    // Generate code challenge from verifier (S256)
    const crypto = require('crypto');
    const codeChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.X_CLIENT_ID!,
      redirect_uri: getCallbackUrl(),
      scope: SCOPES.join(' '),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return `${X_AUTH_URL}?${params.toString()}`;
  },

  async exchangeCode(code: string, codeVerifier: string): Promise<OAuthTokens> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: getCallbackUrl(),
      code_verifier: codeVerifier,
      client_id: process.env.X_CLIENT_ID!,
    });

    const credentials = Buffer.from(
      `${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`
    ).toString('base64');

    const res = await fetch(X_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`X token exchange failed: ${res.status} ${error}`);
    }

    const data = await res.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? null,
      expiresAt: data.expires_in
        ? new Date(Date.now() + data.expires_in * 1000)
        : null,
      scopes: (data.scope ?? '').split(' '),
    };
  },

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.X_CLIENT_ID!,
    });

    const credentials = Buffer.from(
      `${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`
    ).toString('base64');

    const res = await fetch(X_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`X token refresh failed: ${res.status} ${error}`);
    }

    const data = await res.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? refreshToken,
      expiresAt: data.expires_in
        ? new Date(Date.now() + data.expires_in * 1000)
        : null,
      scopes: (data.scope ?? '').split(' '),
    };
  },

  async fetchProfile(accessToken: string): Promise<PlatformProfile> {
    const res = await fetch(`${X_API_BASE}/users/me?user.fields=profile_image_url,description,public_metrics`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.status === 401) {
      throw new Error('EXPIRED_TOKEN');
    }
    if (!res.ok) {
      throw new Error(`X profile fetch failed: ${res.status}`);
    }

    const { data } = await res.json();

    return {
      platformUserId: data.id,
      username: data.username,
      displayName: data.name,
      avatarUrl: data.profile_image_url ?? null,
      bio: data.description ?? null,
      followerCount: data.public_metrics?.followers_count ?? null,
    };
  },

  async fetchRecentPosts(accessToken: string, maxCount = 100): Promise<RawPost[]> {
    const posts: RawPost[] = [];
    let paginationToken: string | undefined;

    // X API v2 allows max 100 per request, paginate up to maxCount
    while (posts.length < maxCount) {
      const remaining = Math.min(100, maxCount - posts.length);
      const params = new URLSearchParams({
        max_results: String(remaining),
        'tweet.fields': 'created_at,public_metrics,entities,referenced_tweets',
        expansions: 'referenced_tweets.id',
      });
      if (paginationToken) {
        params.set('pagination_token', paginationToken);
      }

      const res = await fetch(
        `${X_API_BASE}/users/me/tweets?${params.toString()}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (res.status === 401) {
        throw new Error('EXPIRED_TOKEN');
      }
      if (res.status === 429) {
        // Rate limited — return what we have so far
        break;
      }
      if (!res.ok) {
        throw new Error(`X posts fetch failed: ${res.status}`);
      }

      const body = await res.json();

      if (!body.data || body.data.length === 0) {
        break;
      }

      for (const tweet of body.data) {
        const isRepost = tweet.referenced_tweets?.some(
          (r: { type: string }) => r.type === 'retweeted'
        ) ?? false;

        const hashtags = tweet.entities?.hashtags?.map((h: { tag: string }) => h.tag) ?? [];
        const mentions = tweet.entities?.mentions?.map((m: { username: string }) => m.username) ?? [];
        const metrics = tweet.public_metrics ?? {};

        posts.push({
          platformPostId: tweet.id,
          createdAt: tweet.created_at,
          contentText: tweet.text ?? null,
          mediaType: 'text',
          hashtags,
          mentions,
          isRepost,
          likes: metrics.like_count ?? null,
          shares: metrics.retweet_count ?? null,
          replies: metrics.reply_count ?? null,
          views: metrics.impression_count ?? null,
          rawJson: tweet,
        });
      }

      paginationToken = body.meta?.next_token;
      if (!paginationToken) break;
    }

    return posts;
  },
};
