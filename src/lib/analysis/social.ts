// ── Social Post Analysis Pipeline ────────────────────────────────────────────
// Processes raw imported posts from Supabase and generates SelfTrace analysis.
// Reuses patterns from the existing pipeline.ts but works with the posts_raw
// table schema instead of the demo DatasetProfile format.

interface RawPostRow {
  id: string;
  platform: string;
  platform_post_id: string;
  created_at: string;
  content_text: string | null;
  media_type: string;
  hashtags: string[];
  mentions: string[];
  is_repost: boolean;
  likes: number | null;
  shares: number | null;
  replies: number | null;
  views: number | null;
}

export interface SocialAnalysisResult {
  postingFrequency: PostingFrequencyResult;
  repeatedPhrases: RepeatedPhraseResult[];
  topicClusters: TopicClusterResult[];
  selfDescriptionChanges: SelfDescriptionChangeResult;
  summary: AnalysisSummary;
}

export interface PostingFrequencyResult {
  monthly: { month: string; count: number }[];
  totalPosts: number;
  dateRange: { start: string; end: string };
  averagePerMonth: number;
  peakMonth: { month: string; count: number } | null;
}

export interface RepeatedPhraseResult {
  phrase: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  spread: 'concentrated' | 'distributed' | 'escalating';
}

export interface TopicClusterResult {
  topic: string;
  postCount: number;
  percentage: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  topWords: string[];
}

export interface SelfDescriptionChangeResult {
  early: SelfMarker[];
  late: SelfMarker[];
  shifts: string[];
}

interface SelfMarker {
  phrase: string;
  pattern: 'role_claim' | 'identity_statement' | 'expertise_signal' | 'vulnerability_disclosure';
  date: string;
}

export interface AnalysisSummary {
  totalPosts: number;
  platform: string;
  dateRange: { start: string; end: string };
  topTopics: string[];
  dominantTrend: string;
}

// ── Stop words for filtering ────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her',
  'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there',
  'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get',
  'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no',
  'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your',
  'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
  'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first',
  'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
  'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been', 'has',
  'had', 'did', 'am', 'were', 'being', 'im', 'ive', 'dont', 'isnt',
  'rt', 'http', 'https', 'amp', 'co', 'via',
]);

// ── Main Analysis Function ──────────────────────────────────────────────────

export function analyzeSocialPosts(posts: RawPostRow[], platform: string): SocialAnalysisResult {
  // Filter out reposts and posts without text
  const textPosts = posts.filter((p) => !p.is_repost && p.content_text && p.content_text.trim().length > 0);

  const postingFrequency = computePostingFrequency(textPosts);
  const repeatedPhrases = computeRepeatedPhrases(textPosts);
  const topicClusters = computeTopicClusters(textPosts);
  const selfDescriptionChanges = computeSelfDescriptionChanges(textPosts);

  const topTopics = topicClusters.slice(0, 5).map((c) => c.topic);
  const sorted = textPosts.slice().sort((a, b) => a.created_at.localeCompare(b.created_at));

  return {
    postingFrequency,
    repeatedPhrases,
    topicClusters,
    selfDescriptionChanges,
    summary: {
      totalPosts: textPosts.length,
      platform,
      dateRange: {
        start: sorted[0]?.created_at ?? '',
        end: sorted[sorted.length - 1]?.created_at ?? '',
      },
      topTopics,
      dominantTrend: deriveDominantTrend(topicClusters, postingFrequency),
    },
  };
}

// ── Posting Frequency ───────────────────────────────────────────────────────

