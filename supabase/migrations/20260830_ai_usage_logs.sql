-- supabase/migrations/20260830_ai_usage_logs.sql
--
-- Vaylo AI — Complete AI Usage Logging & Security Observability Schema
-- Logs all AI-powered route invocations (success, 401 unauth, 403 plan blocked, 429 rate limit, 500 error).

create table if not exists ai_usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  route text not null,
  request_type text,
  plan_at_time text,
  status text not null, -- 'success' | 'blocked_auth' | 'blocked_plan' | 'blocked_rate_limit' | 'error'
  http_status integer not null,
  gemini_model_used text,
  estimated_tokens integer,
  ip_address text,
  created_at timestamptz not null default now()
);

-- Ensure all columns exist if table was already created with older schema
alter table ai_usage_logs add column if not exists route text;
alter table ai_usage_logs add column if not exists request_type text;
alter table ai_usage_logs add column if not exists plan_at_time text;
alter table ai_usage_logs add column if not exists status text;
alter table ai_usage_logs add column if not exists http_status integer;
alter table ai_usage_logs add column if not exists gemini_model_used text;
alter table ai_usage_logs add column if not exists estimated_tokens integer;
alter table ai_usage_logs add column if not exists ip_address text;

-- Indexes for fast filtering and analytics
create index if not exists idx_ai_usage_logs_user_id on ai_usage_logs(user_id, created_at desc);
create index if not exists idx_ai_usage_logs_status on ai_usage_logs(status, created_at desc);
create index if not exists idx_ai_usage_logs_route on ai_usage_logs(route, created_at desc);

-- Enable RLS
alter table ai_usage_logs enable row level security;

-- Admin-only read policy
drop policy if exists "Admins read all logs" on ai_usage_logs;
create policy "Admins read all logs" on ai_usage_logs
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
