import { NextResponse } from 'next/server';
import { calculateConformanceTrajectory } from '@/lib/trajectory/conformance-path';

const demoViolations = [
  { rule_id: 'color-contrast', page_url: 'https://example.com' },
  { rule_id: 'label', page_url: 'https://example.com/checkout' },
  { rule_id: 'image-alt', page_url: 'https://example.com/products' },
];

export async function GET() {
  const data = await calculateConformanceTrajectory({ currentScore: 41, violations: demoViolations, deadline: new Date('2026-04-24'), industry: 'ecommerce', orgId: 'demo-org' });
  return NextResponse.json(data);
}
