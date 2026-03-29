import { NextRequest, NextResponse } from 'next/server';
import { trackViolationOutcome } from '@/lib/outcomes/tracker';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const outcomeId = await trackViolationOutcome(body);
  return NextResponse.json({ outcomeId }, { status: 201 });
}
