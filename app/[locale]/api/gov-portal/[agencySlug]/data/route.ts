import { NextRequest, NextResponse } from 'next/server';
import { getAgencyBySlug, getAgencyStats, verifyGovPortalSession } from '@/lib/gov-portal/store';

export async function GET(request: NextRequest, { params }: { params: { agencySlug: string } }): Promise<NextResponse> {
  const agency = getAgencyBySlug(params.agencySlug);
  if (!agency) return NextResponse.json({ error: 'AGENCY_NOT_FOUND' }, { status: 404 });

  const session = verifyGovPortalSession(request.cookies.get('gov_portal_session')?.value);
  if (!session || session.agencyId !== agency.id) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

  const stats = getAgencyStats(agency.id, session.role === 'Dept_Manager' ? session.department : null);
  return NextResponse.json({ agency, stats });
}