function computePostingFrequency(posts: RawPostRow[]): PostingFrequencyResult {
  const monthly: Record<string, number> = {};

  for (const post of posts) {
    const d = new Date(post.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthly[key] = (monthly[key] || 0) + 1;
  }

  const entries = Object.entries(monthly).sort(([a], [b]) => a.localeCompare(b));
  const monthlyArr = entries.map(([month, count]) => ({ month, count }));

  const sorted = posts.slice().sort((a, b) => a.created_at.localeCompare(b.created_at));
  const total = posts.length;
  const avg = entries.length > 0 ? Math.round(total / entries.length) : 0;
  const peak = monthlyArr.reduce<{ month: string; count: number } | null>(
    (max, m) => (!max || m.count > max.count ? m : max),
    null,
  );

  return {
    monthly: monthlyArr,
    totalPosts: total,
    dateRange: {
      start: sorted[0]?.created_at ?? '',
      end: sorted[sorted.length - 1]?.created_at ?? '',
    },
    averagePerMonth: avg,
    peakMonth: peak,
  };
}

// ── Repeated Phrases ────────────────────────────────────────────────────────

function computeRepeatedPhrases(posts: RawPostRow[]): RepeatedPhraseResult[] {
  // Extract n-grams (2-4 words) and count occurrences
  const phraseCounts = new Map<string, { count: number; dates: string[] }>();

  for (const post of posts) {
    if (!post.content_text) continue;
    const words = tokenize(post.content_text);

    for (let n = 2; n <= 4; n++) {
      for (let i = 0; i <= words.length - n; i++) {
        const phrase = words.slice(i, i + n).join(' ');
        if (phrase.length < 6) continue;

        const entry = phraseCounts.get(phrase);
        if (entry) {
          entry.count++;
          entry.dates.push(post.created_at);
        } else {
          phraseCounts.set(phrase, { count: 1, dates: [post.created_at] });
        }
      }
    }
  }

  // Filter to phrases that occur 3+ times
  const results: RepeatedPhraseResult[] = [];
  for (const [phrase, { count, dates }] of phraseCounts) {
    if (count < 3) continue;

    const sortedDates = dates.sort();
    const firstSeen = sortedDates[0];
    const lastSeen = sortedDates[sortedDates.length - 1];

    // Determine temporal spread
    const totalDays = (new Date(lastSeen).getTime() - new Date(firstSeen).getTime()) / (1000 * 60 * 60 * 24);
    const midpoint = new Date(firstSeen).getTime() + totalDays * 0.5 * 24 * 60 * 60 * 1000;
    const earlyCount = dates.filter((d) => new Date(d).getTime() < midpoint).length;
    const lateCount = dates.filter((d) => new Date(d).getTime() >= midpoint).length;

    let spread: 'concentrated' | 'distributed' | 'escalating';
    if (totalDays < 30) {
      spread = 'concentrated';
    } else if (lateCount > earlyCount * 1.5) {
      spread = 'escalating';
    } else {
      spread = 'distributed';
    }

    results.push({ phrase, count, firstSeen, lastSeen, spread });
  }

  return results
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);
}

// ── Topic Clusters ──────────────────────────────────────────────────────────

function computeTopicClusters(posts: RawPostRow[]): TopicClusterResult[] {
  // Simple keyword-frequency based topic detection
  const wordFreq = new Map<string, { count: number; posts: string[] }>();

  for (const post of posts) {
    if (!post.content_text) continue;
    const words = tokenize(post.content_text);
    const unique = new Set(words);

    for (const word of unique) {
      if (word.length < 4 || STOP_WORDS.has(word)) continue;
      const entry = wordFreq.get(word);
      if (entry) {
        entry.count++;
        entry.posts.push(post.created_at);
      } else {
        wordFreq.set(word, { count: 1, posts: [post.created_at] });
      }
    }
  }

  // Group into clusters by co-occurrence
  const topWords = Array.from(wordFreq.entries())
    .filter(([, v]) => v.count >= 3)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 50);

  // Simple clustering: group by top words, merge overlapping
  const clusters: TopicClusterResult[] = [];
  const used = new Set<string>();

  for (const [word, data] of topWords) {
    if (used.has(word)) continue;
    used.add(word);

    // Find related words (appear in many of the same posts)
    const relatedWords = [word];
    for (const [other, otherData] of topWords) {
      if (used.has(other)) continue;
      const overlap = data.posts.filter((d) =>
        otherData.posts.includes(d)
      ).length;
      if (overlap > Math.min(data.count, otherData.count) * 0.3) {
        relatedWords.push(other);
        used.add(other);
        if (relatedWords.length >= 5) break;
      }
    }

    // Compute trend
    const sortedDates = data.posts.sort();
    const midIdx = Math.floor(sortedDates.length / 2);
    const earlyHalf = sortedDates.slice(0, midIdx);
    const lateHalf = sortedDates.slice(midIdx);

    let trend: 'increasing' | 'stable' | 'decreasing';
    if (lateHalf.length > earlyHalf.length * 1.3) {
      trend = 'increasing';
    } else if (earlyHalf.length > lateHalf.length * 1.3) {
      trend = 'decreasing';
    } else {
      trend = 'stable';
    }

    clusters.push({
      topic: word,
      postCount: data.count,
      percentage: Math.round((data.count / posts.length) * 100),
      trend,
      topWords: relatedWords,
    });
  }

  return clusters
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, 15);
}

