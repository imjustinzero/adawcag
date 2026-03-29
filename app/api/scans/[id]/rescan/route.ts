import { NextRequest, NextResponse } from 'next/server';
import { sanitizeScanUrl } from '@/lib/security/url-sanitizer';
import { enqueueScan } from '@/lib/server/runtime-store';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => ({}));
  const rawUrl = typeof body.url === 'string' ? body.url : '';
  const orgId = typeof body.orgId === 'string' ? body.orgId : 'unknown-org';

  const url = sanitizeScanUrl(rawUrl);
  if (!url) {
    return NextResponse.json({ error: 'INVALID_SCAN_URL', message: 'Scan URL must be public http(s).' }, { status: 400 });
  }

  const { job, position, etaMinutes } = enqueueScan(orgId, url);
  return NextResponse.json({ queued: true, jobId: job.id, queuePosition: position, etaMinutes });
}
