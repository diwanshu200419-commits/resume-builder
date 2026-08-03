-- Migration: Hardened Fair-Use Engine with Atomic ON CONFLICT, UTC Date, and Failure Refund
CREATE TABLE IF NOT EXISTS feature_usage_daily (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  usage_date date NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::date,
  usage_count int NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT feature_usage_daily_unique UNIQUE (user_id, feature_key, usage_date)
);

-- Enable RLS
ALTER TABLE feature_usage_daily ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own daily feature usage" ON feature_usage_daily;
CREATE POLICY "Users can read own daily feature usage"
  ON feature_usage_daily FOR SELECT
  USING (auth.uid() = user_id);

-- Atomic Postgres Function using ON CONFLICT DO NOTHING + FOR UPDATE
CREATE OR REPLACE FUNCTION consume_feature_usage(
  p_user_id uuid,
  p_feature_key text,
  p_daily_limit int
) RETURNS TABLE(allowed boolean, current_count int, remaining int) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_today date := (now() AT TIME ZONE 'UTC')::date;
  v_current int;
BEGIN
  -- Security check: Auth caller cannot manipulate another user's quota unless service_role
  IF auth.uid() IS NOT NULL AND auth.uid() != p_user_id AND current_setting('role', true) != 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized user ID quota operation';
  END IF;

  -- Ensure row exists atomically using ON CONFLICT DO NOTHING
  INSERT INTO feature_usage_daily (user_id, feature_key, usage_date, usage_count)
  VALUES (p_user_id, p_feature_key, v_today, 0)
  ON CONFLICT (user_id, feature_key, usage_date) DO NOTHING;

  -- Lock row for update
  SELECT usage_count INTO v_current
  FROM feature_usage_daily
  WHERE user_id = p_user_id AND feature_key = p_feature_key AND usage_date = v_today
  FOR UPDATE;

  IF v_current < p_daily_limit THEN
    UPDATE feature_usage_daily
    SET usage_count = usage_count + 1, updated_at = now()
    WHERE user_id = p_user_id AND feature_key = p_feature_key AND usage_date = v_today;
    
    RETURN QUERY SELECT true, v_current + 1, GREATEST(0, p_daily_limit - (v_current + 1));
  ELSE
    RETURN QUERY SELECT false, v_current, 0;
  END IF;
END;
$$;

-- Revoke public EXECUTE on consume_feature_usage to prevent direct client RPC tampering
REVOKE EXECUTE ON FUNCTION consume_feature_usage(uuid, text, int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION consume_feature_usage(uuid, text, int) TO service_role;

-- Atomic Refund Function for Failed AI Calls
CREATE OR REPLACE FUNCTION refund_feature_usage(
  p_user_id uuid,
  p_feature_key text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_today date := (now() AT TIME ZONE 'UTC')::date;
BEGIN
  UPDATE feature_usage_daily
  SET usage_count = GREATEST(0, usage_count - 1), updated_at = now()
  WHERE user_id = p_user_id AND feature_key = p_feature_key AND usage_date = v_today;
END;
$$;

REVOKE EXECUTE ON FUNCTION refund_feature_usage(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION refund_feature_usage(uuid, text) TO service_role;
