<<<<<< codex/add-certification-renewal-and-install-tracking
import { NextRequest, NextResponse } from "next/server";

export const PLAN_LINKS: Record<string, string> = {
  cert_renewal:
    process.env.STRIPE_CERT_RENEWAL_LINK ??
    "https://buy.stripe.com/cert_renewal_placeholder",
};

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  let plan: string | undefined;
  let tenantId: string | undefined;
  let email: string | undefined;

  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => null);
    plan = body?.plan;
    tenantId = body?.tenantId;
    email = body?.email;
  } else {
    const formData = await request.formData();
    plan = String(formData.get("plan") ?? "");
    tenantId = String(formData.get("tenantId") ?? "");
    email = String(formData.get("email") ?? "");
  }

  if (!plan || !(plan in PLAN_LINKS)) {
    return NextResponse.json({ error: "Unsupported plan" }, { status: 400 });
  }

  const checkoutUrl = new URL(PLAN_LINKS[plan]);
  checkoutUrl.searchParams.set("client_reference_id", tenantId ?? "unknown");
  checkoutUrl.searchParams.set("prefilled_email", email ?? "");

  if (!contentType.includes("application/json")) {
    return NextResponse.redirect(checkoutUrl, { status: 303 });
  }

  return NextResponse.json({ url: checkoutUrl.toString() });
===
import { NextRequest, NextResponse } from 'next/server';

export const PLAN_LINKS: Record<string, string> = {
  starter_lite: 'https://buy.stripe.com/3cI4gAggwfLnbrH2Jp8g00g',
  single: '',
  pro: '',
  agency: '',
  contracts_addon: '',
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json().catch(() => ({}));
  const plan = typeof body?.plan === 'string' ? body.plan : '';
  const link = PLAN_LINKS[plan];

  if (!link) {
    return NextResponse.json({ error: 'PLAN_NOT_FOUND' }, { status: 404 });
  }

  return NextResponse.json({ url: link, plan });
>>>>>> main
}
