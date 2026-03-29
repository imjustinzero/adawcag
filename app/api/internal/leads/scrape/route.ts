import { NextRequest, NextResponse } from 'next/server';
import { andrewAlerts } from '@/lib/server/runtime-store';
import { enforceScrapeLimits, getExponentialBackoffMs, getLinkedinDelayMs, type ScrapeSource } from '@/lib/server/scrape-protection';

const scrapeFailures: Array<{ source: ScrapeSource; reason: string; createdAt: string }> = [];

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => ({}));
  const source = (body.source as ScrapeSource) || 'google_places';
  const simulate429 = Boolean(body.simulate429);

  const allowance = enforceScrapeLimits(source);
  if (!allowance.allowed) {
    scrapeFailures.push({ source, reason: allowance.reason ?? 'unknown', createdAt: new Date().toISOString() });
    andrewAlerts.push(`Scrape job blocked for ${source}: ${allowance.reason ?? 'unknown'}`);
    return NextResponse.json({ queued: false, error: allowance.reason }, { status: 429 });
  }

  const response: Record<string, unknown> = { queued: true, source };
  if (simulate429) {
    response.backoffMs = getExponentialBackoffMs(Number(body.attempt ?? 1));
  }

  if (source === 'linkedin') {
    response.randomDelayMs = getLinkedinDelayMs();
  }

  return NextResponse.json(response);
}
