// ── Shared wording for topic statistics ──────────────────────────────────────
// Pages describe topics with these so the same numbers read the same way
// everywhere. Definitions live in ./definitions.ts.

import type { TopicEngagement } from '@/lib/data/types';

const pct = (share: number) => `${(share * 100).toFixed(1)}%`;

/** "1.49× typical engagement" — median of post engagement ÷ its month's median. */
export function rewardText(t: TopicEngagement): string {
  return `${t.rewardRatio.toFixed(2)}× typical engagement`;
}

/** "share 9.2% → 14.1%" across the two equal-time halves. */
export function shareText(t: TopicEngagement): string {
  return `share ${pct(t.earlyShare)} → ${pct(t.lateShare)}`;
}

/** "63 posts · 1.49× typical engagement · share 9.2% → 14.1%" */
export function topicLine(t: TopicEngagement): string {
  return `${t.postCount} posts · ${rewardText(t)} · ${shareText(t)}`;
}
