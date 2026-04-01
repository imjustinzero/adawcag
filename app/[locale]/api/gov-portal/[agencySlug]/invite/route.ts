import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/send';
import { addGovAuditLog, createGovMemberInvite, getAgencyBySlug, verifyGovPortalSession } from '@/lib/gov-portal/store';

export async function POST(request: NextRequest, { params }: { params: { locale: string; agencySlug: string } }): Promise<NextResponse> {
  const agency = getAgencyBySlug(params.agencySlug);
  if (!agency) return NextResponse.json({ error: 'AGENCY_NOT_FOUND' }, { status: 404 });

  const session = verifyGovPortalSession(request.cookies.get('gov_portal_session')?.value);
  if (!session || session.agencyId !== agency.id || session.role !== 'Agency_Admin') {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const contentType = request.headers.get('content-type') ?? '';
  let email = '';
  let role: 'Agency_Admin' | 'Dept_Manager' | 'Viewer' | '' = '';
  let department: string | null = null;

  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => ({}));
    email = String(body.email ?? '').toLowerCase();
    role = String(body.role ?? '') as typeof role;
    department = body.department ? String(body.department) : null;
  } else {
    const formData = await request.formData();
    email = String(formData.get('email') ?? '').toLowerCase();
    role = String(formData.get('role') ?? '') as typeof role;
    department = formData.get('department') ? String(formData.get('department')) : null;
  }

  if (!email || !role) return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 });

  const member = createGovMemberInvite({ agencyId: agency.id, email, role, department });
  const portalJoinUrl = `${new URL(request.url).origin}/${params.locale}/gov-portal/${params.agencySlug}/join?token=${member.inviteToken}`;
  await sendEmail({
    to: email,
    subject: `Invite to ${agency.name} government portal`,
    html: `<p>You were invited to ${agency.name}'s portal.</p><p><a href="${portalJoinUrl}">Join portal</a></p>`,
  });

  addGovAuditLog(agency.id, session.memberEmail, 'team_invite', `Invited ${email} as ${role}`);
  return NextResponse.json({ invited: true, email, role, department, inviteToken: member.inviteToken, joinUrl: portalJoinUrl });
}
