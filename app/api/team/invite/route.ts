import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => ({}));
  const invitedEmail = typeof body.email === 'string' ? body.email : '';
  if (!invitedEmail) {
    return NextResponse.json({ error: 'MISSING_EMAIL' }, { status: 400 });
  }

  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
  return NextResponse.json({
    invited: true,
    inviteToken: crypto.randomUUID(),
    expiresAt,
    message: 'Invite link expires in 48 hours.',
  });
}
