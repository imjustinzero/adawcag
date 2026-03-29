CREATE TABLE IF NOT EXISTS rfp_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  external_id text NOT NULL,
  title text NOT NULL,
  agency text NOT NULL,
  state text,
  posted_date date,
  due_date date,
  estimated_value_min bigint,
  estimated_value_max bigint,
  naics_code text,
  description text,
  requirements text[],
  raw_text text,
  match_score integer CHECK (match_score BETWEEN 0 AND 100),
  match_reasons text[],
  status text DEFAULT 'new' CHECK (status IN ('new','reviewing','pursuing','submitted','won','lost','no_bid')),
  assigned_to uuid REFERENCES staff_profiles(id),
  response_kit_url text,
  notes text,
  source_url text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(source, external_id)
);

CREATE TABLE IF NOT EXISTS rfp_response_kits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfp_id uuid REFERENCES rfp_opportunities(id),
  generated_at timestamptz DEFAULT now(),
  executive_summary text,
  technical_approach text,
  past_performance text,
  pricing_narrative text,
  team_qualifications text,
  full_document_url text,
  status text DEFAULT 'draft' CHECK (status IN ('draft','reviewed','submitted'))
);

ALTER TABLE rfp_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfp_response_kits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rfp_internal_only" ON rfp_opportunities
  FOR ALL USING (EXISTS (SELECT 1 FROM staff_profiles WHERE user_id = auth.uid()));
