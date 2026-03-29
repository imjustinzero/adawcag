import { NextRequest, NextResponse } from 'next/server';
import { getResearchBenchmark, validateResearchApiKey } from '@/lib/research/data';

export async function GET(request: NextRequest) {
  const key = request.headers.get('x-research-key');
  if (!validateResearchApiKey(key)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const state = new URL(request.url).searchParams.get('state') ?? undefined;
  const data = await getResearchBenchmark({ state });
  return NextResponse.json({ data, metadata: { total_records: data.length, aggregate_only: true } });
}
