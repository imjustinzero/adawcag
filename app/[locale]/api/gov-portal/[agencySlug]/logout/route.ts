import { NextRequest, NextResponse } from 'next/server';
import { addGovAuditLog, getAgencyBySlug, verifyGovPortalSession } from '@/lib/gov-portal/store';

export async function POST(request: NextRequest, { params }: { params: { agencySlug: string } }): Promise<NextResponse> {
  const agency = getAgencyBySlug(params.agencySlug);
  if (!agency) return NextResponse.json({ error: 'AGENCY_NOT_FOUND' }, { status: 404 });

  const session = verifyGovPortalSession(request.cookies.get('gov_portal_session')?.value);
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('gov_portal_session');

  if (session?.agencyId === agency.id) addGovAuditLog(agency.id, session.memberEmail, 'logout', 'Portal logout');
  return response;
}
