// ── Analysis Pipeline ─────────────────────────────────────────────────────────
// Pure functions that transform a DatasetProfile into AnalysisResult.
// All outputs are wrapped in FramedInsight<T> with epistemic labels.
// Runs entirely in the browser. No server calls.

import type {
  DatasetProfile,
  Post,
  AnalysisResult,
  FramedTimeSeries,
  FramedInsight,
  TimeSeriesPoint,
  TopicOverTime,
  DriftingTerm,
  RecurringPhrase,
  TopicEngagement,
  SelfDescriptionMarker,
  MemoryEvent,
  CivicQuestion,
  PeriodComparison,
} from '@/lib/data/types';

// ── Posting Frequency ────────────────────────────────────────────────────────

function computePostingFrequency(posts: Post[]): FramedTimeSeries {
  const monthly: Record<string, number> = {};

  for (const post of posts) {
    const d = new Date(post.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
    monthly[key] = (monthly[key] || 0) + 1;
  }

  const series: TimeSeriesPoint[] = Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));

  return {
    value: series,
    status: 'observed',
    evidence: `Direct count of ${posts.length} posts across ${series.length} months.`,
    caveat: 'Posting frequency reflects only content present in the dataset. Deleted or private posts are not included.',
    method: 'Monthly post count aggregation.',
    xLabel: 'Month',
    yLabel: 'Posts',
  };
}

// ── Topic Distribution Over Time ─────────────────────────────────────────────

function computeTopicDistribution(posts: Post[]): FramedInsight<TopicOverTime[]> {
  const topicsByMonth: Record<string, Record<string, number>> = {};

  for (const post of posts) {
    if (!post.derived) continue;
    const d = new Date(post.createdAt);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;

    for (const ta of post.derived.topics) {
      if (!topicsByMonth[monthKey]) topicsByMonth[monthKey] = {};
      topicsByMonth[monthKey][ta.topic] = (topicsByMonth[monthKey][ta.topic] || 0) + 1;
    }
  }

  const allTopics = new Set<string>();
  for (const month of Object.values(topicsByMonth)) {
    for (const topic of Object.keys(month)) {
      allTopics.add(topic);
    }
  }

  const months = Object.keys(topicsByMonth).sort();
  const result: TopicOverTime[] = Array.from(allTopics).map(topic => ({
    topic,
    series: months.map(date => ({
      date,
      value: topicsByMonth[date]?.[topic] || 0,
    })),
  }));

  // Sort by total volume descending
  result.sort((a, b) => {
    const sumA = a.series.reduce((s, p) => s + p.value, 0);
    const sumB = b.series.reduce((s, p) => s + p.value, 0);
    return sumB - sumA;
  });

  return {
    value: result.slice(0, 8), // Top 8 topics
    status: 'inferred',
    evidence: `Topic assignments based on keyword matching across ${posts.length} posts.`,
    caveat: 'Topics are assigned through keyword heuristics, which may miscategorize posts with ambiguous content. A post may address multiple topics.',
    method: 'Keyword-based topic classification, aggregated monthly.',
  };
}

// ── Topic Entropy ────────────────────────────────────────────────────────────

function computeTopicEntropy(posts: Post[]): FramedTimeSeries {
  const postsByQuarter: Record<string, Post[]> = {};

  for (const post of posts) {
    const d = new Date(post.createdAt);
    const q = Math.floor(d.getMonth() / 3) + 1;
    const key = `${d.getFullYear()}-${String(q * 3 - 2).padStart(2, '0')}-01`;
    if (!postsByQuarter[key]) postsByQuarter[key] = [];
    postsByQuarter[key].push(post);
  }

  const series: TimeSeriesPoint[] = Object.entries(postsByQuarter)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, quarterPosts]) => {
      const topicCounts: Record<string, number> = {};
      let total = 0;
      for (const p of quarterPosts) {
        if (!p.derived) continue;
        for (const ta of p.derived.topics) {
          topicCounts[ta.topic] = (topicCounts[ta.topic] || 0) + 1;
          total++;
        }
      }

      if (total === 0) return { date, value: 0 };

      let entropy = 0;
      for (const count of Object.values(topicCounts)) {
        const p = count / total;
        if (p > 0) entropy -= p * Math.log2(p);
      }

      return { date, value: Math.round(entropy * 100) / 100 };
    });

  return {
    value: series,
    status: 'inferred',
    evidence: 'Shannon entropy of topic distribution per quarter.',
    caveat: 'Declining entropy may reflect deepening expertise, intentional focus, life circumstances, or platform reinforcement. This tool does not determine which.',
    method: 'Shannon entropy (H = -Σ p·log₂(p)) of quarterly topic proportions.',
    xLabel: 'Quarter',
    yLabel: 'Topic Entropy (bits)',
  };
}

