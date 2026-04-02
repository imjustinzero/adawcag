alter table public.scans
  add column if not exists mobile_violations jsonb,
  add column if not exists mobile_score integer;
