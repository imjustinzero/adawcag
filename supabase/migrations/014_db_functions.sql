CREATE OR REPLACE FUNCTION get_scan_stats(p_scan_id uuid)
RETURNS jsonb AS $$
  SELECT jsonb_build_object(
    'total', COUNT(*),
    'critical', COUNT(*) FILTER (WHERE impact = 'critical'),
    'serious', COUNT(*) FILTER (WHERE impact = 'serious'),
    'moderate', COUNT(*) FILTER (WHERE impact = 'moderate'),
    'minor', COUNT(*) FILTER (WHERE impact = 'minor'),
    'resolved', COUNT(*) FILTER (WHERE status = 'resolved'),
    'wcag_score', ROUND((COUNT(*) FILTER (WHERE status = 'resolved')::numeric / NULLIF(COUNT(*), 0)) * 100)
  )
  FROM violations WHERE scan_id = p_scan_id
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION get_org_dashboard_stats(p_org_id uuid)
RETURNS jsonb AS $$
  SELECT jsonb_build_object(
    'total_scans', (SELECT COUNT(*) FROM scans WHERE org_id = p_org_id),
    'total_violations', (SELECT COUNT(*) FROM violations v JOIN scans s ON v.scan_id = s.id WHERE s.org_id = p_org_id),
    'avg_score', (SELECT ROUND(AVG(wcag_score)) FROM scans WHERE org_id = p_org_id AND wcag_score IS NOT NULL),
    'sites_critical', (SELECT COUNT(DISTINCT site_id) FROM scans WHERE org_id = p_org_id AND wcag_score < 40),
    'last_scan', (SELECT MAX(created_at) FROM scans WHERE org_id = p_org_id)
  )
$$ LANGUAGE SQL STABLE;
