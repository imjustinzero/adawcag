CREATE TABLE IF NOT EXISTS marketplace_developers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  full_name text NOT NULL,
  email text NOT NULL,
  bio text,
  hourly_rate_min integer,
  hourly_rate_max integer,
  specialties text[],
  wcag_certifications text[],
  portfolio_url text,
  github_url text,
  linkedin_url text,
  stripe_account_id text,
  stripe_onboarding_complete boolean DEFAULT false,
  status text DEFAULT 'pending' CHECK (status IN ('pending','approved','suspended','rejected')),
  aaron_approved boolean DEFAULT false,
  jobs_completed integer DEFAULT 0,
  average_rating numeric(3,2),
  total_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS marketplace_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  scan_id uuid REFERENCES scans(id),
  title text NOT NULL,
  description text NOT NULL,
  violations_to_fix jsonb NOT NULL,
  wcag_level text DEFAULT '2.1AA',
  estimated_hours_min integer,
  estimated_hours_max integer,
  budget_min integer,
  budget_max integer,
  status text DEFAULT 'open' CHECK (status IN ('open','assigned','in_progress','review','completed','disputed','cancelled')),
  assigned_developer_id uuid REFERENCES marketplace_developers(id),
  assigned_at timestamptz,
  deadline date,
  completion_scan_id uuid REFERENCES scans(id),
  aaron_verified boolean DEFAULT false,
  aaron_verified_at timestamptz,
  client_approved boolean DEFAULT false,
  client_approved_at timestamptz,
  stripe_payment_intent_id text,
  platform_fee_pct integer DEFAULT 20,
  developer_payout_cents integer,
  platform_revenue_cents integer,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS marketplace_bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES marketplace_jobs(id),
  developer_id uuid REFERENCES marketplace_developers(id),
  proposed_hours integer,
  proposed_rate integer,
  proposed_total integer,
  cover_letter text,
  estimated_completion_days integer,
  status text DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','withdrawn')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS marketplace_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES marketplace_jobs(id),
  reviewer_org_id uuid REFERENCES organizations(id),
  developer_id uuid REFERENCES marketplace_developers(id),
  rating integer CHECK (rating BETWEEN 1 AND 5),
  review_text text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE marketplace_developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_bids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dev_own_profile" ON marketplace_developers
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY "jobs_org_access" ON marketplace_jobs
  FOR ALL USING (org_id = (SELECT org_id FROM user_orgs WHERE user_id = auth.uid()));
CREATE POLICY "open_jobs_devs" ON marketplace_jobs
  FOR SELECT USING (
    status = 'open' AND EXISTS (
      SELECT 1 FROM marketplace_developers WHERE user_id = auth.uid() AND status = 'approved'
    )
  );
