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
}
