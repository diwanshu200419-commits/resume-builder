-- VAYLO AI — Fix Notifications RLS for Service Role (2026-08-21)
-- Root cause: auth.role() = 'service_role' does NOT work for supabase-js
-- service role clients. Service role key bypasses RLS only when the
-- policy grants it via TO service_role clause.

-- 1. DROP ALL EXISTING NOTIFICATION POLICIES
DROP POLICY IF EXISTS "Service role can manage all notifications" ON public.notifications;
DROP POLICY IF EXISTS "Service role full access to notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

-- 2. RECREATE CORRECTLY

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can mark their own notifications as read
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Service role gets full unrestricted access
-- TO service_role means no USING/WITH CHECK predicate needed
CREATE POLICY "Service role full access to notifications"
ON public.notifications FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Admins (role='admin') can insert for any user
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
