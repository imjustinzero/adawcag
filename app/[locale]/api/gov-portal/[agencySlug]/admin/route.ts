import { NextRequest, NextResponse } from 'next/server';
import { addGovAuditLog, getAgencyBySlug, govAuditLogs, govMembers, verifyGovPortalSession } from '@/lib/gov-portal/store';

export async function GET(request: NextRequest, { params }: { params: { agencySlug: string } }): Promise<NextResponse> {
  const agency = getAgencyBySlug(params.agencySlug);
  if (!agency) return NextResponse.json({ error: 'AGENCY_NOT_FOUND' }, { status: 404 });
  const session = verifyGovPortalSession(request.cookies.get('gov_portal_session')?.value);
  if (!session || session.agencyId !== agency.id || session.role !== 'Agency_Admin') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

  return NextResponse.json({ members: govMembers.filter((member) => member.agencyId === agency.id), auditLogs: govAuditLogs.filter((entry) => entry.agencyId === agency.id), agency });
}

export async function POST(request: NextRequest, { params }: { params: { agencySlug: string } }): Promise<NextResponse> {
  const agency = getAgencyBySlug(params.agencySlug);
  if (!agency) return NextResponse.json({ error: 'AGENCY_NOT_FOUND' }, { status: 404 });
  const session = verifyGovPortalSession(request.cookies.get('gov_portal_session')?.value);
  if (!session || session.agencyId !== agency.id || session.role !== 'Agency_Admin') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

  const contentType = request.headers.get('content-type') ?? '';
  let action = '';
  let payload: Record<string, string> = {};
  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => ({}));
    action = String(body.action ?? '');
    payload = body;
  } else {
    const formData = await request.formData();
    action = String(formData.get('action') ?? '');
    payload = Object.fromEntries(Array.from(formData.entries()).map(([key, value]) => [key, String(value)]));
  }

  if (action === 'revoke') {
    const email = String(payload.email ?? '').toLowerCase();
    const idx = govMembers.findIndex((member) => member.agencyId === agency.id && member.email === email);
    if (idx >= 0) {
      govMembers.splice(idx, 1);
      addGovAuditLog(agency.id, session.memberEmail, 'team_revoke', `Revoked ${email}`);
    }
    return NextResponse.json({ ok: true });
  }

  if (action === 'branding') {
    agency.logoUrl = payload.logoUrl ? String(payload.logoUrl) : null;
    agency.sealUrl = payload.sealUrl ? String(payload.sealUrl) : null;
    agency.primaryColor = payload.primaryColor ? String(payload.primaryColor) : agency.primaryColor;
    agency.secondaryColor = payload.secondaryColor ? String(payload.secondaryColor) : agency.secondaryColor;
    agency.portalTitle = payload.portalTitle ? String(payload.portalTitle) : agency.portalTitle;
    addGovAuditLog(agency.id, session.memberEmail, 'branding_update', 'Updated portal branding');
    return NextResponse.json({ ok: true, agency });
  }

  return NextResponse.json({ error: 'INVALID_ACTION' }, { status: 400 });
}
