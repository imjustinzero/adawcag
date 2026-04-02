import { NextRequest, NextResponse } from 'next/server';
import { queuePdf, reportPdfUrls } from '@/lib/server/runtime-store';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => ({}));
  const reportId = typeof body.reportId === 'string' ? body.reportId : '';

  if (!reportId) {
    return NextResponse.json({ error: 'MISSING_REPORT_ID' }, { status: 400 });
  }

  const existing = reportPdfUrls.get(reportId);
  if (existing) {
    return NextResponse.json({ status: 'cached', pdfUrl: existing, sections: ['Desktop Audit', 'Mobile Audit'] });
  }

  const job = queuePdf(reportId);
  return NextResponse.json({ status: 'queued', jobId: job.id, sections: ['Desktop Audit', 'Mobile Audit'] });
}
