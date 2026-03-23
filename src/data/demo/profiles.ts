// ── Demo Profile Definitions ─────────────────────────────────────────────────
// Three fictional profiles that exercise different analytical patterns.
// All data is synthetic. No real person is represented.

import type {
  DatasetProfile,
  Post,
  EngagementMetrics,
  ToneMarkers,
  TopicAssignment,
  SelfDescriptionMarker,
  CivicMarker,
  MemoryReference,
  TimePeriod,
} from '@/lib/data/types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeDate(year: number, month: number, day: number): string {
  return new Date(year, month - 1, day).toISOString();
}

function randomBetween(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateId(prefix: string, i: number): string {
  return `${prefix}-${String(i).padStart(4, '0')}`;
}

// ── Topic Templates ──────────────────────────────────────────────────────────

const INTELLECTUAL_TOPICS = {
  early: ['philosophy', 'urban-planning', 'film', 'cooking', 'literature', 'travel'],
  mid: ['tech-ethics', 'AI-governance', 'philosophy', 'film', 'digital-rights'],
  late: ['AI-governance', 'tech-ethics', 'platform-accountability', 'regulation'],
};

const POLITICAL_TOPICS = {
  early: ['local-community', 'photography', 'food', 'personal', 'nature', 'books'],
  mid: ['local-politics', 'national-politics', 'photography', 'personal', 'community-organizing'],
  late: ['national-politics', 'institutional-critique', 'electoral', 'rights-claims'],
};

const EXPERTISE_TOPICS = {
  early: ['marketing', 'travel', 'books', 'career-advice', 'industry-news', 'personal'],
  mid: ['career-advice', 'marketing-strategy', 'leadership', 'industry-news'],
  late: ['marketing-strategy', 'personal-brand', 'leadership', 'thought-leadership'],
};

// ── Post Text Templates ──────────────────────────────────────────────────────

const INTELLECTUAL_TEXTS: Record<string, string[]> = {
  'philosophy': [
    'Reading Arendt on public space and wondering how it maps to digital assembly.',
    'The distinction between labor, work, and action feels more relevant now than ever.',
    'Spent the morning with Dewey\'s pragmatism. There\'s something here about how we form beliefs in networked spaces.',
  ],
  'urban-planning': [
    'The new bike lanes downtown are changing foot traffic patterns in interesting ways.',
    'Jane Jacobs would have something to say about algorithmic neighborhood recommendations.',
    'Walked through the redevelopment zone. The tension between preservation and access is visible on every block.',
  ],
  'film': [
    'Rewatched Stalker. Tarkovsky\'s patience with the viewer feels countercultural now.',
    'The framing in that new documentary about attention is itself a kind of attention engineering.',
    'There\'s a film studies paper somewhere about how streaming autoplay reshapes narrative expectations.',
  ],
  'cooking': [
    'Made a slow ragu today. Six hours, no recipe, just attention. A different kind of making.',
    'The farmers market has a new vendor with heirloom tomatoes that actually taste like something.',
  ],
  'tech-ethics': [
    'The thing people miss about algorithmic curation is that it doesn\'t just filter — it teaches you what to want to see.',
    'We keep talking about AI bias as if it\'s a bug. But what if the optimization target itself is the problem?',
    'New paper on recommendation system feedback loops is worth reading carefully. The methodology is solid.',
    'As a researcher, I\'m increasingly concerned that we\'re building interpretive frameworks after the systems are already deployed.',
    'The alignment discussion keeps centering capability. What about the alignment of the attention market itself?',
    'Platform governance isn\'t just about content moderation. It\'s about the structural conditions of self-expression.',
    'I\'ve been saying this for years: the engagement metric is not a neutral measurement. It\'s an incentive architecture.',
  ],
  'AI-governance': [
    'The EU AI Act is a start, but it doesn\'t address the feedback dynamics between users and recommendation systems.',
    'We need governance frameworks that account for cumulative behavioral effects, not just individual harms.',
    'The thing people miss about platform regulation is that it can\'t just be about content — it has to be about design choices.',
    'As someone who has been working on this for years, the gap between policy proposals and platform reality is growing.',
    'Testified at the advisory hearing today. The committee understands content moderation but not reinforcement dynamics.',
    'Another day, another "responsible AI" announcement that doesn\'t mention the economic incentives driving irresponsible deployment.',
  ],
  'platform-accountability': [
    'The thing people miss about transparency reports is that they show what platforms choose to measure, not what matters.',
    'Platform accountability without structural reform is just performance. We need to talk about design mandates.',
  ],
  'regulation': [
    'The regulatory conversation keeps defaulting to speech frameworks when the real issue is behavioral infrastructure.',
    'If we regulate platforms as utilities, we get one set of outcomes. As media companies, another. The frame determines everything.',
  ],
  'digital-rights': [
    'Digital rights discourse tends to focus on access. But what about the right to not be behaviorally optimized?',
  ],
  'literature': [
    'Finished the new Ferrante. Her attention to self-narration is exactly what I\'m thinking about in platform contexts.',
  ],
  'travel': [
    'Back from the conference in Berlin. The European approach to platform governance is structurally different.',
  ],
};

const POLITICAL_TEXTS: Record<string, string[]> = {
  'local-community': [
    'Neighborhood cleanup went well today. Good turnout, good conversations.',
    'The community garden is coming along. Next meeting is Tuesday if anyone wants to join.',
    'Local school board meeting tonight. These things matter more than people think.',
  ],
  'photography': [
    'Morning light on the river. Sometimes you just have to stop and notice.',
    'The way shadows fall across the old warehouses at sunset — there\'s a geometry there.',
    'Spent the afternoon photographing the mural project. Community art is its own form of speech.',
  ],
  'food': [
    'The tamale lady is back at the Sunday market. This is the community infrastructure that matters.',
  ],
  'personal': [
    'Grateful for quiet mornings and strong coffee. Not everything needs to be a take.',
    'Taking a week off from the news. The garden needs attention and so do I.',
  ],
  'nature': [
    'First crocus of spring. The small things are still happening regardless.',
  ],
  'books': [
    'Reading Danielle Allen on democratic citizenship. Everyone in local government should read this.',
  ],
  'local-politics': [
    'The zoning decision today will reshape the neighborhood for decades. And most people don\'t even know it happened.',
    'Went to the council meeting. The disconnect between residents and officials is palpable.',
    'The housing proposal has real potential but the community engagement process was inadequate.',
  ],
  'national-politics': [
    'I can\'t believe we\'re still debating whether voting access matters. The evidence is overwhelming.',
    'And here\'s what no one is talking about: the infrastructure bill has provisions that directly affect local organizing.',
    'The political conversation has become so nationalized that we\'ve lost the ability to think locally.',
    'Every day brings a new reason to pay attention. This is not normal and we shouldn\'t pretend it is.',
    'Someone who won\'t stay silent: the gap between policy rhetoric and lived experience is a chasm.',
    'The thing no one is talking about is how much of this political energy is being channeled through platforms that profit from division.',
    'I\'ve been saying this for months: you cannot separate political polarization from the attention economy.',
    'Another morning, another news cycle designed to provoke reaction. And yes, I\'m reacting. But consciously.',
  ],
  'community-organizing': [
    'Organized a phone bank tonight. Fifteen volunteers. This is how it starts.',
    'We need to talk about how platform algorithms affect organizing. The reach disparity is real.',
  ],
  'institutional-critique': [
    'Institutions that were supposed to protect democratic participation are failing. This is not a drill.',
    'When I look at the institutional response to platform monopolies, I see learned helplessness.',
  ],
  'electoral': [
    'If you\'re not registered, register. If you are, check your registration. This is baseline.',
    'The election is in weeks and the level of misinformation is staggering. Verify everything.',
  ],
  'rights-claims': [
    'The right to organize is the right to have a political voice. They are inseparable.',
    'We keep framing digital rights as a tech issue when it\'s fundamentally a civil rights issue.',
  ],
};

const EXPERTISE_TEXTS: Record<string, string[]> = {
  'marketing': [
    'Interesting case study from the agency. Sometimes the simplest approach outperforms the clever one.',
    'Conference yesterday had some good sessions on measurement. The industry is slowly getting more rigorous.',
  ],
  'travel': [
    'Back from Lisbon. The coffee, the light, the pace — sometimes a change of context is the best strategy.',
  ],
  'books': [
    'Reading Kahneman again. The framing chapter never gets old.',
    'Just finished a business book that was actually worth reading. Will share notes next week.',
  ],
  'career-advice': [
    'The best career advice I ever received: learn to write clearly. Everything else follows.',
    'In my experience, the people who advance fastest are the ones who can explain complex things simply.',
    'A thread on what I\'ve learned about building a career in marketing.',
  ],
  'industry-news': [
    'The latest platform changes are going to reshape how brands think about organic reach.',
    'Interesting earnings call. Reading between the lines on their ad product roadmap.',
  ],
  'personal': [
    'Sometimes you need to step away from the metrics and remember why you started.',
    'Weekend reset. Family time. No content strategy required.',
  ],
  'marketing-strategy': [
    'In my 10 years of marketing, the single most underrated skill is knowing when NOT to post.',
    'Here\'s what most people get wrong about content strategy:\n\n1. They optimize for reach instead of relevance\n2. They post too often\n3. They ignore their own data\n\nDo the opposite.',
    '3 lessons from a recent campaign that exceeded all targets:\n\n1. Start with the audience insight, not the creative\n2. Test ugly before you polish beautiful\n3. Measure what matters, ignore what doesn\'t',
    'The biggest mistake in B2B marketing? Treating your audience like a segment instead of a person.',
    'From my experience leading teams: the best marketers are the ones who can say "I don\'t know" and then go find out.',
  ],
  'personal-brand': [
    'Your personal brand is not what you say about yourself. It\'s the pattern others recognize.',
    'I\'ve been building in public for 2 years now. Here\'s what actually moved the needle.',
  ],
  'leadership': [
    'Leadership is not about having the answers. It\'s about creating the conditions for others to find them.',
    'In my 10 years of leading marketing teams, the single most important thing I\'ve learned:\n\nTrust compounds. Micromanagement doesn\'t.',
    'Here\'s what most people get wrong about leadership:\n\n1. They confuse activity with progress\n2. They optimize for consensus instead of clarity\n3. They communicate decisions, not reasoning',
  ],
  'thought-leadership': [
    'The future of marketing is not more content. It\'s better questions.\n\nHere\'s what I mean:',
    'Here\'s what most people get wrong about thought leadership: it\'s not about having hot takes. It\'s about having a consistent, evidence-based perspective that helps others think more clearly.',
    'A contrarian view: the best time to build your brand is when everyone else is cutting back.\n\n3 reasons why:',
  ],
};

// ── Post Generator ───────────────────────────────────────────────────────────

function generatePostsForProfile(
  profileId: string,
  platform: string,
  topicPhases: Record<string, string[]>,
  textTemplates: Record<string, string[]>,
  totalMonths: number,
  startYear: number,
  startMonth: number,
  frequencyCurve: (month: number) => number,
  engagementCurve: (month: number, topic: string) => EngagementMetrics,
  toneCurve: (month: number) => ToneMarkers,
  selfDescCurve: (month: number) => SelfDescriptionMarker[],
  civicCurve: (month: number, topic: string) => CivicMarker[],
  memoryCurve: (month: number) => MemoryReference[],
): Post[] {
  const posts: Post[] = [];
  let postIndex = 0;

  for (let m = 0; m < totalMonths; m++) {
    const postsThisMonth = frequencyCurve(m);
    const phase = m < totalMonths * 0.3 ? 'early' : m < totalMonths * 0.65 ? 'mid' : 'late';
    const availableTopics = topicPhases[phase];

    for (let p = 0; p < postsThisMonth; p++) {
      const topic = pick(availableTopics);
      const day = randomBetween(1, 28);
      const year = startYear + Math.floor((startMonth - 1 + m) / 12);
      const month = ((startMonth - 1 + m) % 12) + 1;

      const textsForTopic = textTemplates[topic] || [`Thinking about ${topic} today.`];
      const text = pick(textsForTopic);

      const id = generateId(profileId, postIndex);
      postIndex++;

      posts.push({
        id,
        platformId: platform,
        createdAt: makeDate(year, month, day),
        content: {
          text,
          mediaType: 'text',
          wordCount: text.split(/\s+/).length,
          hashtags: [],
          mentions: [],
          isRepost: false,
          repostOfId: null,
        },
        engagement: engagementCurve(m, topic),
        derived: {
          topics: [{ topic, confidence: 0.8 + Math.random() * 0.2 }],
          tone: toneCurve(m),
          selfDescriptions: selfDescCurve(m).map(sd => ({ ...sd, postId: id })),
          civicMarkers: civicCurve(m, topic),
          memoryReferences: m > 12 ? memoryCurve(m) : [],
          vocabularyFingerprint: text.toLowerCase().split(/\s+/).filter(w => w.length > 4).slice(0, 5),
        },
      });
    }
  }

  posts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  return posts;
}

// ── Profile 1: The Emerging Public Intellectual ──────────────────────────────

function buildIntellectualProfile(): DatasetProfile {
  const posts = generatePostsForProfile(
    'intellectual',
    'twitter',
    INTELLECTUAL_TOPICS,
    INTELLECTUAL_TEXTS,
    30,
    2021, 6,
    (m) => {
      if (m < 8) return randomBetween(8, 12);
      if (m < 16) return randomBetween(15, 22);
      if (m < 24) return randomBetween(22, 30);
      return randomBetween(18, 28);
    },
    (m, topic) => {
      const base = randomBetween(5, 25);
      const topicBoost = ['tech-ethics', 'AI-governance', 'platform-accountability'].includes(topic) ? 3.5 : 1;
      const timeBoost = 1 + m * 0.08;
      return {
        likes: Math.round(base * topicBoost * timeBoost),
        shares: Math.round(base * 0.3 * topicBoost * timeBoost),
        replies: Math.round(base * 0.15 * topicBoost * timeBoost),
        views: Math.round(base * 20 * topicBoost * timeBoost),
      };
    },
    (m) => ({
      assertiveness: Math.min(0.3 + m * 0.02, 0.85),
      emotionality: Math.min(0.2 + m * 0.01, 0.55),
      formality: Math.max(0.7 - m * 0.005, 0.5),
      urgency: Math.min(0.15 + m * 0.015, 0.65),
      vulnerability: Math.max(0.3 - m * 0.008, 0.1),
    }),
    (m) => {
      if (m < 8) return [];
      if (m < 16) return Math.random() > 0.6 ? [{ phrase: 'as a researcher', pattern: 'role_claim' as const, postId: '' }] : [];
      if (m < 24) return Math.random() > 0.4 ? [{ phrase: 'as a researcher', pattern: 'role_claim' as const, postId: '' }] : [];
      return Math.random() > 0.3
        ? [{ phrase: 'as someone who has been saying this for years', pattern: 'expertise_signal' as const, postId: '' }]
        : [{ phrase: 'as a researcher', pattern: 'role_claim' as const, postId: '' }];
    },
    () => [],
    (m) => m > 18 && Math.random() > 0.7 ? [{ type: 'narrative_callback' as const, referencedPostId: null, temporalDistance: randomBetween(90, 300) }] : [],
  );

  return {
    id: 'demo-intellectual',
    label: 'The Emerging Public Intellectual',
    description: 'A graduate researcher who begins posting about diverse academic interests and gradually concentrates on technology ethics, developing a recognizable voice and recurring rhetorical patterns.',
    platform: 'twitter',
    dataQuality: {
      totalPosts: posts.length,
      dateRange: {
        start: posts[0]?.createdAt ?? '',
        end: posts[posts.length - 1]?.createdAt ?? '',
      },
      hasEngagementData: true,
      missingFields: [],
      averagePostsPerMonth: Math.round(posts.length / 30),
    },
    posts,
    timePeriods: buildQuarterlyPeriods(posts),
  };
}

// ── Profile 2: The Politically Reactive Voice ────────────────────────────────

function buildPoliticalProfile(): DatasetProfile {
  const posts = generatePostsForProfile(
    'political',
    'twitter',
    POLITICAL_TOPICS,
    POLITICAL_TEXTS,
    36,
    2021, 1,
    (m) => {
      if (m < 10) return randomBetween(10, 16);
      if (m < 18) return randomBetween(14, 22);
      if (m < 28) return randomBetween(18, 28);
      return randomBetween(20, 32);
    },
    (m, topic) => {
      const base = randomBetween(8, 30);
      const politicalTopics = ['national-politics', 'institutional-critique', 'electoral', 'rights-claims', 'local-politics'];
      const isPolitical = politicalTopics.includes(topic);
      const topicBoost = isPolitical ? (m > 10 ? 3.5 : 1.5) : 1;
      return {
        likes: Math.round(base * topicBoost),
        shares: Math.round(base * 0.4 * topicBoost),
        replies: Math.round(base * 0.25 * topicBoost),
        views: Math.round(base * 15 * topicBoost),
      };
    },
    (m) => ({
      assertiveness: Math.min(0.25 + m * 0.018, 0.9),
      emotionality: Math.min(0.2 + m * 0.02, 0.85),
      formality: Math.max(0.6 - m * 0.01, 0.25),
      urgency: Math.min(0.1 + m * 0.022, 0.88),
      vulnerability: Math.max(0.35 - m * 0.008, 0.08),
    }),
    (m) => {
      if (m < 10) return Math.random() > 0.7 ? [{ phrase: 'as a community member', pattern: 'role_claim' as const, postId: '' }] : [];
      if (m < 22) return Math.random() > 0.5 ? [{ phrase: 'we need to', pattern: 'identity_statement' as const, postId: '' }] : [];
      return Math.random() > 0.4
        ? [{ phrase: 'someone who won\'t stay silent', pattern: 'identity_statement' as const, postId: '' }]
        : [];
    },
    (m, topic) => {
      const politicalTopics = ['national-politics', 'institutional-critique', 'electoral', 'rights-claims', 'local-politics'];
      if (!politicalTopics.includes(topic)) return [];
      const intensity: CivicMarker['intensity'] = m > 22 ? 'primary_topic' : m > 10 ? 'substantive' : 'passing';
      return [{ type: 'political_opinion' as const, intensity }];
    },
    (m) => m > 20 && Math.random() > 0.6 ? [{ type: 'self_quote' as const, referencedPostId: null, temporalDistance: randomBetween(60, 200) }] : [],
  );

  return {
    id: 'demo-political',
    label: 'The Politically Reactive Voice',
    description: 'A community organizer whose posting begins with local events and personal reflections, gradually becoming dominated by national political commentary with increasing emotional intensity.',
    platform: 'twitter',
    dataQuality: {
      totalPosts: posts.length,
      dateRange: {
        start: posts[0]?.createdAt ?? '',
        end: posts[posts.length - 1]?.createdAt ?? '',
      },
      hasEngagementData: true,
      missingFields: [],
      averagePostsPerMonth: Math.round(posts.length / 36),
    },
    posts,
    timePeriods: buildQuarterlyPeriods(posts),
  };
}

// ── Profile 3: The Expertise Brand-Builder ───────────────────────────────────

function buildExpertiseProfile(): DatasetProfile {
  const posts = generatePostsForProfile(
    'expertise',
    'linkedin',
    EXPERTISE_TOPICS,
    EXPERTISE_TEXTS,
    24,
    2022, 3,
    (m) => {
      if (m < 6) return randomBetween(8, 14);
      if (m < 12) return randomBetween(10, 16);
      return randomBetween(9, 12); // More consistent, scheduled
    },
    (m, topic) => {
      const base = randomBetween(10, 40);
      const brandTopics = ['marketing-strategy', 'leadership', 'thought-leadership', 'personal-brand'];
      const isBrand = brandTopics.includes(topic);
      const topicBoost = isBrand ? (m > 12 ? 4 : 2) : 1;
      return {
        likes: Math.round(base * topicBoost),
        shares: Math.round(base * 0.2 * topicBoost),
        replies: Math.round(base * 0.3 * topicBoost),
        views: Math.round(base * 25 * topicBoost),
      };
    },
    (m) => ({
      assertiveness: Math.min(0.3 + m * 0.025, 0.9),
      emotionality: 0.2 + Math.random() * 0.1,
      formality: Math.min(0.4 + m * 0.02, 0.85),
      urgency: 0.15 + Math.random() * 0.1,
      vulnerability: Math.max(0.25 - m * 0.01, 0.05),
    }),
    (m) => {
      if (m < 6) return [];
      if (m < 12) return Math.random() > 0.5 ? [{ phrase: 'in my experience', pattern: 'expertise_signal' as const, postId: '' }] : [];
      return Math.random() > 0.3
        ? [{ phrase: 'in my 10 years of marketing', pattern: 'expertise_signal' as const, postId: '' }]
        : [{ phrase: 'here\'s what most people get wrong', pattern: 'expertise_signal' as const, postId: '' }];
    },
    () => [],
    (m) => m > 16 && Math.random() > 0.5 ? [{ type: 'repost_own' as const, referencedPostId: null, temporalDistance: randomBetween(30, 150) }] : [],
  );

  return {
    id: 'demo-expertise',
    label: 'The Expertise Brand-Builder',
    description: 'A marketing professional who begins posting casually and gradually develops a highly structured, expertise-signaling content strategy with recognizable formatting patterns.',
    platform: 'linkedin',
    dataQuality: {
      totalPosts: posts.length,
      dateRange: {
        start: posts[0]?.createdAt ?? '',
        end: posts[posts.length - 1]?.createdAt ?? '',
      },
      hasEngagementData: true,
      missingFields: [],
      averagePostsPerMonth: Math.round(posts.length / 24),
    },
    posts,
    timePeriods: buildQuarterlyPeriods(posts),
  };
}

// ── Period Builder ───────────────────────────────────────────────────────────

function buildQuarterlyPeriods(posts: Post[]): TimePeriod[] {
  if (posts.length === 0) return [];

  const periods: TimePeriod[] = [];
  const startDate = new Date(posts[0].createdAt);
  const endDate = new Date(posts[posts.length - 1].createdAt);

  let current = new Date(startDate.getFullYear(), Math.floor(startDate.getMonth() / 3) * 3, 1);
  let periodIndex = 0;

  while (current <= endDate) {
    const periodEnd = new Date(current.getFullYear(), current.getMonth() + 3, 0);
    const periodPosts = posts.filter(p => {
      const d = new Date(p.createdAt);
      return d >= current && d <= periodEnd;
    });

    const qNum = Math.floor(current.getMonth() / 3) + 1;
    periods.push({
      id: `period-${periodIndex}`,
      label: `Q${qNum} ${current.getFullYear()}`,
      start: current.toISOString(),
      end: periodEnd.toISOString(),
      postCount: periodPosts.length,
    });

    current = new Date(current.getFullYear(), current.getMonth() + 3, 1);
    periodIndex++;
  }

  return periods;
}

// ── Export ────────────────────────────────────────────────────────────────────

let cachedProfiles: DatasetProfile[] | null = null;

export function getDemoProfiles(): DatasetProfile[] {
  if (cachedProfiles) return cachedProfiles;
  cachedProfiles = [
    buildIntellectualProfile(),
    buildPoliticalProfile(),
    buildExpertiseProfile(),
  ];
  return cachedProfiles;
}

export function getDemoProfile(id: string): DatasetProfile | undefined {
  return getDemoProfiles().find(p => p.id === id);
}
