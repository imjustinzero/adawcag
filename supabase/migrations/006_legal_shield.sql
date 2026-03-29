CREATE TABLE IF NOT EXISTS ada_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_name text NOT NULL,
  citation text NOT NULL,
  court text NOT NULL,
  year integer NOT NULL,
  outcome text CHECK (outcome IN ('plaintiff_won','defendant_won','settled','ongoing')),
  settlement_amount_min integer,
  settlement_amount_max integer,
  wcag_violations_cited text[],
  violation_types text[],
  industries_affected text[],
  summary text NOT NULL,
  legal_significance text NOT NULL,
  plaintiff_argument text,
  defendant_argument text,
  judge_ruling_excerpt text,
  source_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legal_risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id uuid REFERENCES scans(id) ON DELETE CASCADE,
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  risk_level text CHECK (risk_level IN ('critical','high','medium','low')),
  estimated_exposure_min integer,
  estimated_exposure_max integer,
  matching_cases uuid[],
  violations_with_legal_risk jsonb,
  defensible_position_statement text,
  remediation_priority_legal jsonb,
  generated_at timestamptz DEFAULT now(),
  pdf_url text,
  reviewed_by uuid REFERENCES staff_profiles(id),
  reviewed_at timestamptz
);

CREATE TABLE IF NOT EXISTS demand_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  received_date date,
  plaintiff_name text,
  plaintiff_attorney text,
  cited_violations text[],
  response_deadline date,
  status text DEFAULT 'received' CHECK (status IN ('received','response_drafted','response_sent','resolved','litigating')),
  response_package_url text,
  emergency_scan_id uuid REFERENCES scans(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ada_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE demand_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ada_cases_public_read" ON ada_cases FOR SELECT USING (true);
CREATE POLICY "legal_risk_org_isolation" ON legal_risk_assessments
  FOR ALL USING (org_id = (SELECT org_id FROM user_orgs WHERE user_id = auth.uid()));
CREATE POLICY "demand_letters_org_isolation" ON demand_letters
  FOR ALL USING (org_id = (SELECT org_id FROM user_orgs WHERE user_id = auth.uid()));
