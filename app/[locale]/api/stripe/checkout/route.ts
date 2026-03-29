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
}
