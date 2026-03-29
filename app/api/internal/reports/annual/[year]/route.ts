import { NextResponse } from 'next/server';
import { generateAnnualReport } from '@/lib/reports/annual-report-generator';

export async function GET(_request: Request, { params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const report = await generateAnnualReport(Number(year));
  return NextResponse.json({ report });
}
