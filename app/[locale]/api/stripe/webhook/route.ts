import { NextRequest, NextResponse } from 'next/server';
import { scheduleOnboardingSequence } from '@/lib/email/onboardingSequence';
import { mapAmountToPlan } from '@/lib/billing/plan';
import { getBillingByCustomer, upsertBillingByCustomer } from '@/lib/billing/store';
import { processedStripeEvents } from '@/lib/server/runtime-store';

type StripeEvent = {
  id?: string;
  type: string;
  data?: {
    object?: any;
  };
};

const CERT_RENEWAL_AMOUNT_CENTS = 29900;

function getSubscriptionUnitAmount(session: any): number | null {
  return session?.items?.[0]?.price?.unit_amount ?? session?.display_items?.[0]?.amount ?? session?.amount_total ?? null;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const event = (await req.json().catch(() => null)) as StripeEvent | null;
  if (!event?.type || !event.id) {
    return NextResponse.json({ error: 'INVALID_EVENT' }, { status: 400 });
  }

  if (processedStripeEvents.has(event.id)) {
    return NextResponse.json({ ok: true, ignored: true, reason: 'ALREADY_PROCESSED' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data?.object;
    const customerId = String(session?.customer ?? '');
    if (!customerId) {
      return NextResponse.json({ error: 'MISSING_CUSTOMER' }, { status: 400 });
    }

    const amount = getSubscriptionUnitAmount(session);
    const metadataPlan = session?.metadata?.plan;
    const isCertRenewal = metadataPlan === 'cert_renewal' || amount === CERT_RENEWAL_AMOUNT_CENTS;

    if (isCertRenewal) {
      processedStripeEvents.add(event.id);
      return NextResponse.json({ ok: true, customerId, renewed: true });
    }

    const plan = mapAmountToPlan(amount);
    const billing = upsertBillingByCustomer(customerId, { active: true, plan });

    await scheduleOnboardingSequence({
      tenantId: String(session?.client_reference_id ?? customerId),
      email: String(session?.customer_details?.email ?? `${customerId}@example.com`),
      firstName: String(session?.customer_details?.name ?? '').split(' ')[0],
      planName: plan,
    });

    processedStripeEvents.add(event.id);
    return NextResponse.json({ ok: true, customerId, billing, onboardingScheduled: true });
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
    processedStripeEvents.add(event.id);

    return NextResponse.json({ ok: true, customerId, billing });
  }

  processedStripeEvents.add(event.id);
  return NextResponse.json({ ok: true, ignored: event.type });
}
