-- ====================================================================
-- VAYLO AI — ADMIN PANEL UPGRADE MIGRATION (2026-08-07)
-- Includes user_feedback table, RLS policies, and Realtime enablement
-- ====================================================================

-- 1. Create user_feedback Table
CREATE TABLE IF NOT EXISTS public.user_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general', -- 'bug', 'billing', 'feature', 'complaint', 'general'
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'resolved'
    admin_response TEXT,
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast user and status queries
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON public.user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_status ON public.user_feedback(status);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON public.user_feedback(created_at DESC);

-- Enable RLS on user_feedback
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Candidates can insert their own feedback
CREATE POLICY "Users can insert their own feedback"
ON public.user_feedback FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Candidates can view their own feedback
CREATE POLICY "Users can select their own feedback"
ON public.user_feedback FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all feedback
CREATE POLICY "Admins can select all feedback"
ON public.user_feedback FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Admins can update any feedback (add admin_response, change status)
CREATE POLICY "Admins can update feedback"
ON public.user_feedback FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 2. Enable Realtime on key tables for live admin notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_feedback;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- 3. Ensure payment_requests has RLS configured for admin realtime
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can select all payment requests" ON public.payment_requests;
CREATE POLICY "Admins can select all payment requests"
ON public.payment_requests FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ) OR auth.uid() = user_id
);
