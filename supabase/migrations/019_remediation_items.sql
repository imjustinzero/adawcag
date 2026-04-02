create table if not exists public.remediation_items (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null,
  issue_name text not null,
  wcag_criterion text not null,
  severity text not null check (severity in ('Critical', 'Serious', 'Moderate', 'Minor')),
  estimated_hours numeric(4,2) not null default 2,
  status text not null default 'Unassigned' check (status in ('Unassigned', 'In Progress', 'Done')),
  updated_at timestamptz not null default now(),
  unique (scan_id, issue_name)
);

create index if not exists remediation_items_scan_id_idx on public.remediation_items(scan_id);
