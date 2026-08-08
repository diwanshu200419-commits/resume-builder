-- Migration: interview_question_cache
-- Creates shared cache table for AI generated interview question sets

CREATE TABLE IF NOT EXISTS public.interview_question_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_normalized text NOT NULL,
  seniority text NOT NULL,
  company_style text, -- null = general/no company
  question_set jsonb NOT NULL,
  hit_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (role_normalized, seniority, company_style)
);

CREATE INDEX IF NOT EXISTS idx_interview_cache_lookup 
  ON public.interview_question_cache (role_normalized, seniority, company_style);

-- Note: No RLS row-level security policy is applied as this table is shared across all tenants
-- and accessed exclusively via server-side service role client.
