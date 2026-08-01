-- Vaylo AI — Migration 02: Add role, expires_at, last_seen_at columns
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ofirvweirnjgsyyedkci/sql

-- 1. Add missing columns to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Promote admin accounts to role = 'admin' and career_pack plan
-- IMPORTANT: This replaces the hardcoded email check.
-- After this runs, /api/admin/verify checks profile.role === 'admin', not a list.
UPDATE profiles
SET role = 'admin', plan = 'career_pack', subscription_status = 'active'
WHERE email IN (
  'jattshiv32@gmail.com',
  'diwanshu200419@gmail.com',
  'admin@vaylo.ai'
);

-- 3. Index last_seen_at for efficient activity-window queries
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen_at ON profiles(last_seen_at);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON profiles(plan);

-- 4. Trigger to auto-update last_seen_at on profile read/update
-- (Optional — alternatively update it from the /api/profile endpoint)
-- CREATE OR REPLACE FUNCTION update_last_seen()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.last_seen_at = NOW();
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
-- DROP TRIGGER IF EXISTS trg_update_last_seen ON profiles;
-- CREATE TRIGGER trg_update_last_seen
--   BEFORE UPDATE ON profiles
--   FOR EACH ROW EXECUTE FUNCTION update_last_seen();
