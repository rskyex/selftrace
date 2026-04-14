# SelfTrace

Trace how social media shaped the person you became online.

SelfTrace is a web application that analyzes your social media history to reveal patterns in self-expression, linguistic drift, and algorithmic reinforcement. It helps you understand which parts of your online identity were intrinsic versus shaped by platform incentives.

Part of **The Govern the Human Project** by Risa Koyanagi.

## Features

- **Social Account Connection** — OAuth 2.0 integration with X (Twitter). YouTube, TikTok, and Instagram support planned.
- **Post Import & Analysis** — Fetches your post history and runs linguistic analysis on patterns, topics, and tone.
- **Epistemic Labeling** — Every insight is labeled as _observed_, _inferred_, or _speculative_, so you always know how confident the analysis is.
- **Multi-Dimensional Dashboards** — Explore your data across dimensions including drift, identity shifts, reinforcement patterns, recurring themes, and more.
- **Demo Profiles** — Explore the platform without connecting an account.
- **Privacy-First** — Analysis runs client-side. Row-Level Security ensures data isolation per user.

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
| **Kept** | Content posted despite low engagement |
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
