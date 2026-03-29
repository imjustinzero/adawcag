import { andrewAlerts, domainScanCounter, ipScanCounter, rateLimitViolations } from '@/lib/server/runtime-store';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export function checkFreeAuditRateLimit(ip: string, targetUrl: string): { ok: boolean; reason?: string } {
  const now = Date.now();
  const ipHits = (ipScanCounter.get(ip) ?? []).filter((ts) => now - ts <= DAY_MS);
  const hourHits = ipHits.filter((ts) => now - ts <= HOUR_MS);

  if (hourHits.length >= 3) {
    rateLimitViolations.push({ ip, reason: 'ip_hour_limit', createdAt: now });
    return { ok: false, reason: 'IP limit exceeded: max 3 scans/hour' };
  }

  const hostname = new URL(targetUrl).hostname.toLowerCase();
  const lastDomainHit = domainScanCounter.get(hostname);
  if (lastDomainHit && now - lastDomainHit <= DAY_MS) {
    rateLimitViolations.push({ ip, reason: 'domain_daily_limit', createdAt: now });
    return { ok: false, reason: 'Domain already scanned in the last 24 hours' };
  }

  ipHits.push(now);
  ipScanCounter.set(ip, ipHits);
  domainScanCounter.set(hostname, now);

  if (ipHits.length > 10) {
    andrewAlerts.push(`IP ${ip} exceeded 10 scans/day and was temporarily blocked.`);
  }

  return { ok: true };
}
