import { NextRequest, NextResponse } from 'next/server';
import { scheduleOnboardingSequence } from '@/lib/email/onboardingSequence';
import { mapAmountToPlan, type BillingPlan } from '@/lib/billing/plan';
import { getBillingByCustomer, upsertBillingByCustomer } from '@/lib/billing/store';
import { processedStripeEvents } from '@/lib/server/runtime-store';

type StripeEvent = {
  id?: string;
  type: string;
  data?: {
    object?: any;
  };
};

const PRICE_TO_PLAN: Record<string, Exclude<BillingPlan, ''>> = {
  [process.env.STRIPE_STARTER_PRICE_ID ?? '']: 'starter',
  [process.env.STRIPE_PRO_PRICE_ID ?? '']: 'professional',
  [process.env.STRIPE_AGENCY_PRICE_ID ?? '']: 'agency',
  [process.env.STRIPE_ENTERPRISE_PRICE_ID ?? '']: 'enterprise',
};

const CERT_RENEWAL_AMOUNT_CENTS = 29900;

function getSubscriptionUnitAmount(session: any): number | null {
  return session?.items?.[0]?.price?.unit_amount ?? session?.display_items?.[0]?.amount ?? session?.amount_total ?? null;
}

function resolvePlan(session: any): Exclude<BillingPlan, ''> {
  const metadataPriceId = String(session?.metadata?.priceId ?? '');
  const lineItemPriceId = String(session?.items?.[0]?.price?.id ?? '');
  const mappedFromPrice = PRICE_TO_PLAN[metadataPriceId] ?? PRICE_TO_PLAN[lineItemPriceId];
  if (mappedFromPrice) return mappedFromPrice;

  const metadataPlan = String(session?.metadata?.plan ?? '').toLowerCase();
  if (metadataPlan === 'starter' || metadataPlan === 'professional' || metadataPlan === 'agency' || metadataPlan === 'enterprise') {
    return metadataPlan;
  }

  return mapAmountToPlan(getSubscriptionUnitAmount(session));
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

    const metadataPlan = session?.metadata?.plan;
    const amount = getSubscriptionUnitAmount(session);
    const isCertRenewal = metadataPlan === 'cert_renewal' || amount === CERT_RENEWAL_AMOUNT_CENTS;

    if (isCertRenewal) {
      processedStripeEvents.add(event.id);
      return NextResponse.json({ ok: true, customerId, renewed: true });
    }

    const plan = resolvePlan(session);
    const billing = upsertBillingByCustomer(customerId, { active: true, plan });

    await scheduleOnboardingSequence({
      tenantId: String(session?.client_reference_id ?? customerId),
      email: String(session?.customer_details?.email ?? `${customerId}@example.com`),
      firstName: String(session?.customer_details?.name ?? '').split(' ')[0],
      planName: plan,
    });

    processedStripeEvents.add(event.id);
    return NextResponse.json({ ok: true, customerId, billing, onboardingScheduled: true, plan });
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
