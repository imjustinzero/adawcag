import { NextRequest, NextResponse } from 'next/server';
import { getResearchOutcomes, validateResearchApiKey } from '@/lib/research/data';

export async function GET(request: NextRequest) {
  const key = request.headers.get('x-research-key');
  if (!validateResearchApiKey(key)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const url = new URL(request.url);
  const data = await getResearchOutcomes({ industry: url.searchParams.get('industry') ?? '' });
  return NextResponse.json({ data, metadata: { total_records: data.length, last_updated: new Date().toISOString(), methodology_url: 'https://adawcag.org/methodology' } });
}
