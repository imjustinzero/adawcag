import { NextRequest, NextResponse } from 'next/server';

const PLAN_LINKS: Record<string, string> = {
  starter: process.env.STRIPE_STARTER_LINK ?? '',
  professional: process.env.STRIPE_PROFESSIONAL_LINK ?? '',
  agency: process.env.STRIPE_AGENCY_LINK ?? '',
  enterprise: process.env.STRIPE_ENTERPRISE_LINK ?? '',
  cert_renewal: process.env.STRIPE_CERT_RENEWAL_LINK ?? '',
};

const PLAN_PRICE_IDS: Record<string, string> = {
  starter: process.env.STRIPE_STARTER_PRICE_ID ?? '',
  professional: process.env.STRIPE_PRO_PRICE_ID ?? '',
  agency: process.env.STRIPE_AGENCY_PRICE_ID ?? '',
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID ?? '',
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const contentType = request.headers.get('content-type') ?? '';
  let plan = '';
  let tenantId = '';
  let email = '';

  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => ({}));
    plan = typeof body.plan === 'string' ? body.plan : '';
    tenantId = typeof body.tenantId === 'string' ? body.tenantId : '';
    email = typeof body.email === 'string' ? body.email : '';
  } else {
    const formData = await request.formData();
    plan = String(formData.get('plan') ?? '');
    tenantId = String(formData.get('tenantId') ?? '');
    email = String(formData.get('email') ?? '');
  }

  const link = PLAN_LINKS[plan];
  if (!link) {
    return NextResponse.json({ error: 'PLAN_NOT_FOUND_OR_NOT_CONFIGURED', plan }, { status: 404 });
  }

  const checkoutUrl = new URL(link);
  if (tenantId) checkoutUrl.searchParams.set('client_reference_id', tenantId);
  if (email) checkoutUrl.searchParams.set('prefilled_email', email);
  checkoutUrl.searchParams.set('metadata_plan', plan);
  checkoutUrl.searchParams.set('metadata_priceId', PLAN_PRICE_IDS[plan] ?? '');
  checkoutUrl.searchParams.set('success_url', `${request.nextUrl.origin}/dashboard?checkout=success&plan=${plan}`);
  checkoutUrl.searchParams.set('cancel_url', `${request.nextUrl.origin}/en/pricing?checkout=cancelled&plan=${plan}`);

  if (!contentType.includes('application/json')) {
    return NextResponse.redirect(checkoutUrl, { status: 303 });
  }

  return NextResponse.json({ url: checkoutUrl.toString(), plan, priceId: PLAN_PRICE_IDS[plan] ?? null });
}
