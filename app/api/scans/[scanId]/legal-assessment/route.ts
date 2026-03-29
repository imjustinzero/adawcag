import { NextRequest, NextResponse } from 'next/server';
import { generateLegalRiskAssessment } from '@/lib/legal/risk-assessment';

export async function GET(_: NextRequest, context: { params: { scanId: string } }): Promise<NextResponse> {
  try {
    return NextResponse.json({ assessmentId: null, status: 'not_generated', scanId: context.params.scanId });
  } catch (error) {
    return NextResponse.json({ error: 'LEGAL_ASSESSMENT_GET_FAILED', detail: String(error) }, { status: 500 });
  }
}

export async function POST(_: NextRequest, context: { params: { scanId: string } }): Promise<NextResponse> {
  try {
    const assessment = await generateLegalRiskAssessment(context.params.scanId, 'placeholder-org');
    return NextResponse.json({ assessmentId: `${context.params.scanId}-assessment`, status: 'completed', assessment });
  } catch (error) {
    return NextResponse.json({ error: 'LEGAL_ASSESSMENT_POST_FAILED', detail: String(error) }, { status: 500 });
  }
}
