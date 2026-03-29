import { NextRequest, NextResponse } from 'next/server';
import { deliverWebhookWithRetry } from '@/lib/server/webhooks';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await request.json().catch(() => ({}));
    const orgId = typeof payload.orgId === 'string' ? payload.orgId : 'unknown-org';
    const webhookId = typeof payload.webhookId === 'string' ? payload.webhookId : crypto.randomUUID();
    const shouldFail = Boolean(payload.simulateFailure);
    const delivery = await deliverWebhookWithRetry(webhookId, orgId, shouldFail);

    return NextResponse.json({
      deployEventId: crypto.randomUUID(),
      scanId: crypto.randomUUID(),
      status: delivery.delivered ? 'delivered' : 'retrying',
      webhookDelivery: delivery,
      received: payload,
    });
  } catch (error) {
    return NextResponse.json({ error: 'DEPLOY_GATE_FAILED', detail: String(error) }, { status: 500 });
  }
}
