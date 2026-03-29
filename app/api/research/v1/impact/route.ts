import { NextRequest, NextResponse } from 'next/server';
import { getResearchImpact, validateResearchApiKey } from '@/lib/research/data';

export async function GET(request: NextRequest) {
  if (!validateResearchApiKey(request.headers.get('x-research-key'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await getResearchImpact();
  return NextResponse.json({ data, metadata: { total_records: data.length, aggregate_only: true } });
}
