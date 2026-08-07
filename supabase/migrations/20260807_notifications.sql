-- ====================================================================
-- VAYLO AI — NOTIFICATIONS SYSTEM MIGRATION (2026-08-07)
-- Includes notifications table, RLS policies, indexes, and Realtime
-- ====================================================================

-- 1. Create notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- 'scan_complete', 'payment_approved', 'payment_rejected', 'feedback_replied', 'plan_expiring', 'admin_announcement'
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    link TEXT,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for high-performance notification feeds
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON public.notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Candidates can ONLY view their own notifications
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

-- Candidates can ONLY update their own notifications (e.g. mark read)
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Service role can manage all notifications (triggers & admin broadcasts)
CREATE POLICY "Service role can manage all notifications"
ON public.notifications FOR ALL
USING (current_setting('role') = 'service_role');

-- Admins can insert announcements across users
CREATE POLICY "Admins can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ) OR current_setting('role') = 'service_role'
);

-- 2. Add notifications to Supabase Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- 3. Explicit Admin SELECT policy on profiles for safe Realtime admin feeds
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    ) OR auth.uid() = id
  );
