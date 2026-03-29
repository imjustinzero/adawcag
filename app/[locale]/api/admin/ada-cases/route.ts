import { NextRequest, NextResponse } from 'next/server';
import { adaCases } from '@/lib/admin/data-store';
import { requireAdminSession } from '@/lib/auth/require-admin-session';

async function readBody(request: NextRequest): Promise<Record<string, unknown>> {
  const type = request.headers.get('content-type') ?? '';
  if (type.includes('application/json')) {
    return (await request.json()) as Record<string, unknown>;
  }

  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    requireAdminSession(request);
    const body = await readBody(request);

    if (String(body._method ?? '').toLowerCase() === 'delete') {
      return DELETE(request);
    }

    const created = {
      id: crypto.randomUUID(),
      caseNumber: String(body.caseNumber ?? ''),
      caseName: String(body.caseName ?? ''),
      court: String(body.court ?? ''),
      plaintiff: String(body.plaintiff ?? ''),
      defendant: String(body.defendant ?? ''),
      industryType: String(body.industryType ?? ''),
      outcome: String(body.outcome ?? ''),
      settlement: String(body.settlement ?? ''),
      summary: String(body.summary ?? ''),
      legalSignificance: String(body.legalSignificance ?? ''),
      violations: String(body.violations ?? '').split(',').map((v) => v.trim()).filter(Boolean),
      wcagCriteria: String(body.wcagCriteria ?? '').split(',').map((v) => v.trim()).filter(Boolean),
      filedDate: String(body.filedDate ?? ''),
      isActive: true
    };

    adaCases.push(created);
    return NextResponse.json({ ok: true, case: created }, { status: 201 });
  } catch (error) {
    const status = String(error).includes('UNAUTHORIZED') ? 401 : 500;
    return NextResponse.json({ error: status === 401 ? 'UNAUTHORIZED' : 'ADA_CASE_CREATE_FAILED' }, { status });
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    requireAdminSession(request);
    const body = await readBody(request);
    const id = String(body.id ?? '');
    const target = adaCases.find((item) => item.id === id);

    if (!target) {
      return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    }

    target.isActive = false;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = String(error).includes('UNAUTHORIZED') ? 401 : 500;
    return NextResponse.json({ error: status === 401 ? 'UNAUTHORIZED' : 'ADA_CASE_DELETE_FAILED' }, { status });
  }
}