// ── Vocabulary Drift ─────────────────────────────────────────────────────────

function computeVocabularyDrift(posts: Post[]): FramedInsight<DriftingTerm[]> {
  const midpoint = Math.floor(posts.length / 2);
  const earlyPosts = posts.slice(0, midpoint);
  const latePosts = posts.slice(midpoint);

  const countTerms = (subset: Post[]): Record<string, number> => {
    const counts: Record<string, number> = {};
    for (const p of subset) {
      if (!p.derived) continue;
      for (const term of p.derived.vocabularyFingerprint) {
        counts[term] = (counts[term] || 0) + 1;
      }
    }
    return counts;
  };

  const earlyCounts = countTerms(earlyPosts);
  const lateCounts = countTerms(latePosts);

  const allTerms = new Set([...Object.keys(earlyCounts), ...Object.keys(lateCounts)]);
  const drifting: DriftingTerm[] = [];

  for (const term of allTerms) {
    const earlyFreq = ((earlyCounts[term] || 0) / earlyPosts.length) * 100;
    const lateFreq = ((lateCounts[term] || 0) / latePosts.length) * 100;
    const diff = lateFreq - earlyFreq;

    if (Math.abs(diff) < 0.5) continue; // Filter noise

    drifting.push({
      term,
      direction: diff > 1 ? 'emerging' : diff < -1 ? 'fading' : 'stable',
      earlierFrequency: Math.round(earlyFreq * 10) / 10,
      laterFrequency: Math.round(lateFreq * 10) / 10,
    });
  }

  drifting.sort((a, b) => Math.abs(b.laterFrequency - b.earlierFrequency) - Math.abs(a.laterFrequency - a.earlierFrequency));

  return {
    value: drifting.slice(0, 12),
    status: 'inferred',
    evidence: `Vocabulary frequency comparison between first ${earlyPosts.length} and last ${latePosts.length} posts.`,
    caveat: 'Vocabulary change may reflect evolving interests, audience adaptation, platform trends, or many other factors. Frequency differences do not indicate causation.',
    method: 'Term frequency per 100 posts, compared between first and second halves of the dataset.',
  };
}

// ── Tone Trends ──────────────────────────────────────────────────────────────

function computeToneTrends(posts: Post[]): FramedInsight<{
  assertiveness: TimeSeriesPoint[];
  emotionality: TimeSeriesPoint[];
  formality: TimeSeriesPoint[];
  urgency: TimeSeriesPoint[];
}> {
  const byQuarter: Record<string, { a: number[]; e: number[]; f: number[]; u: number[] }> = {};

  for (const post of posts) {
    if (!post.derived) continue;
    const d = new Date(post.createdAt);
    const q = Math.floor(d.getMonth() / 3) + 1;
    const key = `${d.getFullYear()}-${String(q * 3 - 2).padStart(2, '0')}-01`;
    if (!byQuarter[key]) byQuarter[key] = { a: [], e: [], f: [], u: [] };
    byQuarter[key].a.push(post.derived.tone.assertiveness);
    byQuarter[key].e.push(post.derived.tone.emotionality);
    byQuarter[key].f.push(post.derived.tone.formality);
    byQuarter[key].u.push(post.derived.tone.urgency);
  }

  const avg = (arr: number[]) => arr.length ? Math.round((arr.reduce((s, v) => s + v, 0) / arr.length) * 100) / 100 : 0;

  const quarters = Object.keys(byQuarter).sort();
  return {
    value: {
      assertiveness: quarters.map(date => ({ date, value: avg(byQuarter[date].a) })),
      emotionality: quarters.map(date => ({ date, value: avg(byQuarter[date].e) })),
      formality: quarters.map(date => ({ date, value: avg(byQuarter[date].f) })),
      urgency: quarters.map(date => ({ date, value: avg(byQuarter[date].u) })),
    },
    status: 'inferred',
    evidence: 'Tone markers averaged per quarter based on linguistic heuristics.',
    caveat: 'Tone is estimated through linguistic proxies (exclamation density, hedge words, intensifiers) which are approximate and culturally dependent. Changes in tone may reflect life circumstances, not platform dynamics.',
    method: 'Heuristic tone scoring averaged per calendar quarter.',
  };
}

