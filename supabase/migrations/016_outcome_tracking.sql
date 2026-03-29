CREATE TABLE IF NOT EXISTS violation_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  violation_id uuid,
  scan_id uuid,
  org_id uuid,
  rule_id text NOT NULL,
  wcag_sc text[] NOT NULL,
  impact text NOT NULL,
  element_type text,
  tech_stack text,
  industry text,
  page_type text,
  assigned_at timestamptz,
  fix_started_at timestamptz,
  fix_submitted_at timestamptz,
  fix_verified_at timestamptz,
  fix_duration_hours numeric(6,2),
  fix_method text,
  ai_suggestion_used boolean,
  ai_suggestion_accuracy text,
  score_before integer,
  score_after integer,
  score_delta integer GENERATED ALWAYS AS (score_after - score_before) STORED,
  violations_resolved_count integer,
  aaron_verified boolean DEFAULT false,
  aaron_verified_at timestamptz,
  aaron_notes text,
  aaron_difficulty_rating integer CHECK (aaron_difficulty_rating BETWEEN 1 AND 5),
  screen_reader_tested boolean DEFAULT false,
  keyboard_tested boolean DEFAULT false,
  anonymized boolean DEFAULT true,
  research_tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE MATERIALIZED VIEW IF NOT EXISTS outcome_stats AS
SELECT
  industry,
  rule_id,
  impact,
  tech_stack,
  element_type,
  COUNT(*) as sample_size,
  ROUND(AVG(fix_duration_hours), 2) as avg_fix_hours,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY fix_duration_hours) as median_fix_hours,
  ROUND(AVG(score_delta), 1) as avg_score_improvement,
  ROUND(AVG(violations_resolved_count), 1) as avg_violations_resolved,
  ROUND(COUNT(*) FILTER (WHERE ai_suggestion_used) * 100.0 / NULLIF(COUNT(*), 0), 1) as ai_adoption_rate,
  ROUND(COUNT(*) FILTER (WHERE ai_suggestion_accuracy = 'exact') * 100.0 / NULLIF(COUNT(*) FILTER (WHERE ai_suggestion_used), 0), 1) as ai_accuracy_rate,
  ROUND(AVG(aaron_difficulty_rating), 2) as avg_difficulty
FROM violation_outcomes
WHERE anonymized = true
  AND fix_verified_at IS NOT NULL
GROUP BY industry, rule_id, impact, tech_stack, element_type
HAVING COUNT(*) >= 5
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS outcome_stats_idx
ON outcome_stats(industry, rule_id, impact, tech_stack, element_type);

CREATE MATERIALIZED VIEW IF NOT EXISTS platform_research_stats AS
SELECT
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_violations_tracked,
  COUNT(*) FILTER (WHERE fix_verified_at IS NOT NULL) as total_remediated,
  ROUND(AVG(fix_duration_hours) FILTER (WHERE fix_verified_at IS NOT NULL), 2) as avg_fix_hours,
  ROUND(AVG(score_delta) FILTER (WHERE score_delta > 0), 1) as avg_score_improvement,
  COUNT(DISTINCT org_id) as orgs_contributing,
  COUNT(DISTINCT rule_id) as unique_violation_types,
  ROUND(COUNT(*) FILTER (WHERE ai_suggestion_used) * 100.0 / NULLIF(COUNT(*), 0), 1) as ai_adoption_pct
FROM violation_outcomes
WHERE anonymized = true
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC
WITH DATA;

ALTER TABLE violation_outcomes ENABLE ROW LEVEL SECURITY;

CREATE POLICY outcomes_org_isolation ON violation_outcomes
  FOR ALL USING (org_id = (SELECT org_id FROM user_orgs WHERE user_id = auth.uid()));

CREATE OR REPLACE FUNCTION refresh_outcome_stats()
RETURNS void LANGUAGE sql AS $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY outcome_stats;
$$;

CREATE OR REPLACE FUNCTION refresh_platform_research_stats()
RETURNS void LANGUAGE sql AS $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY platform_research_stats;
$$;
