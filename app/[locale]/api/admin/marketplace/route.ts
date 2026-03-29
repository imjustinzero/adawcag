import { NextRequest, NextResponse } from 'next/server';
import { marketplaceDevelopers } from '@/lib/admin/data-store';
import { requireAdminSession } from '@/lib/auth/require-admin-session';

type Action = 'approve' | 'reject';

async function readPayload(request: NextRequest): Promise<{ developerId: string; action: Action }> {
  const type = request.headers.get('content-type') ?? '';

  if (type.includes('application/json')) {
    const body = await request.json();
    return { developerId: String(body.developerId), action: body.action as Action };
  }

  const form = await request.formData();
  return {
    developerId: String(form.get('developerId') ?? ''),
    action: String(form.get('action') ?? '') as Action
  };
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const session = requireAdminSession(request);
    const { developerId, action } = await readPayload(request);

    if (!developerId || (action !== 'approve' && action !== 'reject')) {
      return NextResponse.json({ error: 'INVALID_PAYLOAD' }, { status: 400 });
    }

    const developer = marketplaceDevelopers.find((item) => item.id === developerId);
    if (!developer) {
      return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    }

    if (action === 'approve') {
      developer.status = 'active';
      developer.verified = true;
      developer.verifiedAt = new Date().toISOString();
      developer.verifiedByEmail = session.email;
    } else {
      developer.status = 'rejected';
      developer.verified = false;
      developer.verifiedAt = null;
      developer.verifiedByEmail = null;
    }

    return NextResponse.json({ ok: true, developer });
  } catch (error) {
    const status = String(error).includes('UNAUTHORIZED') ? 401 : 500;
    return NextResponse.json({ error: status === 401 ? 'UNAUTHORIZED' : 'MARKETPLACE_ADMIN_UPDATE_FAILED' }, { status });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return PATCH(request);
}
