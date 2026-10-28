# SelfTrace

Trace how social media shaped the person you became online.

SelfTrace is a web application that analyzes your social media history to reveal patterns in self-expression, linguistic drift, and algorithmic reinforcement. It helps you understand which parts of your online identity were intrinsic versus shaped by platform incentives.

Part of **The Govern the Human Project** by Risa Koyanagi.

## Features

- **Social Account Connection (off by default)** — OAuth 2.0 integration with X (Twitter), enabled with `NEXT_PUBLIC_ENABLE_SOCIAL_CONNECT=true`. This path is not browser-only: it stores OAuth tokens (plain text), imported post text and raw post JSON in Supabase and runs the analysis on the server, and the privacy pages say so when the flag is on. With the flag off (the default) the connect option is hidden and the `/api/oauth` and `/api/social` routes return 404. YouTube, TikTok, and Instagram support planned.
- **Post Import & Analysis** — With social connect enabled, fetches your post history and runs linguistic analysis on patterns, topics, and tone.
- **Epistemic Labeling** — Every insight is labeled as _observed_, _inferred_, or _speculative_, so you always know how confident the analysis is.
- **Multi-Dimensional Dashboards** — Explore your data across dimensions including drift, identity shifts, reinforcement patterns, recurring themes, and more.
- **Demo Profiles** — Explore the platform without connecting an account.
- **Privacy-First** — In the default build, demo profiles are generated and analysed in the browser and nothing is sent to a server. With social connect enabled, Row-Level Security isolates each user's stored data.

## Result Export (gth-result/v1)

`/results` has a "Download result (JSON)" button. It writes a counts-only `gth-result/v1` document (schema in the Govern the Human repository, `SCHEMA.md`): post count, date range, top topics (with IPTC Media Topics ids), topics that were rewarded and rising, kept topics, topics that resisted reward, and topic diversity in the first and last six months. Every list uses the definitions below; the field names read by the Observatory (`engagement_vs_average`, `kept_without_encouragement`, `topic_range.diversity_*_quarter_bits`) are kept, and their meaning is written into the document's `definitions` block. Post text, phrases, self-descriptions, reflection answers and personality types are never included. The file is built in the browser (`src/lib/export/gth-result.ts`) and can be loaded into the Govern the Human Observatory.

## Definitions

Every page, the influence index and the export read their thresholds from `src/lib/analysis/definitions.ts`. `/methodology` prints the same table, a recovery test and a sensitivity table.

| Term | Definition |
|------|------------|
| Topics | [IPTC Media Topics](https://cv.iptc.org/newscodes/mediatopic/) concepts (CC BY 4.0, release 2026-09-30), assigned from post text by SelfTrace's own keyword list in `src/lib/analysis/text/taxonomy.ts`. Multi-label; posts with no match are unclassified and left out of topic counts. |
| Tone | From post text (`src/lib/analysis/text/derive.ts`): Hyland boosters vs hedges (assertiveness), VADER compound magnitude (emotionality, MIT-licensed lexicon), informal and urgency markers per 10 words. Vulnerability is not measured. |
| Engagement | likes + 2 × shares |
| Time-adjusted engagement | Post engagement ÷ median of its UTC month (quarter if the month has fewer than 10 posts). A topic's reward ratio is the median over its posts. |
| Halves | Equal duration, split at the time midpoint; trends need ≥ 20 posts per half. |
| Rewarded | Reward ratio ≥ 1.25 and ≥ 8 posts. |
| Rising / falling | Share ratio ≥ 1.3 (≤ 1/1.3), change ≥ 2 points, bootstrap 95% interval excludes 0 (1000 resamples, fixed seed). |
| Kept | ≥ 5 posts in each half, later share ≥ 90% of earlier, reward ratio < 1 in both halves. |
| Resisted reward | Rewarded and stable or falling. |
| Narrowed | Miller–Madow entropy of the last 6 months ≥ 25% below the first 6 months, bootstrap 95% interval below 0, ≥ 30 posts per window. |
| Quarterly correlation | Time-adjusted engagement in quarter N vs topic share in N+1; quarters with < 5 topics or < 30 posts are left blank. |

### Recovery test

The demo generator keeps what it planted on each post (`post.planted`: topic label, engagement multiplier, tone, self-descriptions); the analysis only sees the text and engagement counts (`post.derived`). `src/lib/analysis/recovery.ts` compares the two, and `/methodology` shows the result for each demo profile: which planted topics map to which IPTC concepts, whether planted boosts come back as rewarded topics, whether the planted growth curve is kept out of "rewarded", whether the planted low-reward running-club stream is classed as kept, and how far text-derived tone and self-descriptions follow the planted ones. Where they do not, the page says so.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) / React 19 |
| Language | TypeScript |
| Database & Auth | Supabase (PostgreSQL + Auth) |
| Styling | Tailwind CSS 4 |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [X Developer](https://developer.x.com) app (for Twitter integration)

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/rskyex/selftrace.git
   cd selftrace
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Supabase and X OAuth credentials in `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   X_CLIENT_ID=your-x-client-id
   X_CLIENT_SECRET=your-x-client-secret
   ```

4. **Run the database migration**

   ```bash
   npx supabase db push
   ```

5. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

### X (Twitter) OAuth Setup

Register a callback URL in your X Developer portal:

- Local: `http://localhost:3000/api/oauth/x/callback`
- Production: `https://selftrace.vercel.app/api/oauth/x/callback`

See [SOCIAL_SETUP.md](./SOCIAL_SETUP.md) for detailed instructions.

## Project Structure

```
src/
├── app/                    # Pages & API routes (Next.js App Router)
│   ├── api/               # OAuth, import, analyze endpoints
│   └── [pages]/           # Analysis dashboards
├── components/
│   ├── charts/            # EchoMap, CorridorChart, SelectionLandscape
│   ├── landing/           # Hero, ScrollReveal
│   ├── layout/            # TopNav, Footer
│   └── shared/            # InsightCard, PageHeader, badges
├── lib/
│   ├── analysis/          # Social post analysis pipeline
│   ├── data/              # Context provider, types, demo profiles
│   ├── epistemic/         # Confidence framing utilities
│   ├── platforms/         # Platform connectors (X, future: YouTube, TikTok, Instagram)
│   └── supabase/          # Client, server, service role clients
supabase/
└── migrations/            # Database schema (connected_accounts, posts_raw, analysis_runs)
```

## Analysis Dimensions

| Dashboard | What it shows |
|-----------|---------------|
| **Patterns** | Recurring phrases and themes |
| **Trends** | Topic distribution changes over time |
| **Drift** | Vocabulary and tone evolution |
| **Shifted** | Before/after identity markers |
| **Rewarded** | Engagement correlation — what the algorithm reinforced |
| **Kept** | Topics that held their share with time-adjusted engagement below typical |
| **Identity** | Self-description markers and shifts |
| **Reinforcement** | Engagement vs. posting frequency correlation |
| **Portrait** | Personal synthesis across all dimensions |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## License

All rights reserved.
