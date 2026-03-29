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
}
