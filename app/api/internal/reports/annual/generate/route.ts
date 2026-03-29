import { NextRequest, NextResponse } from 'next/server';
import { generateAnnualReport } from '@/lib/reports/annual-report-generator';

export async function POST(request: NextRequest) {
  const { year } = await request.json();
  const report = await generateAnnualReport(year ?? new Date().getUTCFullYear());
  return NextResponse.json({ report, pdfUrl: `https://adawcag.org/research/reports/${report.year}.pdf` });
}
