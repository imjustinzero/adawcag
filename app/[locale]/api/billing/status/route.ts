import { NextRequest, NextResponse } from 'next/server';
import { capitalizePlan, canUseEvidenceScreenshots, getPlanPageLimit } from '@/lib/billing/plan';
import { getBillingByCustomer } from '@/lib/billing/store';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const customerId = req.nextUrl.searchParams.get('customerId') ?? '';
  const role = req.nextUrl.searchParams.get('role') ?? 'user';
  const isAdmin = role === 'admin';

  const billing = customerId ? getBillingByCustomer(customerId) : { active: false, plan: '' as const };
  const plan = billing.plan || (billing.active ? 'professional' : '');
  const pageLimit = getPlanPageLimit(plan, isAdmin);

  return NextResponse.json({
    active: billing.active || isAdmin,
    plan,
    planName: capitalizePlan(plan, isAdmin),
    limits: {
      maxPagesPerScan: Number.isFinite(pageLimit) ? pageLimit : null,
      websites: plan === 'starter_lite' ? 1 : null,
      evidenceScreenshots: canUseEvidenceScreenshots(plan, isAdmin),
    },
  });
}
