import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/require-admin-session';
import { govAgencies } from '@/lib/gov-portal/store';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const admin = requireAdminSession(request);
    const body = await request.json();
    const tenantId = String(body.tenantId ?? '');
    const agencySlug = String(body.agencySlug ?? '');
    const name = String(body.name ?? '');
    if (!tenantId || !agencySlug || !name) return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 });
    if (govAgencies.some((agency) => agency.agencySlug === agencySlug)) return NextResponse.json({ error: 'SLUG_IN_USE' }, { status: 409 });

    const agency = {
      id: crypto.randomUUID(),
      tenantId,
      agencySlug,
      name,
      logoUrl: null,
      sealUrl: null,
      primaryColor: '#003262',
      secondaryColor: '#FDB515',
      portalTitle: `${name} Accessibility Portal`,
      createdAt: new Date().toISOString(),
    };
    govAgencies.push(agency);

    return NextResponse.json({
      createdBy: admin.email,
      agency,
      portalUrl: `/gov-portal/${agencySlug}`,
    });
  } catch {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }
}
