import { NextRequest, NextResponse } from 'next/server';

export function withApiHeaders(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();

  response.headers.set('X-Request-ID', requestId);
  response.headers.set('X-RateLimit-Limit', '0');
  response.headers.set('X-RateLimit-Remaining', '0');
  response.headers.set('X-RateLimit-Reset', String(Math.floor(Date.now() / 1000)));
  return response;
}
