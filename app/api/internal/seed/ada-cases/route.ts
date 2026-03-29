import { NextResponse } from 'next/server';
import { ADA_CASES } from '@/lib/seeds/ada-cases';

export async function POST(): Promise<NextResponse> {
  try {
    return NextResponse.json({
      inserted: ADA_CASES.length,
      skipped: 0,
      note: 'Scaffold endpoint created; wire Supabase + Anthropic generation for remaining 45 cases.'
    });
  } catch (error) {
    return NextResponse.json({ error: 'SEED_ADA_CASES_FAILED', detail: String(error) }, { status: 500 });
  }
}
