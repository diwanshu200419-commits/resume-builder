-- ============================================================================
-- Vaylo AI — Profile Hardening, Notifications & Feature Usage Migration
-- Migration Date: 2026-08-03
-- Description: Adds profile onboarding fields, notifications table,
--              feature_usage_daily table (wide column format), updated
--              protect_profile_fields trigger, and backfills career_profiles
--              data into profiles.
-- ============================================================================

-- ============================================================================
-- 1. ADD NEW COLUMNS TO public.profiles
-- ============================================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS headline TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_role TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_role TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience_level TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}'::TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- ============================================================================
-- 2. CREATE public.notifications TABLE + INDEXES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info','ats','plan','interview','job','system')),
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(user_id, read);

-- ============================================================================
-- 3. RLS & POLICIES FOR public.notifications
-- ============================================================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;
CREATE POLICY "Users can insert own notifications" ON public.notifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role full access to notifications" ON public.notifications;
CREATE POLICY "Service role full access to notifications" ON public.notifications
  FOR ALL
  USING (current_setting('role') = 'service_role');

-- ============================================================================
-- 4. CREATE public.feature_usage_daily TABLE (wide column format) + RLS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.feature_usage_daily (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  ats_scans INT DEFAULT 0,
  bullet_rewrites INT DEFAULT 0,
  linkedin_opts INT DEFAULT 0,
  career_coach INT DEFAULT 0,
  interview_sims INT DEFAULT 0,
  portfolio_builds INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

ALTER TABLE public.feature_usage_daily ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own feature usage daily" ON public.feature_usage_daily;
CREATE POLICY "Users can view own feature usage daily" ON public.feature_usage_daily
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role full access to feature_usage_daily" ON public.feature_usage_daily;
CREATE POLICY "Service role full access to feature_usage_daily" ON public.feature_usage_daily
  FOR ALL
  USING (current_setting('role') = 'service_role');

-- ============================================================================
-- 5. RECREATE protect_profile_fields() TRIGGER FUNCTION
--    Allowed (client-editable):
--      phone, location, headline, current_role, target_role,
--      experience_level, industry, skills, preferred_location,
--      full_name, avatar_url, onboarding_completed
--    Blocked (service_role only):
--      plan, role, analyses_used, analyses_limit, subscription_status,
--      id, email, current_period_start, current_period_end, expires_at,
--      total_ats_checks, total_resume_downloads
-- ============================================================================
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF (current_setting('role') <> 'service_role') THEN
    IF (NEW.plan IS DISTINCT FROM OLD.plan) OR
       (NEW.role IS DISTINCT FROM OLD.role) OR
       (NEW.analyses_used IS DISTINCT FROM OLD.analyses_used) OR
       (NEW.analyses_limit IS DISTINCT FROM OLD.analyses_limit) OR
       (NEW.subscription_status IS DISTINCT FROM OLD.subscription_status) OR
       (NEW.id IS DISTINCT FROM OLD.id) OR
       (NEW.email IS DISTINCT FROM OLD.email) OR
       (NEW.current_period_start IS DISTINCT FROM OLD.current_period_start) OR
       (NEW.current_period_end IS DISTINCT FROM OLD.current_period_end) OR
       (NEW.expires_at IS DISTINCT FROM OLD.expires_at) OR
       (NEW.total_ats_checks IS DISTINCT FROM OLD.total_ats_checks) OR
       (NEW.total_resume_downloads IS DISTINCT FROM OLD.total_resume_downloads) THEN
      RAISE EXCEPTION 'Unauthorized to modify sensitive fields';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_update ON public.profiles;
CREATE TRIGGER on_profile_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_fields();

-- ============================================================================
-- 6. BACKFILL: Copy career_profiles fields into profiles for existing users
--    career_profiles.skills is JSONB; coerce to TEXT[] via jsonb_array_elements_text
--    Only update if the target profile column is NULL (do not overwrite)
-- ============================================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'career_profiles'
  ) THEN
    UPDATE public.profiles p
    SET
      current_role = cp.current_role,
      target_role = cp.target_role,
      experience_level = cp.experience_level,
      industry = cp.industry,
      skills = (
        SELECT ARRAY_AGG(elem ORDER BY ordinality)
        FROM jsonb_array_elements_text(COALESCE(cp.skills, '[]'::jsonb)) WITH ORDINALITY AS t(elem, ordinality)
      )
    FROM public.career_profiles cp
    WHERE cp.user_id = p.id
      AND p.current_role IS NULL
      AND cp.current_role IS NOT NULL;
  END IF;
END $$;
