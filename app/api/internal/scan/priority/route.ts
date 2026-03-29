import { NextRequest, NextResponse } from 'next/server';
import { enqueueScan } from '@/lib/server/runtime-store';
import { sanitizeScanUrl } from '@/lib/security/url-sanitizer';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => ({}));
  const orgId = typeof body.orgId === 'string' ? body.orgId : 'internal';
  const scanUrl = sanitizeScanUrl(typeof body.url === 'string' ? body.url : '');

  if (!scanUrl) {
    return NextResponse.json({ error: 'INVALID_SCAN_URL' }, { status: 400 });
  }

  const queued = enqueueScan(orgId, scanUrl);
  return NextResponse.json({ priorityQueued: true, jobId: queued.job.id, queuePosition: queued.position });
}
