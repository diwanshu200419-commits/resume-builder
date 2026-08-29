-- ============================================================
-- VAYLO AI — Create notifications table + correct RLS policies
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. CREATE TABLE (safe — won't fail if already exists)
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  body        TEXT        NOT NULL DEFAULT '',
  type        TEXT        NOT NULL DEFAULT 'general',
  link        TEXT,
  read        BOOLEAN     NOT NULL DEFAULT false,
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ADD COLUMNS IF MIGRATING FROM OLDER SCHEMA
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS body     TEXT        NOT NULL DEFAULT '';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS type     TEXT        NOT NULL DEFAULT 'general';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS link     TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS read     BOOLEAN     NOT NULL DEFAULT false;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS read_at  TIMESTAMPTZ;

-- 3. DROP old broken type constraint if it exists, then recreate
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check CHECK (
  type IN (
    'general', 'admin_broadcast', 'system', 'admin_announcement',
    'scan_complete', 'payment_approved', 'payment_rejected',
    'payment_pending', 'feedback_replied', 'ticket_created',
    'ticket_reply', 'ticket_updated', 'ticket_resolved',
    'plan_expiring', 'info', 'ats', 'plan', 'interview', 'job', 'trend'
  )
);

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_notifications_user_id    ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read  ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- 5. ENABLE RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 6. DROP ALL OLD POLICIES (clean slate)
DROP POLICY IF EXISTS "Service role can manage all notifications"   ON public.notifications;
DROP POLICY IF EXISTS "Service role full access to notifications"   ON public.notifications;
DROP POLICY IF EXISTS "Admins can insert notifications"             ON public.notifications;
DROP POLICY IF EXISTS "Users can insert own notifications"          ON public.notifications;
DROP POLICY IF EXISTS "Users can view own notifications"            ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications"          ON public.notifications;

-- 7. CORRECT RLS POLICIES

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can mark their own notifications read
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Service role gets full unrestricted access
-- (TO service_role bypasses RLS for supabase-js service role client)
CREATE POLICY "Service role full access to notifications"
ON public.notifications FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Admins can insert for any user
CREATE POLICY "Admins can insert notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  )
);

-- 8. ADD TO REALTIME (safe — ignores duplicate)
DO 
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END ;

-- Verify: should return the new table
SELECT table_schema, table_name, table_type
FROM information_schema.tables
WHERE table_name = 'notifications';
