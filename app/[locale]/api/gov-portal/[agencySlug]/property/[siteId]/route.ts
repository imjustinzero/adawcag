import { NextRequest, NextResponse } from 'next/server';
import { getAgencyBySlug, govProperties, verifyGovPortalSession } from '@/lib/gov-portal/store';

export async function GET(request: NextRequest, { params }: { params: { agencySlug: string; siteId: string } }): Promise<NextResponse> {
  const agency = getAgencyBySlug(params.agencySlug);
  if (!agency) return NextResponse.json({ error: 'AGENCY_NOT_FOUND' }, { status: 404 });

  const session = verifyGovPortalSession(request.cookies.get('gov_portal_session')?.value);
  if (!session || session.agencyId !== agency.id) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

  const property = govProperties.find((site) => site.agencyId === agency.id && site.id === params.siteId);
  if (!property) return NextResponse.json({ error: 'SITE_NOT_FOUND' }, { status: 404 });
  if (session.role === 'Dept_Manager' && session.department && property.department !== session.department) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const latest = property.scans[property.scans.length - 1];
  return NextResponse.json({
    siteId: property.id,
    url: property.url,
    department: property.department,
    latestScore: latest?.score ?? 0,
    fullIssueList: latest?.issues ?? [],
    scanHistory: property.scans.map((scan) => ({ scannedAt: scan.scannedAt, score: scan.score, totalViolations: scan.totalViolations })),
    remediationProgress: property.remediationProgress,
  });
}
