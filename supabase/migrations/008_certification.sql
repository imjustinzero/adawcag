CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  site_id uuid REFERENCES sites(id),
  site_url text NOT NULL,
  certification_token text UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  status text DEFAULT 'pending' CHECK (status IN ('pending','active','expired','revoked','suspended')),
  wcag_level text DEFAULT '2.1AA' CHECK (wcag_level IN ('2.0A','2.0AA','2.1A','2.1AA','2.2AA')),
  automated_score integer CHECK (automated_score BETWEEN 0 AND 100),
  manual_audit_passed boolean DEFAULT false,
  auditor_id uuid REFERENCES staff_profiles(id),
  auditor_credential text,
  issued_at timestamptz,
  expires_at timestamptz,
  last_verified_at timestamptz,
  renewal_stripe_subscription_id text,
  renewal_price_id text,
  public_report_url text,
  revocation_reason text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS certification_audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_id uuid REFERENCES certifications(id),
  audit_type text CHECK (audit_type IN ('automated','manual','renewal','spot_check')),
  scan_id uuid REFERENCES scans(id),
  automated_score integer,
  manual_pass boolean,
  findings jsonb,
  auditor_notes text,
  auditor_id uuid REFERENCES staff_profiles(id),
  conducted_at timestamptz DEFAULT now()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "certifications_public_read" ON certifications
  FOR SELECT USING (status = 'active');
CREATE POLICY "certifications_org_all" ON certifications
  FOR ALL USING (org_id = (SELECT org_id FROM user_orgs WHERE user_id = auth.uid()));
