CREATE TABLE IF NOT EXISTS deploy_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  site_id uuid REFERENCES sites(id),
  git_sha text NOT NULL,
  git_branch text,
  git_author_email text,
  environment text CHECK (environment IN ('production','staging','preview')),
  deploy_url text,
  pre_deploy_scan_id uuid REFERENCES scans(id),
  post_deploy_scan_id uuid REFERENCES scans(id),
  violations_delta integer,
  regressions jsonb,
  fixes jsonb,
  gate_result text CHECK (gate_result IN ('pass','fail','warning')),
  gate_blocked_deploy boolean DEFAULT false,
  received_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS violation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  site_id uuid REFERENCES sites(id),
  scan_id uuid REFERENCES scans(id),
  deploy_event_id uuid REFERENCES deploy_events(id),
  event_type text CHECK (event_type IN ('new_violation','regression','resolved','waived')),
  violation_rule text NOT NULL,
  violation_impact text,
  wcag_sc text[],
  element_selector text,
  page_url text,
  introduced_by_sha text,
  introduced_by_email text,
  legal_risk_flag boolean DEFAULT false,
  user_impact_estimate integer,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS intelligence_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  feed_type text CHECK (feed_type IN ('regression','critical_new','resolved','legal_risk','deadline_alert','competitor_sued')),
  severity text CHECK (severity IN ('critical','high','medium','low','info')),
  title text NOT NULL,
  description text NOT NULL,
  action_label text,
  action_url text,
  metadata jsonb,
  dismissed boolean DEFAULT false,
  dismissed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS intelligence_feed_org_created ON intelligence_feed(org_id, created_at DESC);
ALTER TABLE deploy_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE violation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence_feed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deploy_events_org" ON deploy_events FOR ALL
  USING (org_id = (SELECT org_id FROM user_orgs WHERE user_id = auth.uid()));
CREATE POLICY "violation_events_org" ON violation_events FOR ALL
  USING (org_id = (SELECT org_id FROM user_orgs WHERE user_id = auth.uid()));
CREATE POLICY "intelligence_feed_org" ON intelligence_feed FOR ALL
  USING (org_id = (SELECT org_id FROM user_orgs WHERE user_id = auth.uid()));
