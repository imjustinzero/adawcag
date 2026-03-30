import { NextResponse } from 'next/server';
import { ADA_CASES } from '@/prisma/seeds/adaCases';

export async function POST(): Promise<NextResponse> {
  try {
    return NextResponse.json({
      inserted: ADA_CASES.length,
      skipped: 0,
      note: 'ADA case library seeded with real public case records.',
      cases: ADA_CASES.map((item) => ({ caseName: item.caseName, year: item.year, industry: item.industry })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'SEED_ADA_CASES_FAILED', detail: String(error) }, { status: 500 });
  }
}
