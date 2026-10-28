// ── Topic taxonomy: IPTC Media Topics ────────────────────────────────────────
// Topics are concepts from the IPTC Media Topics NewsCodes vocabulary
// (https://cv.iptc.org/newscodes/mediatopic/, © IPTC, licensed CC BY 4.0;
// concept IDs and labels as published in the 2026-09-30 release). IPTC
// publishes the concepts, not keyword lists: the keywords below are
// SelfTrace's own, published here so every topic assignment can be audited.
//
// Matching: a keyword is a lower-case word, a word prefix ending in "*", or a
// multi-word phrase. A post is assigned every concept with at least one
// matching keyword; posts with no match are "unclassified". Posts carry the
// IPTC label as the topic; topicId() gives the qcode.

export interface TaxonomyConcept {
  /** IPTC qcode, e.g. "medtop:20001298" */
  id: string;
  /** IPTC preferred label (en-GB) */
  label: string;
  keywords: string[];
}

export const TAXONOMY_SOURCE = {
  name: 'IPTC Media Topics',
  url: 'https://cv.iptc.org/newscodes/mediatopic/',
  licence: 'CC BY 4.0',
  release: '2026-09-30',
};

export const UNCLASSIFIED = 'unclassified';

export const TAXONOMY: TaxonomyConcept[] = [
  { id: 'medtop:20001298', label: 'artificial intelligence', keywords: ['ai', 'artificial intelligence', 'algorithm*', 'machine learning', 'alignment', 'automated', 'model', 'models', 'optimization target'] },
  { id: 'medtop:20001182', label: 'social media', keywords: ['platform', 'platforms', 'feed', 'feeds', 'recommendation*', 'engagement', 'curation', 'content moderation', 'transparency report*', 'organic reach', 'reach', 'followers', 'attention market', 'attention economy', 'metrics', 'streaming', 'autoplay', 'post', 'posting'] },
  { id: 'medtop:20000636', label: 'regulation of industry', keywords: ['regulat*', 'ai act', 'design mandate*', 'utilities', 'monopol*', 'oversight', 'compliance'] },
  { id: 'medtop:20000621', label: 'government policy', keywords: ['policy', 'policies', 'governance', 'legislat*', 'committee', 'hearing', 'advisory', 'infrastructure bill', 'policy proposal*'] },
  { id: 'medtop:20001265', label: 'local government policy', keywords: ['council', 'zoning', 'school board', 'local government', 'officials', 'housing proposal'] },
  { id: 'medtop:20000574', label: 'election', keywords: ['election*', 'electoral', 'vote', 'voting', 'voter*', 'register', 'registered', 'registration', 'ballot*', 'phone bank'] },
  { id: 'medtop:11000000', label: 'politics and government', keywords: ['politic*', 'polariz*', 'democra*', 'institution*', 'nationalized', 'news cycle', 'rhetoric', 'organiz*', 'misinformation'] },
  { id: 'medtop:20000587', label: 'fundamental rights', keywords: ['rights', 'right to', 'civil rights', 'digital rights', 'voting access'] },
  { id: 'medtop:20000814', label: 'ethics', keywords: ['ethic*', 'bias', 'responsible', 'irresponsible', 'harms', 'accountability'] },
  { id: 'medtop:20000751', label: 'philosophy', keywords: ['philosoph*', 'arendt', 'dewey', 'pragmatism', 'labor, work, and action'] },
  { id: 'medtop:20000005', label: 'cinema', keywords: ['film', 'films', 'documentary', 'tarkovsky', 'stalker', 'rewatched', 'viewer'] },
  { id: 'medtop:20000013', label: 'literature', keywords: ['literature', 'novel', 'ferrante', 'self-narration'] },
  { id: 'medtop:20000306', label: 'books and publishing', keywords: ['book', 'books', 'kahneman', 'danielle allen', 'chapter'] },
  { id: 'medtop:20001253', label: 'cooking and baking', keywords: ['cook*', 'recipe', 'ragu', 'tomatoes', 'farmers market', 'tamale', 'vendor'] },
  { id: 'medtop:20000563', label: 'travel and tourism', keywords: ['travel*', 'berlin', 'lisbon', 'back from'] },
  { id: 'medtop:20000628', label: 'housing and urban planning policy', keywords: ['bike lane*', 'foot traffic', 'redevelopment', 'jane jacobs', 'preservation', 'neighborhood recommendation*'] },
  { id: 'medtop:20000036', label: 'photography', keywords: ['photograph*', 'morning light', 'shadows', 'sunset'] },
  { id: 'medtop:20000768', label: 'communities', keywords: ['community', 'neighborhood cleanup', 'turnout', 'volunteers', 'mural', 'community garden', 'community art'] },
  { id: 'medtop:20000441', label: 'nature', keywords: ['nature', 'crocus', 'spring', 'river'] },
  { id: 'medtop:20000192', label: 'business strategy and marketing', keywords: ['marketing', 'marketers', 'campaign', 'brand', 'brands', 'b2b', 'content strategy', 'audience', 'agency', 'case study', 'ad product', 'earnings call', 'measurement', 'the industry', 'thought leadership', 'personal brand', 'building in public', 'strategy'] },
  { id: 'medtop:20000509', label: 'employment', keywords: ['career', 'careers', 'advance fastest', 'career advice'] },
  { id: 'medtop:20000199', label: 'business governance', keywords: ['leadership', 'leading', 'leaders', 'teams', 'micromanagement', 'consensus'] },
  { id: 'medtop:20000565', label: 'lifestyle', keywords: ['quiet mornings', 'coffee', 'week off', 'weekend', 'family time', 'garden needs'] },
  { id: 'medtop:15000000', label: 'sport', keywords: ['run club', 'running', 'long run', 'marathon', 'half marathon', 'race', 'training run', 'miles'] },
];

const conceptByLabel = new Map(TAXONOMY.map(c => [c.label, c]));

/** IPTC qcode for a topic label (posts carry the label), or null for "unclassified". */
export function topicId(label: string): string | null {
  return conceptByLabel.get(label)?.id ?? null;
}

function normalise(text: string): string {
  return ` ${text.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9',\- ]+/g, ' ').replace(/\s+/g, ' ')} `;
}

function matches(norm: string, words: string[], keyword: string): boolean {
  if (keyword.includes(' ') || keyword.includes(',')) return norm.includes(` ${keyword} `) || norm.includes(` ${keyword},`);
  if (keyword.endsWith('*')) {
    const stem = keyword.slice(0, -1);
    return words.some(w => w.startsWith(stem));
  }
  return words.includes(keyword);
}

/** IPTC concept labels whose keywords appear in the text, most matched first. */
export function classifyTopics(text: string): { topic: string; confidence: number }[] {
  const norm = normalise(text);
  const words = norm.trim().split(' ').map(w => w.replace(/^[',\-]+|[',\-]+$/g, ''));
  const hits: { topic: string; n: number }[] = [];
  for (const c of TAXONOMY) {
    const n = c.keywords.filter(k => matches(norm, words, k)).length;
    if (n > 0) hits.push({ topic: c.label, n });
  }
  if (hits.length === 0) return [{ topic: UNCLASSIFIED, confidence: 0 }];
  hits.sort((a, b) => b.n - a.n);
  const total = hits.reduce((s, h) => s + h.n, 0);
  return hits.map(h => ({ topic: h.topic, confidence: Math.round((h.n / total) * 100) / 100 }));
}
