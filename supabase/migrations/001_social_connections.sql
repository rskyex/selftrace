-- ── Social Account Connections ───────────────────────────────────────────────
-- Stores OAuth-connected social media accounts and their imported data.
-- Designed for multi-platform support (X first, YouTube/TikTok/Instagram later).

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ── Connected Accounts ──────────────────────────────────────────────────────

create table connected_accounts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  platform      text not null check (platform in ('x', 'youtube', 'tiktok', 'instagram')),
  platform_user_id   text not null,
  platform_username  text,
  platform_display_name text,
  platform_avatar_url   text,
  access_token  text not null,
  refresh_token text,
  token_expires_at timestamptz,
  scopes        text[] default '{}',
  connected_at  timestamptz not null default now(),
  last_sync_at  timestamptz,
  status        text not null default 'active' check (status in ('active', 'expired', 'revoked')),

  unique (user_id, platform, platform_user_id)
);

create index idx_connected_accounts_user on connected_accounts(user_id);
create index idx_connected_accounts_platform on connected_accounts(platform);

-- ── Raw Imported Posts ──────────────────────────────────────────────────────

create table posts_raw (
  id              uuid primary key default gen_random_uuid(),
  account_id      uuid not null references connected_accounts(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,
  platform        text not null,
  platform_post_id text not null,
  created_at      timestamptz not null,
  imported_at     timestamptz not null default now(),
  content_text    text,
  media_type      text default 'text',
  hashtags        text[] default '{}',
  mentions        text[] default '{}',
  is_repost       boolean default false,
  likes           integer,
  shares          integer,
  replies         integer,
  views           integer,
  raw_json        jsonb,

  unique (account_id, platform_post_id)
);

create index idx_posts_raw_account on posts_raw(account_id);
create index idx_posts_raw_user on posts_raw(user_id);
create index idx_posts_raw_created on posts_raw(created_at);

-- ── Analysis Runs ───────────────────────────────────────────────────────────

create table analysis_runs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  account_id    uuid not null references connected_accounts(id) on delete cascade,
  started_at    timestamptz not null default now(),
  completed_at  timestamptz,
  status        text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  post_count    integer not null default 0,
  error_message text,
  results       jsonb,

  -- Analysis sub-results stored as JSONB for flexibility
  posting_frequency   jsonb,
  repeated_phrases    jsonb,
  topic_clusters      jsonb,
  self_description_changes jsonb
);

create index idx_analysis_runs_user on analysis_runs(user_id);
create index idx_analysis_runs_account on analysis_runs(account_id);

-- ── Row Level Security ──────────────────────────────────────────────────────

alter table connected_accounts enable row level security;
alter table posts_raw enable row level security;
alter table analysis_runs enable row level security;

-- Users can only access their own data
create policy "Users manage own accounts"
  on connected_accounts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own posts"
  on posts_raw for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own analyses"
  on analysis_runs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
