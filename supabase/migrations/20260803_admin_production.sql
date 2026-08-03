-- =====================================================================
-- VAYLO AI PRODUCTION SAAS ADMIN CONSOLE & SECURITY MIGRATION
-- Migration Date: 2026-08-03
-- Description: Creates server-side audit logs, AI token usage logs, analytics 
--              events, error logs, and RLS privilege escalation protection.
-- =====================================================================

-- 1. Administrative Action Audit Log Table
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID,
  admin_email TEXT,
  action TEXT NOT NULL,
  target_user_id UUID,
  target_email TEXT,
  previous_state JSONB DEFAULT '{}'::jsonb,
  new_state JSONB DEFAULT '{}'::jsonb,
  reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Centralized AI Model Token Usage Log Table
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  feature TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'google',
  model TEXT NOT NULL DEFAULT 'gemini-1.5-flash',
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  estimated_cost_inr NUMERIC(10, 4) DEFAULT 0.0000,
  request_status TEXT DEFAULT 'success',
  latency_ms INTEGER DEFAULT 0,
  error_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Application Feature Analytics Events Table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  event_name TEXT NOT NULL,
  feature TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Application System Error Log Table
CREATE TABLE IF NOT EXISTS public.system_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL,
  route TEXT NOT NULL,
  error_code TEXT NOT NULL,
  safe_message TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =====================================================================
-- PERFORMANCE INDEXES
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created ON public.admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target ON public.admin_audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created ON public.ai_usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user ON public.ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_system_errors_created ON public.system_errors(created_at DESC);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_errors ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies if re-running
DROP POLICY IF EXISTS admin_audit_log_admin_read ON public.admin_audit_log;
DROP POLICY IF EXISTS ai_usage_logs_admin_read ON public.ai_usage_logs;
DROP POLICY IF EXISTS system_errors_admin_read ON public.system_errors;

-- Admin read-only RLS policies
CREATE POLICY admin_audit_log_admin_read ON public.admin_audit_log
  FOR SELECT
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY ai_usage_logs_admin_read ON public.ai_usage_logs
  FOR SELECT
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY system_errors_admin_read ON public.system_errors
  FOR SELECT
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );
