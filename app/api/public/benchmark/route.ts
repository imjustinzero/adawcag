import { NextResponse } from 'next/server';
import { getBenchmarkSummary, getBenchmarkSites } from '@/lib/benchmark/site-list-builder';

export async function GET() {
  const summary = await getBenchmarkSummary();
  const sites = await getBenchmarkSites();
  return NextResponse.json({ summary, sites });
}
