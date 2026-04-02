import { DisabilityImpactScore } from '@/components/impact/DisabilityImpactScore';
import { ConformanceTrajectory } from '@/components/trajectory/ConformanceTrajectory';
import { ScanWorkbench } from '@/components/dashboard/ScanWorkbench';
import { calculateDisabilityImpactScore } from '@/lib/impact/disability-impact-score';
import { calculateConformanceTrajectory } from '@/lib/trajectory/conformance-path';
import { supabase } from '@/lib/supabase';
import { inferFixDetails, mapSeverity, sortByPriority, type ViolationRecord } from '@/lib/accessibility/violation-mapping';

async function getScanData(scanId: string): Promise<{ desktopScore: number; mobileScore: number; violations: ViolationRecord[]; mobileViolations: ViolationRecord[] }> {
  const { data } = await supabase.from('scans').select('score,mobile_score,violations,mobile_violations').eq('id', scanId).maybeSingle();
  return {
    desktopScore: Number(data?.score ?? 41),
    mobileScore: Number(data?.mobile_score ?? 36),
    violations: (data?.violations as ViolationRecord[] | null) ?? [
      { rule_id: 'color-contrast', issue_name: 'Color contrast', impact: 'serious' },
      { rule_id: 'label', issue_name: 'Missing form label', impact: 'moderate' },
      { rule_id: 'image-alt', issue_name: 'Missing alt text', impact: 'critical' },
    ],
    mobileViolations: (data?.mobile_violations as ViolationRecord[] | null) ?? [{ issue_name: 'Tap target size', impact: 'serious', wcag_criterion: '2.5.5' }],
  };
}

export default async function ScanPage({ params }: { params: Promise<{ scanId: string }> }): Promise<JSX.Element> {
  const { scanId } = await params;
  const scanData = await getScanData(scanId);
  const impact = await calculateDisabilityImpactScore({ violations: scanData.violations.map((v) => ({ rule_id: v.rule_id ?? v.issue_name ?? 'unknown', page_url: 'https://example.com' })), siteUrl: 'https://example.com', industry: 'ecommerce' });
  const trajectory = await calculateConformanceTrajectory({ currentScore: scanData.desktopScore, violations: scanData.violations.map((v) => ({ rule_id: v.rule_id ?? v.issue_name ?? 'unknown', page_url: 'https://example.com' })), deadline: new Date('2026-04-24'), industry: 'ecommerce', orgId: 'demo-org' });

  const remediationSeed = scanData.violations.map((violation) => {
    const issueName = violation.issue_name ?? violation.rule_id ?? 'Unknown issue';
    const details = inferFixDetails(issueName);
    return {
      id: crypto.randomUUID(),
      issue_name: details.normalizedIssueName,
      wcag_criterion: violation.wcag_criterion ?? details.wcagCriterion,
      severity: mapSeverity(violation.impact),
      estimated_hours: details.estimatedHours,
      status: 'Unassigned' as const,
    };
  });

  const remediationItems = sortByPriority(remediationSeed);
  if (remediationItems.length > 0) {
    await supabase.from('remediation_items').upsert(remediationItems.map((item) => ({ ...item, scan_id: scanId, updated_at: new Date().toISOString() })), { onConflict: 'scan_id,issue_name' });
  }

  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <h1>Scan #{scanId}</h1>
      <section className="card"><h2>WCAG 2.1 AA Score: {scanData.desktopScore}</h2><p>Desktop and mobile findings are now available side-by-side in your reporting flow.</p></section>
      <DisabilityImpactScore data={impact} />
      <ConformanceTrajectory paths={[trajectory.pathA, trajectory.pathB, trajectory.pathC, trajectory.pathD]} />
      <ScanWorkbench
        scanId={scanId}
        desktopScore={scanData.desktopScore}
        mobileScore={scanData.mobileScore}
        mobileViolations={scanData.mobileViolations.map((item) => ({ issue_name: item.issue_name ?? item.rule_id ?? 'Unknown', severity: mapSeverity(item.impact), wcag_criterion: item.wcag_criterion ?? '2.5.1' }))}
        remediationItems={remediationItems}
      />
      <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem' }}>
        <a className="btn btn-primary" href={`/api/scans/${scanId}/simulate`}>Run screen reader simulation</a>
        <a className="btn btn-ghost" href={`/scans/${scanId}/experience`}>View narrative report</a>
      </div>
    </main>
  );
}
