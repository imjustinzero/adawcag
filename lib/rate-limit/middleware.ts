import { NextRequest, NextResponse } from 'next/server';
import { rateLimits } from '@/lib/rate-limit/tiers';

type LimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter: number;
};

export async function applyRateLimit(
  request: NextRequest,
  limiter: { limit: (key: string) => Promise<{ success: boolean; limit: number; remaining: number; reset: number }> },
  identifier: string,
): Promise<LimitResult> {
  const result = await limiter.limit(identifier);
  const reset = typeof result.reset === 'number' ? result.reset : Math.floor(Date.now() / 1000) + 60;
  const retryAfter = Math.max(1, reset - Math.floor(Date.now() / 1000));

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset,
    retryAfter,
  };
}

export function withRateLimitHeaders(response: NextResponse, limit: LimitResult, requestId: string): NextResponse {
  response.headers.set('X-RateLimit-Limit', String(limit.limit));
  response.headers.set('X-RateLimit-Remaining', String(limit.remaining));
  response.headers.set('X-RateLimit-Reset', String(limit.reset));
  response.headers.set('X-Request-ID', requestId);
  if (!limit.success) response.headers.set('Retry-After', String(limit.retryAfter));
  return response;
}

export function createRateLimitError(limit: LimitResult, requestId: string): NextResponse {
  const response = NextResponse.json(
    { error: 'Rate limit exceeded', retryAfter: limit.retryAfter, upgrade: 'https://adawcag.org/pricing' },
    { status: 429 },
  );
  return withRateLimitHeaders(response, limit, requestId);
}

export async function applyPublicApiRateLimit(request: NextRequest): Promise<NextResponse | null> {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const limit = await applyRateLimit(request, rateLimits.public.freeAudit, ip);
  if (!limit.success) return createRateLimitError(limit, requestId);
  return null;
}
