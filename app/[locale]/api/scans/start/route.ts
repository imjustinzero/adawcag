import { NextRequest, NextResponse } from 'next/server';
import { getPlanPageLimit } from '@/lib/billing/plan';
import { getBillingByCustomer } from '@/lib/billing/store';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json().catch(() => ({}));
  const customerId = typeof body.customerId === 'string' ? body.customerId : '';
  const requestedPages = Number(body.maxPages ?? 1);
  const role = typeof body.role === 'string' ? body.role : 'user';

  const isAdmin = role === 'admin';
  const billing = customerId ? getBillingByCustomer(customerId) : { active: false, plan: '' as const };
  const plan = billing.plan || (billing.active ? 'professional' : 'starter');

  const allowedMax = getPlanPageLimit(plan, isAdmin);
  if (Number.isFinite(allowedMax) && requestedPages > allowedMax) {
    return NextResponse.json(
      { error: 'SCAN_PAGE_LIMIT_EXCEEDED', plan, allowedMaxPages: allowedMax, requestedPages },
      { status: 403 },
    );
  }

  return NextResponse.json({ ok: true, plan, maxPages: requestedPages });
}
