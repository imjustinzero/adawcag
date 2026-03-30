import { NextRequest, NextResponse } from 'next/server';
import { tenantOverrides } from '@/lib/admin/data-store';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const form = await request.formData();
  tenantOverrides.push({
    id: crypto.randomUUID(),
    tenantId: String(form.get('tenantId') ?? ''),
    tenantName: String(form.get('tenantName') ?? ''),
    pageLimit: form.get('pageLimit') ? Number(form.get('pageLimit')) : null,
    sitesAllowed: form.get('sitesAllowed') ? Number(form.get('sitesAllowed')) : null,
    scanFrequency: (String(form.get('scanFrequency') ?? '') as 'daily' | 'weekly' | 'monthly') || null,
    expiresAt: form.get('expiresAt') ? new Date(String(form.get('expiresAt'))).toISOString() : null,
    reason: String(form.get('reason') ?? ''),
    createdBy: 'admin@adawcag.org',
    createdAt: new Date().toISOString(),
  });

  return NextResponse.redirect(new URL('/en/admin/tenants', request.url), { status: 303 });
}
