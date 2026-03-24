// ── Core Data Types ──────────────────────────────────────────────────────────
// These types define the data model for The Platformed Self.
// All analytical outputs are wrapped in FramedInsight<T> to enforce
// epistemic labeling at the type level.

export type EpistemicStatus =
  | 'observed'
  | 'inferred'
  | 'speculative'
  | 'governance_commentary';

export interface FramedInsight<T> {
  value: T;
  status: EpistemicStatus;
  evidence: string;
  caveat: string;
  method: string;
}

export interface FramedMetric extends FramedInsight<number> {
  unit: string;
  direction: 'increasing' | 'decreasing' | 'stable' | 'fluctuating' | null;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface FramedTimeSeries extends FramedInsight<TimeSeriesPoint[]> {
  xLabel: string;
  yLabel: string;
}

// ── Post Types ───────────────────────────────────────────────────────────────

export interface Post {
  id: string;
  platformId: string;
  createdAt: string;
  content: PostContent;
  engagement: EngagementMetrics | null;
  derived: DerivedPostData | null;
}

export interface PostContent {
  text: string;
  mediaType: 'text' | 'image' | 'video' | 'link' | 'mixed';
  wordCount: number;
  hashtags: string[];
  mentions: string[];
  isRepost: boolean;
  repostOfId: string | null;
}

export interface EngagementMetrics {
  likes: number | null;
  shares: number | null;
  replies: number | null;
  views: number | null;
}

export interface DerivedPostData {
  topics: TopicAssignment[];
  tone: ToneMarkers;
  selfDescriptions: SelfDescriptionMarker[];
  civicMarkers: CivicMarker[];
  memoryReferences: MemoryReference[];
  vocabularyFingerprint: string[];
}

export interface TopicAssignment {
  topic: string;
  confidence: number;
}

export interface ToneMarkers {
  assertiveness: number;
  emotionality: number;
  formality: number;
  urgency: number;
  vulnerability: number;
}

export interface SelfDescriptionMarker {
  phrase: string;
  pattern:
    | 'role_claim'
    | 'identity_statement'
    | 'expertise_signal'
    | 'vulnerability_disclosure'
    | 'origin_narrative';
  postId: string;
}

export interface CivicMarker {
  type:
    | 'political_opinion'
    | 'policy_reference'
    | 'collective_action'
    | 'institutional_critique'
    | 'electoral'
    | 'rights_claim';
  intensity: 'passing' | 'substantive' | 'primary_topic';
}

export interface MemoryReference {
  type: 'self_quote' | 'throwback' | 'anniversary' | 'repost_own' | 'narrative_callback';
  referencedPostId: string | null;
  temporalDistance: number | null;
}

// ── Profile & Dataset ────────────────────────────────────────────────────────

export interface DatasetProfile {
  id: string;
  label: string;
  description: string;
  platform: string;
  dataQuality: DataQualityReport;
  posts: Post[];
  timePeriods: TimePeriod[];
}

export interface DataQualityReport {
  totalPosts: number;
  dateRange: { start: string; end: string };
  hasEngagementData: boolean;
  missingFields: string[];
  averagePostsPerMonth: number;
}

export interface TimePeriod {
  id: string;
  label: string;
  start: string;
  end: string;
  postCount: number;
}

// ── Indicator Results ────────────────────────────────────────────────────────

export interface TopicOverTime {
  topic: string;
  series: TimeSeriesPoint[];
}

export interface DriftingTerm {
  term: string;
  direction: 'emerging' | 'fading' | 'stable';
  earlierFrequency: number;
  laterFrequency: number;
}

export interface RecurringPhrase {
  phrase: string;
  occurrences: number;
  firstAppearance: string;
  lastAppearance: string;
  temporalSpread: 'concentrated' | 'distributed' | 'escalating';
}

export interface TopicEngagement {
  topic: string;
  averageEngagement: number;
  postCount: number;
  frequencyTrend: 'increasing' | 'stable' | 'decreasing';
}

export interface PeriodComparison {
  periodA: { label: string; start: string; end: string };
  periodB: { label: string; start: string; end: string };
  topicDiversity: FramedInsight<{ a: number; b: number }>;
  postingFrequency: FramedInsight<{ a: number; b: number }>;
  topTopics: FramedInsight<{ a: string[]; b: string[] }>;
  toneShift: FramedInsight<{
    a: { assertiveness: number; emotionality: number; formality: number; urgency: number };
    b: { assertiveness: number; emotionality: number; formality: number; urgency: number };
  }>;
}

export interface MemoryEvent {
  laterPostId: string;
  laterDate: string;
  earlierPostId: string;
  earlierDate: string;
  sharedPhrase: string;
  similarity: number;
  daysBetween: number;
}

export interface CivicQuestion {
  question: string;
  context: string;
  dataConnection: string | null;
  status: EpistemicStatus;
}

export interface AnalysisResult {
  profile: DatasetProfile;
  postingFrequency: FramedTimeSeries;
  topicDistribution: FramedInsight<TopicOverTime[]>;
  topicEntropy: FramedTimeSeries;
  vocabularyDrift: FramedInsight<DriftingTerm[]>;
  toneTrends: FramedInsight<{
    assertiveness: TimeSeriesPoint[];
    emotionality: TimeSeriesPoint[];
    formality: TimeSeriesPoint[];
    urgency: TimeSeriesPoint[];
  }>;
  narrativeRepetition: FramedInsight<RecurringPhrase[]>;
  selfDescriptionShift: FramedInsight<{
    early: SelfDescriptionMarker[];
    late: SelfDescriptionMarker[];
  }>;
  engagementSensitivity: FramedInsight<TopicEngagement[]> | null;
  reinforcementCorrelation: FramedTimeSeries | null;
  memoryEvents: FramedInsight<MemoryEvent[]>;
  civicQuestions: FramedInsight<CivicQuestion[]>;
}
