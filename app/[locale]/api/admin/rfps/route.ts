import { NextRequest, NextResponse } from 'next/server';
import { PLATFORM_TENANT_ID, rfps } from '@/lib/admin/data-store';
import { requireAdminSession } from '@/lib/auth/require-admin-session';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    requireAdminSession(request);
    const body = await request.json();

    const created = {
      id: crypto.randomUUID(),
      tenantId: PLATFORM_TENANT_ID,
      tenantName: 'ADAWCAG Platform',
      title: String(body.title ?? ''),
      agency: String(body.agency ?? ''),
      status: 'new' as const,
      matchScore: Number(body.matchScore ?? 0),
      dueDate: String(body.dueDate ?? ''),
      value: String(body.value ?? '')
    };

    rfps.push(created);
    return NextResponse.json({ ok: true, rfp: created }, { status: 201 });
  } catch (error) {
    const status = String(error).includes('UNAUTHORIZED') ? 401 : 500;
    return NextResponse.json({ error: status === 401 ? 'UNAUTHORIZED' : 'RFP_CREATE_FAILED' }, { status });
  }
}
