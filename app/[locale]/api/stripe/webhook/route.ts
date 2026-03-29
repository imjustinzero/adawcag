<<<<<< codex/add-certification-renewal-and-install-tracking
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CERT_RENEWAL_AMOUNT_CENTS = 29900;
const CERT_RENEWAL_WINDOW_DAYS = 90;

function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export async function POST(request: NextRequest) {
  const event = await request.json().catch(() => null);

  if (event?.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data?.object;
  const metadataPlan = session?.metadata?.plan;
  const amountTotal = session?.amount_total;
  const isCertRenewal =
    metadataPlan === "cert_renewal" || amountTotal === CERT_RENEWAL_AMOUNT_CENTS;

  if (!isCertRenewal) {
    return NextResponse.json({ received: true });
  }

  const tenantId =
    session?.metadata?.tenantId ?? session?.client_reference_id ?? session?.customer_details?.metadata?.tenantId;

  if (!tenantId) {
    return NextResponse.json({ error: "Missing tenant id" }, { status: 400 });
  }

  const cert = await prisma.accessibilityCertification.findFirst({
    where: { tenantId },
    orderBy: { expiresAt: "desc" },
  });

  if (!cert) {
    return NextResponse.json({ error: "Certification not found" }, { status: 404 });
  }

  const now = new Date();
  const expiresAt = addDays(now, CERT_RENEWAL_WINDOW_DAYS);

  await prisma.accessibilityCertification.update({
    where: { id: cert.id },
    data: {
      expiresAt,
      renewedAt: now,
      stripeSubId: session.subscription ? String(session.subscription) : cert.stripeSubId,
      status: "active",
    },
  });

  return NextResponse.json({ received: true, renewed: true });
=
import { NextRequest, NextResponse } from 'next/server';
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

function getSubscriptionUnitAmount(session: any): number | null {
  return session?.items?.[0]?.price?.unit_amount ?? session?.display_items?.[0]?.amount ?? null;
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
    const plan = mapAmountToPlan(amount);
    const billing = upsertBillingByCustomer(customerId, { active: true, plan });
    processedStripeEvents.add(event.id);

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
    processedStripeEvents.add(event.id);

    return NextResponse.json({ ok: true, customerId, billing });
  }

  processedStripeEvents.add(event.id);
  return NextResponse.json({ ok: true, ignored: event.type });
>>>>>> main
}
