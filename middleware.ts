import { NextRequest, NextResponse } from 'next/server';
import { withApiHeaders } from '@/app/api/middleware';

export function middleware(request: NextRequest): NextResponse {
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  return withApiHeaders(request);
}

export const config = {
  matcher: ['/api/:path*'],
};
