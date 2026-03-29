import { andrewAlerts, scrapeUsage } from '@/lib/server/runtime-store';

export type ScrapeSource = 'google_places' | 'yelp' | 'linkedin';

export function enforceScrapeLimits(source: ScrapeSource): { allowed: boolean; reason?: string } {
  const now = new Date();

  if (source === 'google_places') {
    const secondBucket = Math.floor(Date.now() / 1000);
    if (scrapeUsage.google.secondBucket !== secondBucket) {
      scrapeUsage.google.secondBucket = secondBucket;
      scrapeUsage.google.requestsThisSecond = 0;
    }

    scrapeUsage.google.requestsThisSecond += 1;
    if (scrapeUsage.google.requestsThisSecond > 100) {
      return { allowed: false, reason: 'google_places_rps_exceeded' };
    }
  }

  if (source === 'yelp') {
    const dayBucket = now.toISOString().slice(0, 10);
    if (scrapeUsage.yelp.dayBucket !== dayBucket) {
      scrapeUsage.yelp.dayBucket = dayBucket;
      scrapeUsage.yelp.dailyCalls = 0;
    }

    scrapeUsage.yelp.dailyCalls += 1;
    if (scrapeUsage.yelp.dailyCalls >= 4500) {
      andrewAlerts.push('Yelp usage hit 4,500/day safety threshold, scraper paused.');
      return { allowed: false, reason: 'yelp_daily_safety_limit_reached' };
    }
  }

  return { allowed: true };
}

export function getExponentialBackoffMs(attempt: number): number {
  return Math.min(30_000, 500 * 2 ** Math.max(0, attempt - 1));
}

export function getLinkedinDelayMs(): number {
  return (2 + Math.floor(Math.random() * 7)) * 1000;
}
