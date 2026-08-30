-- supabase/migrations/20260830_session_history_and_drafts.sql
--
-- Vaylo AI — Persistent Interview Sessions & Portfolio Drafts Schema
-- Closes the localStorage-only data loss gap with full Row Level Security (RLS) multi-tenant isolation.

-- 1. Interview Sessions Table
create table if not exists interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null,
  seniority text,
  company_style text,
  persona_id text not null,
  questions jsonb not null default '[]'::jsonb, -- full question set + answers + follow-ups
  star_scores jsonb not null default '[]'::jsonb, -- per-question STAR breakdown
  overall_score numeric,
  filler_word_density numeric,
  speaking_pace_wpm numeric,
  webcam_metrics jsonb, -- null if webcam wasn't enabled for this session
  completed boolean not null default false, -- false = partial/abandoned session
  created_at timestamptz not null default now()
);

-- Index for fast user history lookup
create index if not exists idx_interview_sessions_user_id on interview_sessions(user_id, created_at desc);

-- Enable RLS
alter table interview_sessions enable row level security;

-- Multi-Tenant RLS Policy (User can only read, insert, update, or delete their own sessions)
create policy "Users manage own interview sessions" on interview_sessions
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 2. Portfolio Drafts Table (One active draft per user with debounced autosave)
create table if not exists portfolio_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  draft_data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Index for fast user draft lookup
create index if not exists idx_portfolio_drafts_user_id on portfolio_drafts(user_id);

-- Enable RLS
alter table portfolio_drafts enable row level security;

-- Multi-Tenant RLS Policy
create policy "Users manage own portfolio draft" on portfolio_drafts
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
