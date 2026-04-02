create table if not exists public.vpat_reports (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null,
  product_name text not null,
  generated_at timestamptz not null default now(),
  file_url text not null
);

create index if not exists vpat_reports_scan_id_idx on public.vpat_reports(scan_id);
