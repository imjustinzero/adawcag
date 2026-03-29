import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await request.json();
    return NextResponse.json({
      deployEventId: crypto.randomUUID(),
      scanId: crypto.randomUUID(),
      status: 'scanning',
      webhookUrl: '/api/webhooks/deploy-gate/status/mock-id',
      received: payload
    });
  } catch (error) {
    return NextResponse.json({ error: 'DEPLOY_GATE_FAILED', detail: String(error) }, { status: 500 });
  }
}
