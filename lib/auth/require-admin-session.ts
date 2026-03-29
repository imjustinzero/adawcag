import { NextRequest } from 'next/server';

export type AdminSession = { email: string };

export function requireAdminSession(request: NextRequest): AdminSession {
  const email = request.headers.get('x-admin-email')?.toLowerCase() ?? '';

  if (!email || !email.endsWith('@adawcag.org')) {
    throw new Error('UNAUTHORIZED');
  }

  return { email };
}
