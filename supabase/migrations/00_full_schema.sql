-- ============================================================================
-- Vaylo AI — FULL SCHEMA (Run ONCE in Supabase SQL Editor)
-- Project: ofirvweirnjgsyyedkci
-- URL: https://supabase.com/dashboard/project/ofirvweirnjgsyyedkci/sql
--
-- This creates ALL tables from scratch. Do NOT run if tables already exist
-- (use IF NOT EXISTS to be safe, but verify afterwards).
-- ============================================================================

-- ============================================================================
-- TABLE 1: profiles (extends auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free',
  role TEXT DEFAULT 'user',
  analyses_used INT DEFAULT 0,
  analyses_limit INT DEFAULT 2,
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ,
  subscription_status TEXT DEFAULT 'active',
  total_ats_checks INT DEFAULT 0,
  total_resume_downloads INT DEFAULT 0,
  expires_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE 2: analyses (resume ATS scans)
-- ============================================================================
CREATE TABLE IF NOT EXISTS analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  original_resume_text TEXT,
  job_description TEXT,
  job_title TEXT,
  original_ats_score INT,
  optimized_ats_score INT,
  missing_keywords TEXT[],
  weak_sections TEXT[],
  optimized_resume_text TEXT,
  before_summary TEXT,
  after_summary TEXT,
  before_skills TEXT,
  after_skills TEXT,
  before_experience TEXT,
  after_experience TEXT,
  cover_letter TEXT,
  interview_questions JSONB,
  linkedin_suggestions JSONB,
  keyword_match_score INT,
  skills_match_score INT,
  readability_score INT,
  format_score INT,
  optimized_keyword_match INT,
  optimized_skills_match INT,
  optimized_readability INT,
  optimized_format INT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE 3: payments (original UPI payment records, used by /api/payment/upi/create)
-- ============================================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  upi_ref TEXT,
  utr TEXT,
  plan TEXT,
  amount INT,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending',
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  screenshot_url TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE 4: payment_requests (manual UPI verification queue, used by admin panel)
-- ============================================================================
CREATE TABLE IF NOT EXISTS payment_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  requested_plan TEXT NOT NULL,
  amount_claimed NUMERIC NOT NULL,
  utr_number TEXT NOT NULL,
  screenshot_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- TABLE 5: ai_logs
-- ============================================================================
CREATE TABLE IF NOT EXISTS ai_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  tokens_used INT DEFAULT 0,
  feature TEXT NOT NULL,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE 6: career_profiles (AI memory per user)
-- ============================================================================
CREATE TABLE IF NOT EXISTS career_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  current_role TEXT,
  target_role TEXT,
  experience_level TEXT,
  industry TEXT,
  skills JSONB DEFAULT '[]',
  career_goals JSONB DEFAULT '[]',
  weak_areas JSONB DEFAULT '[]',
  strengths JSONB DEFAULT '[]',
  preferred_jobs JSONB DEFAULT '[]',
  learning_history JSONB DEFAULT '[]',
  last_ai_summary TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE 7: career_scores (monthly score history)
-- ============================================================================
CREATE TABLE IF NOT EXISTS career_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  overall_score INT NOT NULL,
  resume_score INT NOT NULL,
  skills_score INT NOT NULL,
  projects_score INT NOT NULL,
  experience_score INT NOT NULL,
  linkedin_score INT NOT NULL,
  month TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, month)
);

-- ============================================================================
-- TABLE 8: subscriptions (legacy, referenced by signup trigger)
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  renewal_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role full access to profiles" ON profiles
  FOR ALL USING (current_setting('role') = 'service_role');

-- analyses
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses" ON analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses" ON analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses" ON analyses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses" ON analyses
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to analyses" ON analyses
  FOR ALL USING (current_setting('role') = 'service_role');

-- payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own pending payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Service role full access to payments" ON payments
  FOR ALL USING (current_setting('role') = 'service_role');

-- payment_requests
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment requests" ON payment_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment requests" ON payment_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update payment requests" ON payment_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Service role full access to payment_requests" ON payment_requests
  FOR ALL USING (current_setting('role') = 'service_role');

-- ai_logs
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI logs" ON ai_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to ai_logs" ON ai_logs
  FOR ALL USING (current_setting('role') = 'service_role');

-- career_profiles
ALTER TABLE career_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own career profile" ON career_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own career profile" ON career_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own career profile" ON career_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access to career_profiles" ON career_profiles
  FOR ALL USING (current_setting('role') = 'service_role');

-- career_scores
ALTER TABLE career_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own career scores" ON career_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to career_scores" ON career_scores
  FOR ALL USING (current_setting('role') = 'service_role');

-- subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to subscriptions" ON subscriptions
  FOR ALL USING (current_setting('role') = 'service_role');


-- ============================================================================
-- TRIGGER: Auto-create profile + career_profile + subscription on signup
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO public.career_profiles (user_id)
  VALUES (NEW.id);

  INSERT INTO public.subscriptions (user_id, plan, status, start_date)
  VALUES (NEW.id, 'free', 'active', NOW());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- TRIGGER: Protect sensitive profile fields from client-side updates
-- ============================================================================
CREATE OR REPLACE FUNCTION protect_profile_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF (current_setting('role') <> 'service_role') THEN
    IF (NEW.plan IS DISTINCT FROM OLD.plan) OR
       (NEW.role IS DISTINCT FROM OLD.role) OR
       (NEW.analyses_used IS DISTINCT FROM OLD.analyses_used) OR
       (NEW.analyses_limit IS DISTINCT FROM OLD.analyses_limit) OR
       (NEW.id IS DISTINCT FROM OLD.id) OR
       (NEW.email IS DISTINCT FROM OLD.email) THEN
      RAISE EXCEPTION 'Unauthorized to modify sensitive fields';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_update ON profiles;
CREATE TRIGGER on_profile_update
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION protect_profile_fields();


-- ============================================================================
-- INDEXES (performance)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON profiles(plan);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen_at ON profiles(last_seen_at);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_user_id ON payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON payment_requests(status);


-- ============================================================================
-- STORAGE: Payment proof screenshots bucket
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own payment proofs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own payment proofs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]
  );


-- ============================================================================
-- UTR uniqueness constraint (prevents double-submit of same UTR)
-- ============================================================================
ALTER TABLE payment_requests
  ADD CONSTRAINT uq_utr_per_user UNIQUE (utr_number, user_id);


-- ============================================================================
-- SEED: Backfill profiles for any existing auth.users that signed up
-- before this schema existed (they have no profiles row yet)
-- ============================================================================
INSERT INTO profiles (id, email, full_name, avatar_url)
SELECT
  u.id,
  u.email,
  u.raw_user_meta_data->>'full_name',
  u.raw_user_meta_data->>'avatar_url'
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE p.id IS NULL;


-- ============================================================================
-- SEED: Promote admin accounts
-- Run AFTER backfill so the profiles rows exist
-- ============================================================================
UPDATE profiles
SET role = 'admin', plan = 'career_pack', subscription_status = 'active'
WHERE email IN (
  'jattshiv32@gmail.com',
  'diwanshu200419@gmail.com'
);


-- ============================================================================
-- VERIFICATION QUERY — Run this separately after the migration completes:
--
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
--
-- Expected result: 8 rows:
--   profiles, analyses, payments, payment_requests, ai_logs,
--   career_profiles, career_scores, subscriptions
-- ============================================================================
