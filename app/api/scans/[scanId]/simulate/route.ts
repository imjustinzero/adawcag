import { NextRequest, NextResponse } from 'next/server';
import { runScreenReaderSimulation } from '@/lib/simulation/screen-reader-engine';

export async function POST(_request: NextRequest, { params }: { params: Promise<{ scanId: string }> }) {
  const { scanId } = await params;
  const report = await runScreenReaderSimulation({ url: 'https://adawcag.org', industry: 'government', orgId: `org-${scanId}` });
  return NextResponse.json({ status: 'completed', report });
}

export async function GET(request: NextRequest, ctx: { params: Promise<{ scanId: string }> }) {
  return POST(request, ctx);
}
