import { NextRequest, NextResponse } from 'next/server';

export const PLAN_LINKS: Record<string, string> = {
  cert_renewal: process.env.STRIPE_CERT_RENEWAL_LINK ?? 'https://buy.stripe.com/cert_renewal_placeholder',
  starter_lite: 'https://buy.stripe.com/3cI4gAggwfLnbrH2Jp8g00g',
  single: '',
  pro: '',
  agency: '',
  contracts_addon: '',
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
    return NextResponse.json({ error: 'PLAN_NOT_FOUND' }, { status: 404 });
  }

  const checkoutUrl = new URL(link);
  if (tenantId) checkoutUrl.searchParams.set('client_reference_id', tenantId);
  if (email) checkoutUrl.searchParams.set('prefilled_email', email);

  if (!contentType.includes('application/json')) {
    return NextResponse.redirect(checkoutUrl, { status: 303 });
  }

  return NextResponse.json({ url: checkoutUrl.toString(), plan });
}
