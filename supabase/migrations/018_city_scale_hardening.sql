ALTER TABLE scans ADD COLUMN IF NOT EXISTS failed_at TIMESTAMPTZ;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS failure_reason TEXT;

CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  site_id UUID,
  scan_id UUID,
  score INTEGER,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'conditional',
  type TEXT DEFAULT 'WCAG_2_1_AA',
  cert_number TEXT UNIQUE,
  countersigned_by TEXT,
  countersigned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tenant_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  page_limit INTEGER,
  sites_allowed INTEGER,
  scan_frequency TEXT,
  expires_at TIMESTAMPTZ,
  reason TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
