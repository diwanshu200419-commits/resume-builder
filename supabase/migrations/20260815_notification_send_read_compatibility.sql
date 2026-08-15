-- VAYLO AI - Notification send/read compatibility migration (2026-08-15)
-- Normalizes the app-facing notification shape to body + read while preserving
-- legacy message/read_at columns from earlier production migrations.

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'general',
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS body TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS read BOOLEAN;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS link TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'notifications'
      AND column_name = 'message'
  ) THEN
    UPDATE public.notifications
    SET body = COALESCE(NULLIF(body, ''), NULLIF(message, ''), title, 'Notification')
    WHERE body IS NULL OR body = '';
  END IF;
END $$;

UPDATE public.notifications
SET body = COALESCE(NULLIF(body, ''), title, 'Notification')
WHERE body IS NULL OR body = '';

UPDATE public.notifications
SET read = COALESCE(read, false) OR read_at IS NOT NULL
WHERE read IS NULL OR read_at IS NOT NULL;

UPDATE public.notifications
SET type = 'general'
WHERE type IS NULL OR type = '';

ALTER TABLE public.notifications ALTER COLUMN body SET DEFAULT '';
ALTER TABLE public.notifications ALTER COLUMN body SET NOT NULL;
ALTER TABLE public.notifications ALTER COLUMN read SET DEFAULT false;
ALTER TABLE public.notifications ALTER COLUMN read SET NOT NULL;
ALTER TABLE public.notifications ALTER COLUMN type SET DEFAULT 'general';
ALTER TABLE public.notifications ALTER COLUMN type SET NOT NULL;

ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_type_check
  CHECK (
    type IN (
      'general',
      'admin_broadcast',
      'system',
      'admin_announcement',
      'scan_complete',
      'payment_approved',
      'payment_rejected',
      'payment_pending',
      'feedback_replied',
      'ticket_created',
      'ticket_reply',
      'ticket_updated',
      'ticket_resolved',
      'plan_expiring',
      'info',
      'ats',
      'plan',
      'interview',
      'job',
      'trend'
    )
  );

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;

DROP POLICY IF EXISTS "Service role full access to notifications" ON public.notifications;
DROP POLICY IF EXISTS "Service role can manage all notifications" ON public.notifications;
CREATE POLICY "Service role can manage all notifications"
ON public.notifications FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;
CREATE POLICY "Admins can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (
  auth.role() = 'service_role'
  OR EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  )
);

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
