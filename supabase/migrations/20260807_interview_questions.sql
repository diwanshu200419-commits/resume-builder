-- ====================================================================
-- VAYLO AI — INTERVIEW QUESTION BANK MIGRATION (2026-08-07)
-- Includes interview_questions table, indexes, RLS, and seed bank
-- ====================================================================

-- 1. Create interview_questions Table
CREATE TABLE IF NOT EXISTS public.interview_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_category TEXT NOT NULL, -- 'software_engineering', 'product_management', 'data_science', 'design', 'sales', 'finance', 'leadership'
    sub_role TEXT NOT NULL DEFAULT 'general', -- 'frontend', 'backend', 'fullstack', 'ml', 'infra', 'data', 'general'
    company_tag TEXT DEFAULT 'faang_style', -- 'google_style', 'amazon_style', 'meta_style', 'apple_style', 'netflix_style', 'faang_style'
    question_type TEXT NOT NULL DEFAULT 'behavioral', -- 'behavioral', 'technical', 'system_design', 'case_study'
    difficulty TEXT NOT NULL DEFAULT 'medium', -- 'easy', 'medium', 'hard'
    question_text TEXT NOT NULL,
    ideal_answer_structure JSONB NOT NULL DEFAULT '{}'::jsonb, -- { "situation": "...", "action": "...", "result": "..." }
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for ultra-fast role & subrole question selection
CREATE INDEX IF NOT EXISTS idx_interview_questions_role ON public.interview_questions(role_category, sub_role);
CREATE INDEX IF NOT EXISTS idx_interview_questions_type ON public.interview_questions(question_type);

-- Enable RLS
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;

-- Allow candidates to view interview questions
CREATE POLICY "Anyone can view interview questions"
ON public.interview_questions FOR SELECT
USING (true);

-- Only service role and admin can modify questions
CREATE POLICY "Service role can manage interview questions"
ON public.interview_questions FOR ALL
USING (current_setting('role') = 'service_role');

-- 2. Seed Real FAANG-Style Paraphrased Interview Questions
INSERT INTO public.interview_questions (role_category, sub_role, company_tag, question_type, difficulty, question_text, ideal_answer_structure, tags)
VALUES
-- Software Engineering (Frontend / Backend / System Design / Behavioral)
('software_engineering', 'frontend', 'google_style', 'technical', 'medium',
 'Describe how you would optimize the rendering performance and initial load time of a complex React web application with dynamic dashboards.',
 '{"situation": "Large web app loading slowly due to bundle size and unoptimized re-renders.", "action": "Applied code splitting via React.lazy, memoized heavy components, implemented virtualized lists, and optimized critical CSS.", "result": "Reduced LCP by 45% and boosted Lighthouse performance score from 62 to 94."}'::jsonb,
 ARRAY['react', 'performance', 'frontend']),

('software_engineering', 'backend', 'amazon_style', 'behavioral', 'medium',
 'Tell me about a time when a production service under your ownership experienced unexpected traffic surges. How did you diagnose and resolve the issue?',
 '{"situation": "Black Friday traffic surge caused database connection exhaustion in microservices.", "action": "Implemented Redis caching layer, added circuit breakers, auto-scaled worker pods, and optimized query indexes.", "result": "Maintained 99.99% availability with zero data loss during peak load."}'::jsonb,
 ARRAY['amazon_principles', 'scalability', 'backend']),

('software_engineering', 'fullstack', 'meta_style', 'system_design', 'hard',
 'How would you design a real-time collaborative document editor (like Google Docs) supporting concurrent edits and offline sync?',
 '{"situation": "Need conflict resolution and low latency for simultaneous user edits.", "action": "Architected Operational Transformation (OT) / CRDT data structures with WebSocket pub-sub and IndexedDB offline queue.", "result": "Achieved sub-50ms sync latency with seamless offline reconnection."}'::jsonb,
 ARRAY['system_design', 'websockets', 'fullstack']),

('software_engineering', 'ml', 'apple_style', 'technical', 'hard',
 'How do you detect and mitigate feature drift or model degradation in a real-time recommendation engine deployed in production?',
 '{"situation": "Model precision dropped 12% over 3 months due to evolving user preference patterns.", "action": "Set up automated Kolmogorov-Smirnov drift monitoring, automated shadow deployments, and weekly re-training pipelines.", "result": "Restored recommendation accuracy and automated retraining triggers."}'::jsonb,
 ARRAY['machine_learning', 'mlops', 'data']),

-- Product Management
('product_management', 'general', 'google_style', 'case_study', 'hard',
 'How would you measure the success of Google Photos, and what feature would you prioritize next to drive user retention?',
 '{"situation": "Need to balance storage monetization with daily active engagement.", "action": "Defined core metric (weekly memory shares per user), analyzed churn funnel, and prioritized AI semantic search.", "result": "Drove 18% increase in 30-day user retention."}'::jsonb,
 ARRAY['product_metrics', 'strategy', 'pm']),

('product_management', 'general', 'amazon_style', 'behavioral', 'medium',
 'Give an example of a situation where you had to make a high-stakes product decision without complete data. What framework did you use?',
 '{"situation": "Incomplete telemetry data on legacy checkout flow before major campaign launch.", "action": "Used 2-way door decision framework, ran rapid 50-user qualitative usability tests, and launched behind a feature flag.", "result": "Successfully launched on schedule with 14% conversion lift."}'::jsonb,
 ARRAY['bias_for_action', 'customer_obsession', 'pm']),

-- Data Science & Analytics
('data_science', 'data', 'meta_style', 'technical', 'medium',
 'Explain how you would design an A/B test for a new feed ranking algorithm when network effects cause interference between treatment and control groups.',
 '{"situation": "Standard user-level randomization suffers from SUTVA violation due to social graph interactions.", "action": "Implemented cluster-based (graph cluster) randomization and ego-network isolation methods.", "result": "Unbiased metric estimation of social network feature impact."}'::jsonb,
 ARRAY['ab_testing', 'statistics', 'data_science']),

-- Executive & Behavioral Leadership
('leadership', 'general', 'netflix_style', 'behavioral', 'hard',
 'Describe a situation where you had a strong disagreement with an executive stakeholder regarding technical architecture or strategic roadmap. How did you handle it?',
 '{"situation": "Executive wanted to rush technical debt cleanup without business feature deliverables.", "action": "Quantified cost of technical debt in outage hours & developer velocity, proposed 70/30 feature-to-debt compromise.", "result": "Aligned stakeholder vision and reduced critical bugs by 40%."}'::jsonb,
 ARRAY['stakeholder_management', 'leadership', 'executive']);
