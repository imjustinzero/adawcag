import { NextRequest, NextResponse } from 'next/server';
import { getDatasetsMetadata, validateResearchApiKey } from '@/lib/research/data';

export async function GET(request: NextRequest) {
  if (!validateResearchApiKey(request.headers.get('x-research-key'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await getDatasetsMetadata();
  return NextResponse.json({ data });
}
