import { NextResponse } from 'next/server';
import { getBenchmarkSites } from '@/lib/benchmark/site-list-builder';

export async function GET(_request: Request, { params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const sites = await getBenchmarkSites(state);
  return NextResponse.json({ state, sites });
}
