-- ResumeAI Database Schema
-- Run this in your Supabase SQL Editor

-- Users (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free',
  analyses_used INT DEFAULT 0,
  analyses_limit INT DEFAULT 2,
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  subscription_status TEXT DEFAULT 'active',
  total_ats_checks INT DEFAULT 0,
  total_resume_downloads INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resume analyses
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

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  upi_ref TEXT,
  utr TEXT,
  plan TEXT,
  amount INT,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending', -- pending | completed
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  screenshot_url TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Usage Logs
CREATE TABLE IF NOT EXISTS ai_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  tokens_used INT DEFAULT 0,
  feature TEXT NOT NULL, -- "ats", "optimize", "cover_letter", "interview", "linkedin"
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on ai_logs
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;

-- AI Logs RLS: Users can only view their own logs
CREATE POLICY "Users can view own AI logs" ON ai_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Only service role can insert/update AI logs
CREATE POLICY "Only service role can write AI logs" ON ai_logs
  FOR ALL USING (current_setting('role') = 'service_role');

-- Career Profiles (AI Memory)
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

ALTER TABLE career_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own career profile" ON career_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own career profile" ON career_profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own career profile" ON career_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role can manage all career profiles" ON career_profiles
  FOR ALL USING (current_setting('role') = 'service_role');

-- Career Scores History
CREATE TABLE IF NOT EXISTS career_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  overall_score INT NOT NULL,
  resume_score INT NOT NULL,
  skills_score INT NOT NULL,
  projects_score INT NOT NULL,
  experience_score INT NOT NULL,
  linkedin_score INT NOT NULL,
  month TEXT NOT NULL, -- format: YYYY-MM
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, month)
);

ALTER TABLE career_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own career scores" ON career_scores
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all career scores" ON career_scores
  FOR ALL USING (current_setting('role') = 'service_role');

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  renewal_date TIMESTAMPTZ,
  razorpay_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all subscriptions" ON subscriptions
  FOR ALL USING (current_setting('role') = 'service_role');

-- Auto-create profile, career profile, and subscription on signup
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

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view own profile, but only update non-sensitive fields
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- We'll use a trigger to prevent users from updating sensitive fields like 'plan'
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Function to protect sensitive profile fields
CREATE OR REPLACE FUNCTION protect_profile_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- If not using service role, prevent changing sensitive fields
  IF (current_setting('role') <> 'service_role') THEN
    IF (NEW.plan IS DISTINCT FROM OLD.plan) OR
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

CREATE TRIGGER on_profile_update
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION protect_profile_fields();

-- Analyses: Users can ONLY select and delete their own analyses
-- They should NOT be able to manually update scores
CREATE POLICY "Users can view own analyses" ON analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses" ON analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only allow updating optimized_resume_text (for editing)
CREATE POLICY "Users can update own analyses" ON analyses
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    (status = OLD.status) AND
    (original_ats_score = OLD.original_ats_score)
  );

CREATE POLICY "Users can delete own analyses" ON analyses
  FOR DELETE USING (auth.uid() = user_id);

-- Payments: Users can view, but NOT update or insert directly (must use API)
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own pending UPI payment request
CREATE POLICY "Users can create own pending payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'pending' AND plan IN ('pro', 'premium'));

-- Users can submit their payment proof (UTR + screenshot) for their own
-- pending payment. The API route auto-activates the plan once the proof
-- is submitted (status -> 'completed').
CREATE POLICY "Users can submit proof for own pending payments" ON payments
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'completed');

-- Disable direct insert/update for users to prevent fake payments
-- API routes will use Service Role to manage payments
ALTER TABLE payments FORCE ROW LEVEL SECURITY;

-- ===================================================================
-- Payment proof screenshots storage bucket
-- ===================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Users can upload their own payment screenshots
CREATE POLICY "Users can upload own payment proofs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can view their own uploaded screenshots
CREATE POLICY "Users can view own payment proofs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]
  );