// ── Narrative Repetition ─────────────────────────────────────────────────────

function computeNarrativeRepetition(posts: Post[]): FramedInsight<RecurringPhrase[]> {
  const phraseCounts: Record<string, { count: number; first: string; last: string; dates: string[] }> = {};

  // Extract 3-5 word phrases
  for (const post of posts) {
    const words = post.content.text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    for (let len = 3; len <= 5; len++) {
      for (let i = 0; i <= words.length - len; i++) {
        const phrase = words.slice(i, i + len).join(' ');
        // Skip very common phrases
        if (phrase.includes('the') && phrase.split(' ').filter(w => ['the', 'a', 'an', 'is', 'of', 'in', 'to', 'and', 'for', 'that', 'it'].includes(w)).length >= 2) continue;

        if (!phraseCounts[phrase]) {
          phraseCounts[phrase] = { count: 0, first: post.createdAt, last: post.createdAt, dates: [] };
        }
        phraseCounts[phrase].count++;
        phraseCounts[phrase].last = post.createdAt;
        phraseCounts[phrase].dates.push(post.createdAt);
      }
    }
  }

  const recurring: RecurringPhrase[] = Object.entries(phraseCounts)
    .filter(([, data]) => data.count >= 3)
    .map(([phrase, data]) => {
      const firstDate = new Date(data.first).getTime();
      const lastDate = new Date(data.last).getTime();
      const midDate = (firstDate + lastDate) / 2;
      const datesInSecondHalf = data.dates.filter(d => new Date(d).getTime() > midDate).length;
      const ratio = datesInSecondHalf / data.count;

      return {
        phrase,
        occurrences: data.count,
        firstAppearance: data.first,
        lastAppearance: data.last,
        temporalSpread: ratio > 0.65 ? 'escalating' as const : ratio < 0.35 ? 'concentrated' as const : 'distributed' as const,
      };
    })
    .sort((a, b) => b.occurrences - a.occurrences)
    .slice(0, 15);

  return {
    value: recurring,
    status: 'observed',
    evidence: `Phrase recurrence detected across ${posts.length} posts.`,
    caveat: 'Phrase repetition is normal in sustained writing. It may reflect a developing voice, professional vocabulary, deliberate emphasis, or habitual expression — not only platform reinforcement.',
    method: 'N-gram extraction (3-5 words), filtered for minimum 3 occurrences.',
  };
}

// ── Self-Description Shift ───────────────────────────────────────────────────

function computeSelfDescriptionShift(posts: Post[]): FramedInsight<{
  early: SelfDescriptionMarker[];
  late: SelfDescriptionMarker[];
}> {
  const midpoint = Math.floor(posts.length / 2);
  const earlyDescs: SelfDescriptionMarker[] = [];
  const lateDescs: SelfDescriptionMarker[] = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    if (!post.derived) continue;
    const target = i < midpoint ? earlyDescs : lateDescs;
    target.push(...post.derived.selfDescriptions);
  }

  return {
    value: { early: earlyDescs, late: lateDescs },
    status: 'observed',
    evidence: `Self-description markers extracted from ${posts.length} posts.`,
    caveat: 'Self-descriptions are identified through pattern matching ("as a...", "I am a...") which may miss non-standard forms or misidentify rhetorical uses.',
    method: 'Regex-based extraction of role claims, identity statements, and expertise signals.',
  };
}

