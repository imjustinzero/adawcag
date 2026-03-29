import { NextRequest, NextResponse } from 'next/server';
import { calculateDisabilityImpactScore } from '@/lib/impact/disability-impact-score';

const demoViolations = [
  { rule_id: 'color-contrast', page_url: 'https://example.com' },
  { rule_id: 'label', page_url: 'https://example.com/checkout' },
];

export async function POST(_request: NextRequest, { params }: { params: Promise<{ scanId: string }> }) {
  const { scanId } = await params;
  const data = await calculateDisabilityImpactScore({ violations: demoViolations, siteUrl: `https://example.com/scans/${scanId}`, industry: 'ecommerce' });
  return NextResponse.json(data);
}

export async function GET(request: NextRequest) {
  return POST(request, { params: Promise.resolve({ scanId: 'cached' }) });
}
