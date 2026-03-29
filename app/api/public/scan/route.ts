import { NextRequest, NextResponse } from 'next/server';
import { checkFreeAuditRateLimit } from '@/lib/security/rate-limit';
import { sanitizeScanUrl } from '@/lib/security/url-sanitizer';
import { enqueueScan } from '@/lib/server/runtime-store';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => ({}));
  const honeypot = typeof body.honeypot === 'string' ? body.honeypot.trim() : '';
  if (honeypot) {
    return NextResponse.json({ error: 'BOT_DETECTED' }, { status: 400 });
  }

  const rawUrl = typeof body.url === 'string' ? body.url : '';
  const scanUrl = sanitizeScanUrl(rawUrl);
  if (!scanUrl) {
    return NextResponse.json({ error: 'INVALID_SCAN_URL', message: 'Only public http(s) URLs are allowed.' }, { status: 400 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rateLimit = checkFreeAuditRateLimit(ip, scanUrl);
  if (!rateLimit.ok) {
    return NextResponse.json({ error: 'RATE_LIMITED', message: rateLimit.reason }, { status: 429 });
  }

  const { job, position, etaMinutes } = enqueueScan('public', scanUrl);
  return NextResponse.json({
    jobId: job.id,
    status: job.status,
    queue: {
      position,
      message: position > 0 ? `You're #${position} in queue, ~${etaMinutes} minutes` : 'Scan started',
      etaMinutes,
    },
  });
}