// ── Engagement Sensitivity ───────────────────────────────────────────────────

function computeEngagementSensitivity(posts: Post[]): FramedInsight<TopicEngagement[]> | null {
  const hasEngagement = posts.some(p => p.engagement?.likes != null);
  if (!hasEngagement) return null;

  const topicStats: Record<string, { totalEngagement: number; count: number; earlyCount: number; lateCount: number }> = {};
  const midpoint = Math.floor(posts.length / 2);

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    if (!post.derived || !post.engagement) continue;

    for (const ta of post.derived.topics) {
      if (!topicStats[ta.topic]) {
        topicStats[ta.topic] = { totalEngagement: 0, count: 0, earlyCount: 0, lateCount: 0 };
      }
      topicStats[ta.topic].totalEngagement += (post.engagement.likes ?? 0) + (post.engagement.shares ?? 0) * 2;
      topicStats[ta.topic].count++;
      if (i < midpoint) topicStats[ta.topic].earlyCount++;
      else topicStats[ta.topic].lateCount++;
    }
  }

  const result: TopicEngagement[] = Object.entries(topicStats)
    .filter(([, stats]) => stats.count >= 3)
    .map(([topic, stats]) => {
      const earlyRate = stats.earlyCount / midpoint;
      const lateRate = stats.lateCount / (posts.length - midpoint);
      const trend = lateRate > earlyRate * 1.3 ? 'increasing' as const :
                    lateRate < earlyRate * 0.7 ? 'decreasing' as const : 'stable' as const;

      return {
        topic,
        averageEngagement: Math.round(stats.totalEngagement / stats.count),
        postCount: stats.count,
        frequencyTrend: trend,
      };
    })
    .sort((a, b) => b.averageEngagement - a.averageEngagement);

  return {
    value: result,
    status: 'inferred',
    evidence: `Engagement metrics correlated with topic assignments across ${posts.length} posts.`,
    caveat: 'Correlation between engagement and content patterns does not establish that engagement caused those patterns. Multiple explanations are possible, including shared external events, evolving interests, and deliberate strategy.',
    method: 'Average engagement (likes + 2×shares) per topic, compared between first and second halves of the dataset.',
  };
}

// ── Reinforcement Correlation ────────────────────────────────────────────────

function computeReinforcementCorrelation(posts: Post[]): FramedTimeSeries | null {
  const hasEngagement = posts.some(p => p.engagement?.likes != null);
  if (!hasEngagement) return null;

  // For each quarter, compute correlation between a topic's prior engagement
  // and its current posting frequency
  const byQuarter: Record<string, Post[]> = {};
  for (const post of posts) {
    const d = new Date(post.createdAt);
    const q = Math.floor(d.getMonth() / 3) + 1;
    const key = `${d.getFullYear()}-${String(q * 3 - 2).padStart(2, '0')}-01`;
    if (!byQuarter[key]) byQuarter[key] = [];
    byQuarter[key].push(post);
  }

  const quarters = Object.keys(byQuarter).sort();
  const series: TimeSeriesPoint[] = [];

  for (let i = 1; i < quarters.length; i++) {
    const prevPosts = byQuarter[quarters[i - 1]];
    const currPosts = byQuarter[quarters[i]];

    // Prior engagement per topic
    const priorEngagement: Record<string, number> = {};
    for (const p of prevPosts) {
      if (!p.derived || !p.engagement) continue;
      for (const ta of p.derived.topics) {
        if (!priorEngagement[ta.topic]) priorEngagement[ta.topic] = 0;
        priorEngagement[ta.topic] += (p.engagement.likes ?? 0);
      }
    }

    // Current frequency per topic
    const currentFreq: Record<string, number> = {};
    for (const p of currPosts) {
      if (!p.derived) continue;
      for (const ta of p.derived.topics) {
        currentFreq[ta.topic] = (currentFreq[ta.topic] || 0) + 1;
      }
    }

    // Compute simple correlation
    const topics = Object.keys(priorEngagement).filter(t => currentFreq[t] !== undefined);
    if (topics.length < 3) {
      series.push({ date: quarters[i], value: 0 });
      continue;
    }

    const engValues = topics.map(t => priorEngagement[t]);
    const freqValues = topics.map(t => currentFreq[t]);

    const correlation = pearsonCorrelation(engValues, freqValues);
    series.push({ date: quarters[i], value: Math.round(correlation * 100) / 100 });
  }

  return {
    value: series,
    status: 'speculative',
    evidence: 'Correlation between prior-quarter engagement and current-quarter posting frequency, per topic.',
    caveat: 'A positive correlation does not establish that engagement caused subsequent posting patterns. Shared interests, trending topics, and many other factors may produce the same correlation without any behavioral reinforcement.',
    method: 'Pearson correlation between topic-level engagement in quarter N and topic-level posting frequency in quarter N+1.',
    xLabel: 'Quarter',
    yLabel: 'Correlation (r)',
  };
}

