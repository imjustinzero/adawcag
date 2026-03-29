CREATE TABLE IF NOT EXISTS benchmark_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL UNIQUE,
  domain text NOT NULL,
  organization_name text,
  category text,
  subcategory text,
  state text,
  county text,
  city text,
  served_population integer,
  median_household_income integer,
  disability_prevalence_pct numeric(5,2),
  pct_below_poverty numeric(5,2),
  pct_no_college numeric(5,2),
  wcag_score integer,
  critical_violations integer,
  serious_violations integer,
  total_violations integer,
  last_scanned_at timestamptz,
  scan_count integer DEFAULT 0,
  score_30d_ago integer,
  score_90d_ago integer,
  score_delta_30d integer GENERATED ALWAYS AS (wcag_score - score_30d_ago) STORED,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE MATERIALIZED VIEW IF NOT EXISTS equity_analysis AS
SELECT
  category,
  state,
  NTILE(4) OVER (ORDER BY median_household_income) as income_quartile,
  ROUND(AVG(wcag_score), 1) as avg_score,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY wcag_score), 1) as median_score,
  ROUND(AVG(critical_violations), 1) as avg_critical,
  COUNT(*) as site_count,
  SUM(served_population) as total_population_served,
  ROUND(AVG(disability_prevalence_pct), 2) as avg_disability_prevalence,
  ROUND(
    AVG(wcag_score) FILTER (WHERE NTILE(4) OVER (ORDER BY median_household_income) = 4) -
    AVG(wcag_score) FILTER (WHERE NTILE(4) OVER (ORDER BY median_household_income) = 1),
    1
  ) as income_accessibility_gap
FROM benchmark_sites
WHERE wcag_score IS NOT NULL AND is_active = true
GROUP BY category, state, NTILE(4) OVER (ORDER BY median_household_income)
WITH DATA;

CREATE OR REPLACE FUNCTION refresh_equity_analysis()
RETURNS void LANGUAGE sql AS $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY equity_analysis;
$$;
