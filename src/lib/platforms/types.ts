// ── Platform Connector Interface ─────────────────────────────────────────────
// Each social platform implements this interface.
// Platform-specific code is isolated in its own module.

export type PlatformId = 'x' | 'youtube' | 'tiktok' | 'instagram';

export interface PlatformProfile {
  platformUserId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  followerCount: number | null;
}

export interface RawPost {
  platformPostId: string;
  createdAt: string;
  contentText: string | null;
  mediaType: 'text' | 'image' | 'video' | 'link' | 'mixed';
  hashtags: string[];
  mentions: string[];
  isRepost: boolean;
  likes: number | null;
  shares: number | null;
  replies: number | null;
  views: number | null;
  rawJson: Record<string, unknown>;
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
  scopes: string[];
}

export interface PlatformConnector {
  platformId: PlatformId;
  getAuthUrl(state: string, codeVerifier: string): string;
  exchangeCode(code: string, codeVerifier: string): Promise<OAuthTokens>;
  refreshAccessToken(refreshToken: string): Promise<OAuthTokens>;
  fetchProfile(accessToken: string): Promise<PlatformProfile>;
  fetchRecentPosts(accessToken: string, maxCount?: number): Promise<RawPost[]>;
}
