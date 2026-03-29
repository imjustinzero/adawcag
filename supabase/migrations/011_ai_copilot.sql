CREATE TABLE IF NOT EXISTS copilot_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  user_id uuid REFERENCES auth.users(id),
  title text,
  messages jsonb DEFAULT '[]'::jsonb,
  context_snapshot jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS copilot_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES copilot_conversations(id),
  action_type text,
  action_params jsonb,
  executed boolean DEFAULT false,
  executed_at timestamptz,
  result jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE copilot_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "copilot_org" ON copilot_conversations
  FOR ALL USING (org_id = (SELECT org_id FROM user_orgs WHERE user_id = auth.uid()));
