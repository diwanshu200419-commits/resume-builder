-- Vaylo AI — Complete Database Migration Script
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/ofirvweirnjgsyyedkci/sql)

-- 1. Add role & subscription expiration columns to profiles table
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Create payment_requests table for Manual UPI Verification
CREATE TABLE IF NOT EXISTS payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Enable RLS on payment_requests
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own payment requests
CREATE POLICY "Users can view own payment requests" 
  ON payment_requests FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own payment requests
CREATE POLICY "Users can insert own payment requests" 
  ON payment_requests FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Only Admins can update payment requests
CREATE POLICY "Admins can update payment requests" 
  ON payment_requests FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 3. Grant Admin Role & Unlimited Lifetime Plan to Admin Accounts
UPDATE profiles 
SET role = 'admin', plan = 'career_pack', subscription_status = 'active'
WHERE email IN (
  'jattshiv32@gmail.com',
  'diwanshu200419@gmail.com',
  'admin@vaylo.ai'
);
