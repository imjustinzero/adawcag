-- Phase 4 backend security hardening

CREATE TABLE IF NOT EXISTS webhook_failures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id text NOT NULL,
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  attempt integer NOT NULL CHECK (attempt BETWEEN 1 AND 3),
  error text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stripe_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id text NOT NULL UNIQUE,
  processed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scrape_failures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  source text NOT NULL,
  reason text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rate_limit_violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  source text NOT NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- enforce RLS for all public tables
DO $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', table_name);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY;', table_name);
  END LOOP;
END $$;

-- org-scoped policies
CREATE POLICY IF NOT EXISTS "webhook_failures_org_isolation" ON webhook_failures
  FOR ALL USING (org_id = (SELECT org_id FROM user_orgs WHERE user_id = auth.uid()));

CREATE POLICY IF NOT EXISTS "scrape_failures_org_isolation" ON scrape_failures
  FOR ALL USING (org_id = (SELECT org_id FROM user_orgs WHERE user_id = auth.uid()));

CREATE POLICY IF NOT EXISTS "rate_limit_violations_staff_only" ON rate_limit_violations
  FOR ALL USING (EXISTS (SELECT 1 FROM staff_profiles WHERE user_id = auth.uid()));

CREATE POLICY IF NOT EXISTS "stripe_events_staff_only" ON stripe_events
  FOR ALL USING (EXISTS (SELECT 1 FROM staff_profiles WHERE user_id = auth.uid()));

CREATE POLICY IF NOT EXISTS "certification_audits_org_select" ON certification_audits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM certifications c
      WHERE c.id = certification_audits.certification_id
      AND c.org_id = (SELECT org_id FROM user_orgs WHERE user_id = auth.uid())
    )
  );

CREATE POLICY IF NOT EXISTS "marketplace_reviews_org_access" ON marketplace_reviews
  FOR ALL USING (reviewer_org_id = (SELECT org_id FROM user_orgs WHERE user_id = auth.uid()));
