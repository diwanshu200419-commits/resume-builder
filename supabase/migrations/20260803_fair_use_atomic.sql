-- Migration: Create feature_usage_daily table and atomic consume_feature_usage function
CREATE TABLE IF NOT EXISTS feature_usage_daily (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  usage_date date NOT NULL DEFAULT CURRENT_DATE,
  usage_count int NOT NULL DEFAULT 1,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, feature_key, usage_date)
);

-- Enable RLS
ALTER TABLE feature_usage_daily ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own daily feature usage"
  ON feature_usage_daily FOR SELECT
  USING (auth.uid() = user_id);

-- Atomic Postgres Function using Row-Level Locking (FOR UPDATE)
CREATE OR REPLACE FUNCTION consume_feature_usage(
  p_user_id uuid,
  p_feature_key text,
  p_daily_limit int
) RETURNS TABLE(allowed boolean, current_count int, remaining int) AS $$
DECLARE
  v_current int;
BEGIN
  -- Row-level lock for this user+feature+date to prevent parallel race conditions
  SELECT usage_count INTO v_current
  FROM feature_usage_daily
  WHERE user_id = p_user_id AND feature_key = p_feature_key
    AND usage_date = CURRENT_DATE
  FOR UPDATE;

  IF v_current IS NULL THEN
    INSERT INTO feature_usage_daily (user_id, feature_key, usage_date, usage_count)
    VALUES (p_user_id, p_feature_key, CURRENT_DATE, 1);
    RETURN QUERY SELECT true, 1, GREATEST(0, p_daily_limit - 1);
  ELSIF v_current < p_daily_limit THEN
    UPDATE feature_usage_daily
    SET usage_count = usage_count + 1, updated_at = now()
    WHERE user_id = p_user_id AND feature_key = p_feature_key AND usage_date = CURRENT_DATE;
    RETURN QUERY SELECT true, v_current + 1, GREATEST(0, p_daily_limit - v_current - 1);
  ELSE
    RETURN QUERY SELECT false, v_current, 0;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
