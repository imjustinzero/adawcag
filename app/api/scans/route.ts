import { NextRequest, NextResponse } from 'next/server';
import { sanitizeScanUrl } from '@/lib/security/url-sanitizer';
import { enqueueScan, PlanTier } from '@/lib/server/runtime-store';
import { supabase } from '@/lib/supabase';

async function runMobileAudit(url: string): Promise<{ mobileScore: number; mobileViolations: Array<{ issue_name: string; impact: string; wcag_criterion: string }> }> {
  // Placeholder for Lighthouse mobile run using iPhone 12 Pro emulation settings.
  void url;
  return {
    mobileScore: 68,
    mobileViolations: [
      { issue_name: 'Tap targets too small', impact: 'serious', wcag_criterion: '2.5.5' },
      { issue_name: 'Input purpose not programmatically determinable', impact: 'moderate', wcag_criterion: '1.3.5' },
    ],
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => ({}));
  const orgId = typeof body.orgId === 'string' ? body.orgId : 'unknown-org';
  const scanUrl = sanitizeScanUrl(typeof body.url === 'string' ? body.url : '');
  const planTier = (typeof body.planTier === 'string' ? body.planTier : 'professional') as PlanTier;
  const mobileAudit = body.mobile_audit !== false;

  if (!scanUrl) {
    return NextResponse.json({ error: 'INVALID_SCAN_URL', message: 'Only public http(s) URLs are permitted.' }, { status: 400 });
  }

  const queued = enqueueScan(orgId, scanUrl, planTier);

  if (mobileAudit) {
    const mobileData = await runMobileAudit(scanUrl);
    await supabase.from('scans').upsert({
      id: queued.job.id,
      org_id: orgId,
      url: scanUrl,
      mobile_score: mobileData.mobileScore,
      mobile_violations: mobileData.mobileViolations,
      updated_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({ queued: true, mobile_audit: mobileAudit, jobId: queued.job.id, queuePosition: queued.position, etaMinutes: queued.etaMinutes, lane: planTier });
}
