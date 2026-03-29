import { NextResponse } from 'next/server';

export async function GET(_: Request, context: { params: { deployEventId: string } }): Promise<NextResponse> {
  try {
    return NextResponse.json({
      deployEventId: context.params.deployEventId,
      gate: 'warning',
      violations_found: 0,
      regressions: [],
      report_url: null
    });
  } catch (error) {
    return NextResponse.json({ error: 'DEPLOY_GATE_STATUS_FAILED', detail: String(error) }, { status: 500 });
  }
}