// ── Self-Description Changes ────────────────────────────────────────────────

const SELF_PATTERNS: { regex: RegExp; pattern: SelfMarker['pattern'] }[] = [
  { regex: /\bi(?:'m| am) (?:a |an |the )?(\w[\w\s]{2,20})/gi, pattern: 'role_claim' },
  { regex: /\bas (?:a |an )?(\w[\w\s]{2,20})/gi, pattern: 'role_claim' },
  { regex: /\bmy (?:work|role|job|career|expertise|experience|passion)\b/gi, pattern: 'expertise_signal' },
  { regex: /\bi believe\b|\bi think\b|\bi feel\b/gi, pattern: 'identity_statement' },
  { regex: /\bi(?:'ve| have) (?:always|never|learned|realized|struggled|overcome)/gi, pattern: 'vulnerability_disclosure' },
];

function computeSelfDescriptionChanges(posts: RawPostRow[]): SelfDescriptionChangeResult {
  const sorted = posts.slice().sort((a, b) => a.created_at.localeCompare(b.created_at));
  const midIdx = Math.floor(sorted.length / 2);
  const earlyPosts = sorted.slice(0, midIdx);
  const latePosts = sorted.slice(midIdx);

  const extractMarkers = (subset: RawPostRow[]): SelfMarker[] => {
    const markers: SelfMarker[] = [];
    for (const post of subset) {
      if (!post.content_text) continue;
      for (const { regex, pattern } of SELF_PATTERNS) {
        regex.lastIndex = 0;
        const match = regex.exec(post.content_text);
        if (match) {
          markers.push({
            phrase: match[0].trim(),
            pattern,
            date: post.created_at,
          });
        }
      }
    }
    return markers;
  };

  const early = extractMarkers(earlyPosts).slice(0, 20);
  const late = extractMarkers(latePosts).slice(0, 20);

  // Detect shifts
  const shifts: string[] = [];
  const earlyPatterns = countBy(early, (m) => m.pattern);
  const latePatterns = countBy(late, (m) => m.pattern);

  for (const pattern of ['role_claim', 'expertise_signal', 'identity_statement', 'vulnerability_disclosure'] as const) {
    const eCount = earlyPatterns[pattern] ?? 0;
    const lCount = latePatterns[pattern] ?? 0;
    if (lCount > eCount * 1.5 && lCount >= 2) {
      shifts.push(`Increase in ${pattern.replace(/_/g, ' ')} over time`);
    } else if (eCount > lCount * 1.5 && eCount >= 2) {
      shifts.push(`Decrease in ${pattern.replace(/_/g, ' ')} over time`);
    }
  }

  return { early, late, shifts };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[^a-z0-9'\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function countBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of arr) {
    const key = keyFn(item);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function deriveDominantTrend(clusters: TopicClusterResult[], freq: PostingFrequencyResult): string {
  const increasing = clusters.filter((c) => c.trend === 'increasing').length;
  const decreasing = clusters.filter((c) => c.trend === 'decreasing').length;

  if (increasing > decreasing * 2) return 'Your topics are diversifying over time.';
  if (decreasing > increasing * 2) return 'Your content is narrowing to fewer topics.';

  const monthlyArr = freq.monthly;
  if (monthlyArr.length >= 4) {
    const early = monthlyArr.slice(0, 2).reduce((s, m) => s + m.count, 0) / 2;
    const late = monthlyArr.slice(-2).reduce((s, m) => s + m.count, 0) / 2;
    if (late > early * 1.5) return 'Your posting frequency is increasing.';
    if (early > late * 1.5) return 'Your posting frequency has declined.';
  }

  return 'Your posting patterns appear relatively stable.';
}
