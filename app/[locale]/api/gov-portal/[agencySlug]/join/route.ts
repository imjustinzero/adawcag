import { NextRequest, NextResponse } from 'next/server';
import { addGovAuditLog, findMemberByInviteToken, getAgencyBySlug, signGovPortalSession } from '@/lib/gov-portal/store';

export async function GET(request: NextRequest, { params }: { params: { locale: string; agencySlug: string } }): Promise<NextResponse> {
  const agency = getAgencyBySlug(params.agencySlug);
  if (!agency) return NextResponse.json({ error: 'AGENCY_NOT_FOUND' }, { status: 404 });

  const token = request.nextUrl.searchParams.get('token') ?? '';
  const member = findMemberByInviteToken(agency.id, token);
  if (!member) return NextResponse.json({ error: 'INVALID_TOKEN' }, { status: 400 });

  member.joinedAt = new Date().toISOString();
  member.inviteToken = null;

  const response = NextResponse.redirect(new URL(`/${params.locale}/gov-portal/${params.agencySlug}`, request.url));
  response.cookies.set({
    name: 'gov_portal_session',
    value: signGovPortalSession({ agencyId: agency.id, agencySlug: agency.agencySlug, memberEmail: member.email, role: member.role, department: member.department }),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  addGovAuditLog(agency.id, member.email, 'portal_join', 'Joined with invite token');
  return response;
}
