import { NextRequest, NextResponse } from 'next/server';
import { mapAmountToPlan } from '@/lib/billing/plan';
import { getBillingByCustomer, upsertBillingByCustomer } from '@/lib/billing/store';

type StripeEvent = {
  type: string;
  data?: {
    object?: any;
  };
};

function getSubscriptionUnitAmount(session: any): number | null {
  return session?.items?.[0]?.price?.unit_amount ?? session?.display_items?.[0]?.amount ?? null;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const event = (await req.json().catch(() => null)) as StripeEvent | null;
  if (!event?.type) {
    return NextResponse.json({ error: 'INVALID_EVENT' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data?.object;
    const customerId = String(session?.customer ?? '');
    if (!customerId) {
      return NextResponse.json({ error: 'MISSING_CUSTOMER' }, { status: 400 });
    }

    const amount = getSubscriptionUnitAmount(session);
    const plan = mapAmountToPlan(amount);
    const billing = upsertBillingByCustomer(customerId, { active: true, plan });

    return NextResponse.json({ ok: true, customerId, billing });
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data?.object;
    const customerId = String(subscription?.customer ?? '');
    if (!customerId) {
      return NextResponse.json({ error: 'MISSING_CUSTOMER' }, { status: 400 });
    }

    const current = getBillingByCustomer(customerId);
    const isActive = ['active', 'trialing'].includes(String(subscription?.status ?? ''));
    const billing = upsertBillingByCustomer(customerId, { active: isActive, plan: current.plan });

    return NextResponse.json({ ok: true, customerId, billing });
  }

  return NextResponse.json({ ok: true, ignored: event.type });
}
