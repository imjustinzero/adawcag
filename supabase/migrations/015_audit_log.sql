CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz DEFAULT now() NOT NULL,
  org_id uuid,
  user_id uuid,
  staff_id uuid,
  action text NOT NULL,
  resource_type text,
  resource_id uuid,
  ip_address inet,
  user_agent text,
  request_id uuid,
  old_value jsonb,
  new_value jsonb,
  result text CHECK (result IN ('success','failure','error')),
  error_message text
);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_log_insert_only" ON audit_log FOR INSERT WITH CHECK (true);
CREATE POLICY "audit_log_internal_read" ON audit_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM staff_profiles WHERE user_id = auth.uid())
);
