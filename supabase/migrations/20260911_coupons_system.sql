-- Migration: 20260911_coupons_system.sql
-- Description: Admin-Managed Coupon System with Atomic Redemption & RLS

CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'all',
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed', 'free_months')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  duration_months INTEGER NOT NULL DEFAULT 1 CHECK (duration_months >= 1),
  max_redemptions INTEGER NOT NULL DEFAULT 100 CHECK (max_redemptions >= 1),
  times_redeemed INTEGER NOT NULL DEFAULT 0 CHECK (times_redeemed >= 0),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  plan TEXT NOT NULL,
  discount_applied NUMERIC NOT NULL DEFAULT 0,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_coupon UNIQUE (coupon_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons (UPPER(code));
CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons (is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_user ON public.coupon_redemptions (user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_coupon ON public.coupon_redemptions (coupon_id);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coupons' AND policyname = 'Admins full access on coupons') THEN
    CREATE POLICY "Admins full access on coupons"
      ON public.coupons
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coupon_redemptions' AND policyname = 'Admins view all redemptions') THEN
    CREATE POLICY "Admins view all redemptions"
      ON public.coupon_redemptions
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coupon_redemptions' AND policyname = 'Users view own redemptions') THEN
    CREATE POLICY "Users view own redemptions"
      ON public.coupon_redemptions
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.redeem_coupon_atomic(
  p_code TEXT,
  p_user_id UUID,
  p_user_email TEXT,
  p_plan TEXT,
  p_discount_applied NUMERIC
) RETURNS JSONB AS $$
DECLARE
  v_coupon public.coupons%ROWTYPE;
  v_normalized_plan TEXT;
BEGIN
  v_normalized_plan := LOWER(p_plan);
  IF v_normalized_plan = 'career' OR v_normalized_plan = 'career-pack' THEN
    v_normalized_plan := 'career_pack';
  END IF;

  SELECT * INTO v_coupon
  FROM public.coupons
  WHERE UPPER(code) = UPPER(p_code)
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Coupon code not found.');
  END IF;

  IF NOT v_coupon.is_active THEN
    RETURN jsonb_build_object('success', false, 'error', 'This coupon is no longer active.');
  END IF;

  IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < NOW() THEN
    RETURN jsonb_build_object('success', false, 'error', 'This coupon has expired.');
  END IF;

  IF v_coupon.times_redeemed >= v_coupon.max_redemptions THEN
    RETURN jsonb_build_object('success', false, 'error', 'This coupon has reached its maximum redemption limit.');
  END IF;

  IF v_coupon.plan <> 'all' AND LOWER(v_coupon.plan) <> v_normalized_plan THEN
    RETURN jsonb_build_object('success', false, 'error', 'This coupon is not valid for the selected plan.');
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.coupon_redemptions
    WHERE coupon_id = v_coupon.id AND user_id = p_user_id
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'You have already redeemed this coupon.');
  END IF;

  INSERT INTO public.coupon_redemptions (
    coupon_id,
    user_id,
    user_email,
    plan,
    discount_applied
  ) VALUES (
    v_coupon.id,
    p_user_id,
    p_user_email,
    v_normalized_plan,
    p_discount_applied
  );

  UPDATE public.coupons
  SET times_redeemed = times_redeemed + 1
  WHERE id = v_coupon.id;

  RETURN jsonb_build_object(
    'success', true,
    'coupon_id', v_coupon.id,
    'code', v_coupon.code,
    'discount_type', v_coupon.discount_type,
    'discount_value', v_coupon.discount_value,
    'duration_months', v_coupon.duration_months,
    'times_redeemed', v_coupon.times_redeemed + 1,
    'max_redemptions', v_coupon.max_redemptions
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
