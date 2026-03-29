import { NextRequest, NextResponse } from 'next/server';
import { sanitizeScanUrl } from '@/lib/security/url-sanitizer';
import { enqueueScan } from '@/lib/server/runtime-store';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => ({}));
  const orgId = typeof body.orgId === 'string' ? body.orgId : 'unknown-org';
  const scanUrl = sanitizeScanUrl(typeof body.url === 'string' ? body.url : '');

  if (!scanUrl) {
    return NextResponse.json({ error: 'INVALID_SCAN_URL', message: 'Only public http(s) URLs are permitted.' }, { status: 400 });
  }

  const queued = enqueueScan(orgId, scanUrl);
  return NextResponse.json({ queued: true, jobId: queued.job.id, queuePosition: queued.position, etaMinutes: queued.etaMinutes });
}
