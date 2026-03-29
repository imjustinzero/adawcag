import { NextRequest, NextResponse } from 'next/server';
import { validateResearchApiKey } from '@/lib/research/data';

export async function POST(request: NextRequest) {
  if (!validateResearchApiKey(request.headers.get('x-research-key'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  return NextResponse.json({ queued: true, dataset: body.dataset, format: body.format, status: 'export_queued' }, { status: 202 });
}
