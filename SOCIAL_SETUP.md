# Social Account Connection — Setup Guide

## Overview

SelfTrace now supports connecting social media accounts via official OAuth login,
importing post history, and running analysis on that data. Currently, **X (Twitter)**
is supported. YouTube, TikTok, and Instagram are planned.

---

## Prerequisites

1. **Supabase project** — Create one at [supabase.com](https://supabase.com)
2. **X Developer account** — Apply at [developer.x.com](https://developer.x.com)

---

## 1. Supabase Setup

### Create the database tables

Run the migration in your Supabase SQL editor:

```sql
-- Copy the contents of supabase/migrations/001_social_connections.sql
```

Or if using the Supabase CLI:

```bash
supabase db push
```

### Enable Supabase Auth

In your Supabase dashboard:
1. Go to **Authentication > Providers**
2. Enable **Email** (or any provider you want for user login)
3. Copy your project URL and anon key from **Settings > API**

---

## 2. X (Twitter) OAuth Setup

1. Go to the [X Developer Portal](https://developer.x.com/en/portal/dashboard)
2. Create a new Project and App
3. Under **User authentication settings**:
   - Enable **OAuth 2.0**
   - Type of App: **Web App**
   - Callback URL: `http://localhost:3000/api/oauth/x/callback`
     (and your production URL when deploying)
   - Website URL: your site URL
4. Copy your **Client ID** and **Client Secret**

---

## 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `X_CLIENT_ID` | X OAuth 2.0 Client ID |
| `X_CLIENT_SECRET` | X OAuth 2.0 Client Secret |
| `NEXT_PUBLIC_APP_URL` | Your app URL (e.g., `http://localhost:3000`) |

---

## 4. User Flow

1. User visits `/social`
2. Clicks **Connect X (Twitter)**
3. Redirected to X for OAuth login
4. After authorization, redirected back to `/social` with account connected
5. Clicks **Import posts** to fetch recent tweets
6. Clicks **Preview & analyze** to view imported data
7. Clicks **Analyze** to run SelfTrace analysis
8. Views results on the results page

---

## 5. Architecture

```
src/
  lib/
    supabase/          — Supabase client utilities
      client.ts        — Browser client
      server.ts        — Server client + service client
    platforms/          — Platform connector abstraction
      types.ts         — PlatformConnector interface
      registry.ts      — Platform registry
      x.ts             — X (Twitter) implementation
    analysis/
      social.ts        — Social post analysis pipeline
  app/
    api/
      oauth/x/         — X OAuth initiation
      oauth/x/callback — X OAuth callback
      social/import    — Post import endpoint
      social/analyze   — Analysis run endpoint
    social/            — Connect account page
    social/import/     — Import preview page
    social/results/    — Analysis results page
  supabase/
    migrations/        — Database schema
```

---

## 6. Database Schema

### `connected_accounts`
Stores OAuth-connected social accounts with tokens and metadata.

### `posts_raw`
Stores raw imported posts with content, engagement metrics, and original JSON.

### `analysis_runs`
Stores analysis run records with status and JSONB results.

All tables have Row Level Security (RLS) enabled — users can only access their own data.

---

## 7. Security Notes

- Tokens are stored in Supabase (encrypted at rest)
- RLS policies ensure data isolation per user
- OAuth state parameter prevents CSRF
- PKCE (S256) used for X OAuth flow
- Service role key is server-side only (never exposed to client)
