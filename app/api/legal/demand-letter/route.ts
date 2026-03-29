import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    return NextResponse.json({
      demandLetterId: crypto.randomUUID(),
      scanId: crypto.randomUUID(),
      estimatedResponseTime: '8 minutes',
      received: body
    });
  } catch (error) {
    return NextResponse.json({ error: 'DEMAND_LETTER_FAILED', detail: String(error) }, { status: 500 });
  }
}