function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n < 3) return 0;

  const meanX = x.reduce((s, v) => s + v, 0) / n;
  const meanY = y.reduce((s, v) => s + v, 0) / n;

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  const den = Math.sqrt(denX * denY);
  return den === 0 ? 0 : num / den;
}

// ── Memory & Recirculation ────────────────────────────────────────────────────

function extractSignificantPhrases(text: string): string[] {
  const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3);
  const phrases: string[] = [];
  for (let i = 0; i <= words.length - 4; i++) {
    phrases.push(words.slice(i, i + 4).join(' '));
  }
  return phrases;
}

function computeMemoryEvents(posts: Post[]): FramedInsight<MemoryEvent[]> {
  const events: MemoryEvent[] = [];
  const phraseIndex: Map<string, { postId: string; date: string }[]> = new Map();

  // Index all 4-word phrases by post
  for (const post of posts) {
    const phrases = extractSignificantPhrases(post.content.text);
    for (const phrase of phrases) {
      // Skip very common phrase fragments
      const commonWords = ['that', 'this', 'with', 'from', 'have', 'been', 'about', 'what', 'they', 'their', 'when', 'will'];
      const words = phrase.split(' ');
      if (words.filter(w => commonWords.includes(w)).length >= 2) continue;

      if (!phraseIndex.has(phrase)) phraseIndex.set(phrase, []);
      phraseIndex.get(phrase)!.push({ postId: post.id, date: post.createdAt });
    }
  }

  // Find phrases that appear in posts separated by at least 30 days
  const seen = new Set<string>();
  for (const [phrase, occurrences] of phraseIndex) {
    if (occurrences.length < 2) continue;

    for (let i = 0; i < occurrences.length - 1; i++) {
      for (let j = i + 1; j < occurrences.length; j++) {
        const earlier = occurrences[i];
        const later = occurrences[j];
        const daysBetween = Math.round(
          (new Date(later.date).getTime() - new Date(earlier.date).getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysBetween < 30) continue;

        const key = `${earlier.postId}-${later.postId}`;
        if (seen.has(key)) continue;
        seen.add(key);

        events.push({
          laterPostId: later.postId,
          laterDate: later.date,
          earlierPostId: earlier.postId,
          earlierDate: earlier.date,
          sharedPhrase: phrase,
          similarity: 1,
          daysBetween,
        });
      }
    }
  }

  // Sort by days between (largest gaps first — most interesting)
  events.sort((a, b) => b.daysBetween - a.daysBetween);

  return {
    value: events.slice(0, 30),
    status: 'inferred',
    evidence: `Detected ${events.length} instances of 4-word phrase recurrence across posts separated by 30+ days.`,
    caveat: 'Phrase recurrence does not indicate that the user consciously revisited past content. Repeated phrasing may reflect habitual language, professional vocabulary, or coincidence. This tool cannot determine whether recirculation was prompted by a platform "memory" feature or arose independently.',
    method: '4-gram extraction with minimum 30-day temporal gap. Common-phrase filtering applied.',
  };
}

// ── Civic Questions ──────────────────────────────────────────────────────────

function computeCivicQuestions(posts: Post[], analysis: {
  topicEntropy: FramedTimeSeries;
  engagementSensitivity: FramedInsight<TopicEngagement[]> | null;
  toneTrends: FramedInsight<{ assertiveness: TimeSeriesPoint[]; emotionality: TimeSeriesPoint[] }>;
  selfDescriptionShift: FramedInsight<{ early: SelfDescriptionMarker[]; late: SelfDescriptionMarker[] }>;
}): FramedInsight<CivicQuestion[]> {
  const questions: CivicQuestion[] = [];

  // Question 1: Topic narrowing → discourse diversity
  const entropy = analysis.topicEntropy.value;
  if (entropy.length >= 2) {
    const firstQ = entropy[0].value;
    const lastQ = entropy[entropy.length - 1].value;
    const declined = lastQ < firstQ * 0.7;

    questions.push({
      question: 'If platforms reward legible identities, does public discourse lose access to ambiguity?',
      context: 'Democratic deliberation often requires people to hold uncertainty, change positions, and resist categorization. If platform incentives favor consistent, recognizable self-presentation, the space for productive ambiguity may narrow.',
      dataConnection: declined
        ? `In this dataset, topic diversity declined from ${firstQ.toFixed(2)} to ${lastQ.toFixed(2)} bits over the observed period — a pattern consistent with narrowing focus, though not proof of platform causation.`
        : `In this dataset, topic diversity remained relatively stable (${firstQ.toFixed(2)} → ${lastQ.toFixed(2)} bits), which may indicate resistance to narrowing pressures or simply a consistent range of interests.`,
      status: 'speculative',
    });
  }

  // Question 2: Engagement-topic correlation → discourse homogeneity
  if (analysis.engagementSensitivity) {
    const increasing = analysis.engagementSensitivity.value.filter(t => t.frequencyTrend === 'increasing');
    const highEngIncreasing = increasing.filter(t => t.averageEngagement > (analysis.engagementSensitivity!.value.reduce((s, t) => s + t.averageEngagement, 0) / analysis.engagementSensitivity!.value.length));

    questions.push({
      question: 'When engagement metrics shape what gets posted, who decides what public discourse looks like?',
      context: 'If engagement feedback loops influence topic selection at scale — across millions of users simultaneously — the aggregate effect may be a systematic narrowing of what is expressed publicly, toward what generates reaction.',
      dataConnection: highEngIncreasing.length > 0
        ? `${highEngIncreasing.length} topic(s) in this dataset show both above-average engagement and increasing posting frequency: ${highEngIncreasing.map(t => t.topic).join(', ')}. This pattern is consistent with engagement sensitivity, though many other explanations exist.`
        : null,
      status: 'speculative',
    });
  }

  // Question 3: Tone escalation → emotional climate of discourse
  const assertSeries = analysis.toneTrends.value.assertiveness;
  const emotSeries = analysis.toneTrends.value.emotionality;
  if (assertSeries.length >= 2 && emotSeries.length >= 2) {
    const assertRise = assertSeries[assertSeries.length - 1].value - assertSeries[0].value;
    const emotRise = emotSeries[emotSeries.length - 1].value - emotSeries[0].value;

    questions.push({
      question: 'If platforms amplify emotionally intense expression, what happens to the tone of public life?',
      context: 'Research suggests that content with higher emotional intensity tends to generate more engagement on most platforms. If this creates a feedback loop — rewarding intensity, which produces more of it — the cumulative effect on civic discourse may be an escalation of tone that no individual intends.',
      dataConnection: (assertRise > 0.1 || emotRise > 0.1)
        ? `In this dataset, assertiveness shifted by ${assertRise > 0 ? '+' : ''}${assertRise.toFixed(2)} and emotionality by ${emotRise > 0 ? '+' : ''}${emotRise.toFixed(2)} over the observed period. These are heuristic measures with significant limitations.`
        : `In this dataset, tone markers remained relatively stable, which may suggest resistance to escalation dynamics or may reflect the limitations of linguistic heuristics.`,
      status: 'speculative',
    });
  }

  // Question 4: Self-description crystallization → identity politics
  const earlyDescs = new Set(analysis.selfDescriptionShift.value.early.map(d => d.phrase));
  const lateDescs = new Set(analysis.selfDescriptionShift.value.late.map(d => d.phrase));

  questions.push({
    question: 'When self-presentation becomes more categorical, what forms of political identity are strengthened — and which are foreclosed?',
    context: 'Platforms that reward clear identity positioning may inadvertently favor political expression that is categorical and tribal over expression that is exploratory, conflicted, or cross-cutting. This is a question about structural conditions, not individual choices.',
    dataConnection: (lateDescs.size > 0 && earlyDescs.size > 0 && lateDescs.size < earlyDescs.size)
      ? `Self-description patterns in this dataset narrowed from ${earlyDescs.size} distinct phrases in the earlier period to ${lateDescs.size} in the later period — consistent with identity crystallization, though not proof of it.`
      : null,
    status: 'speculative',
  });

  // Question 5: Governance — always included
  questions.push({
    question: 'What would governance frameworks look like if they accounted for cumulative self-presentation effects?',
    context: 'Current platform regulation focuses on content moderation, data privacy, and algorithmic transparency. It rarely addresses the subtler question: what happens to self-expression when it occurs within an environment that structurally rewards certain patterns? This is the governance gap this tool attempts to make visible.',
    dataConnection: null,
    status: 'governance_commentary',
  });

  return {
    value: questions,
    status: 'speculative',
    evidence: 'Questions generated by connecting observed data patterns to structural governance concerns.',
    caveat: 'These are research questions, not conclusions. The data connections shown are illustrative, not probative. Each question has multiple valid answers, and the tool does not favor any particular one.',
    method: 'Pattern-to-question mapping: observed data trends are connected to pre-defined civic research questions where relevant.',
  };
}

// ── Period Comparison ────────────────────────────────────────────────────────

export function computePeriodComparison(
  posts: Post[],
  startA: string, endA: string,
  startB: string, endB: string,
): PeriodComparison {
  const inRange = (post: Post, start: string, end: string) => {
    const d = new Date(post.createdAt).getTime();
    return d >= new Date(start).getTime() && d <= new Date(end).getTime();
  };

  const postsA = posts.filter(p => inRange(p, startA, endA));
  const postsB = posts.filter(p => inRange(p, startB, endB));

  const monthsA = Math.max(1, Math.round((new Date(endA).getTime() - new Date(startA).getTime()) / (30.44 * 24 * 60 * 60 * 1000)));
  const monthsB = Math.max(1, Math.round((new Date(endB).getTime() - new Date(startB).getTime()) / (30.44 * 24 * 60 * 60 * 1000)));

  // Topic diversity (unique topics)
  const topicsA = new Set<string>();
  const topicsB = new Set<string>();
  const topicCountsA: Record<string, number> = {};
  const topicCountsB: Record<string, number> = {};

  for (const p of postsA) {
    if (!p.derived) continue;
    for (const t of p.derived.topics) {
      topicsA.add(t.topic);
      topicCountsA[t.topic] = (topicCountsA[t.topic] || 0) + 1;
    }
  }
  for (const p of postsB) {
    if (!p.derived) continue;
    for (const t of p.derived.topics) {
      topicsB.add(t.topic);
      topicCountsB[t.topic] = (topicCountsB[t.topic] || 0) + 1;
    }
  }

  const topTopicsA = Object.entries(topicCountsA).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t);
  const topTopicsB = Object.entries(topicCountsB).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t);

  // Tone averages
  const avgTone = (subset: Post[]) => {
    const sums = { assertiveness: 0, emotionality: 0, formality: 0, urgency: 0 };
    let count = 0;
    for (const p of subset) {
      if (!p.derived) continue;
      sums.assertiveness += p.derived.tone.assertiveness;
      sums.emotionality += p.derived.tone.emotionality;
      sums.formality += p.derived.tone.formality;
      sums.urgency += p.derived.tone.urgency;
      count++;
    }
    if (count === 0) return { assertiveness: 0, emotionality: 0, formality: 0, urgency: 0 };
    return {
      assertiveness: Math.round((sums.assertiveness / count) * 100) / 100,
      emotionality: Math.round((sums.emotionality / count) * 100) / 100,
      formality: Math.round((sums.formality / count) * 100) / 100,
      urgency: Math.round((sums.urgency / count) * 100) / 100,
    };
  };

  const labelA = `${new Date(startA).toLocaleDateString('en', { month: 'short', year: '2-digit' })} – ${new Date(endA).toLocaleDateString('en', { month: 'short', year: '2-digit' })}`;
  const labelB = `${new Date(startB).toLocaleDateString('en', { month: 'short', year: '2-digit' })} – ${new Date(endB).toLocaleDateString('en', { month: 'short', year: '2-digit' })}`;

  return {
    periodA: { label: labelA, start: startA, end: endA },
    periodB: { label: labelB, start: startB, end: endB },
    topicDiversity: {
      value: { a: topicsA.size, b: topicsB.size },
      status: 'observed',
      evidence: `Distinct topic count: ${topicsA.size} in period A (${postsA.length} posts), ${topicsB.size} in period B (${postsB.length} posts).`,
      caveat: 'Topic counts depend on the keyword taxonomy and may not capture all subjects discussed.',
      method: 'Count of unique topic assignments per period.',
    },
    postingFrequency: {
      value: { a: Math.round((postsA.length / monthsA) * 10) / 10, b: Math.round((postsB.length / monthsB) * 10) / 10 },
      status: 'observed',
      evidence: `${postsA.length} posts over ~${monthsA} months vs. ${postsB.length} posts over ~${monthsB} months.`,
      caveat: 'Frequency reflects only posts present in the dataset.',
      method: 'Posts per month in each period.',
    },
    topTopics: {
      value: { a: topTopicsA, b: topTopicsB },
      status: 'inferred',
      evidence: 'Top 3 topics by post count in each period.',
      caveat: 'Topic assignment is keyword-based and approximate.',
      method: 'Topic frequency ranking per period.',
    },
    toneShift: {
      value: { a: avgTone(postsA), b: avgTone(postsB) },
      status: 'inferred',
      evidence: 'Average tone markers per period.',
      caveat: 'Tone heuristics are approximate, culturally dependent, and measure word patterns, not intent.',
      method: 'Mean of per-post tone marker values in each period.',
    },
  };
}

// ── Main Pipeline ────────────────────────────────────────────────────────────

export function runAnalysis(profile: DatasetProfile): AnalysisResult {
  const { posts } = profile;

  const topicEntropy = computeTopicEntropy(posts);
  const engagementSensitivity = computeEngagementSensitivity(posts);
  const toneTrends = computeToneTrends(posts);
  const selfDescriptionShift = computeSelfDescriptionShift(posts);

  return {
    profile,
    postingFrequency: computePostingFrequency(posts),
    topicDistribution: computeTopicDistribution(posts),
    topicEntropy,
    vocabularyDrift: computeVocabularyDrift(posts),
    toneTrends,
    narrativeRepetition: computeNarrativeRepetition(posts),
    selfDescriptionShift,
    engagementSensitivity,
    reinforcementCorrelation: computeReinforcementCorrelation(posts),
    memoryEvents: computeMemoryEvents(posts),
    civicQuestions: computeCivicQuestions(posts, {
      topicEntropy,
      engagementSensitivity,
      toneTrends: toneTrends as FramedInsight<{ assertiveness: TimeSeriesPoint[]; emotionality: TimeSeriesPoint[] }>,
      selfDescriptionShift,
    }),
  };
}
