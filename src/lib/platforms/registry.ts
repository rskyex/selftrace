// ── Platform Registry ────────────────────────────────────────────────────────
// Central registry for all platform connectors.
// Add new platforms here as they are implemented.

import type { PlatformConnector, PlatformId } from './types';
import { xConnector } from './x';

const connectors: Partial<Record<PlatformId, PlatformConnector>> = {
  x: xConnector,
  // TODO: youtube — implement with Google OAuth + YouTube Data API v3
  // TODO: tiktok — implement with TikTok Login Kit + Content Posting API
  // TODO: instagram — implement with Instagram Basic Display API / Graph API
};

export function getConnector(platform: PlatformId): PlatformConnector {
  const connector = connectors[platform];
  if (!connector) {
    throw new Error(`Platform "${platform}" is not yet supported.`);
  }
  return connector;
}

export function getSupportedPlatforms(): PlatformId[] {
  return Object.keys(connectors) as PlatformId[];
}

export const platformMeta: Record<PlatformId, { label: string; description: string; available: boolean }> = {
  x: { label: 'X (Twitter)', description: 'Import your tweets and engagement data', available: true },
  youtube: { label: 'YouTube', description: 'Import your video titles, descriptions, and comments', available: false },
  tiktok: { label: 'TikTok', description: 'Import your video captions and engagement', available: false },
  instagram: { label: 'Instagram', description: 'Import your posts, captions, and stories', available: false },
};
