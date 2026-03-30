import { NextRequest, NextResponse } from 'next/server';
import { marketplaceDevelopers } from '@/lib/admin/data-store';
import { sendEmail } from '@/lib/email/send';
import { requireAdminSession } from '@/lib/auth/require-admin-session';

type Action = 'approve' | 'reject' | 'bulk-approve';

async function readPayload(request: NextRequest): Promise<{ developerId?: string; developerIds?: string[]; action: Action }> {
  const type = request.headers.get('content-type') ?? '';

  if (type.includes('application/json')) {
    const body = await request.json();
    return { developerId: body.developerId, developerIds: body.developerIds, action: body.action as Action };
  }

  const form = await request.formData();
  return {
    developerId: String(form.get('developerId') ?? ''),
    developerIds: form.getAll('developerIds').map(String),
    action: String(form.get('action') ?? '') as Action,
  };
}

function generateApiKey(devId: string): string {
  return `mk_live_${devId}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const session = requireAdminSession(request);
    const { developerId, developerIds, action } = await readPayload(request);

    const targetIds = action === 'bulk-approve' ? (developerIds ?? []) : developerId ? [developerId] : [];
    if (targetIds.length === 0 || !['approve', 'reject', 'bulk-approve'].includes(action)) {
      return NextResponse.json({ error: 'INVALID_PAYLOAD' }, { status: 400 });
    }

    const updated = [];
    for (const targetId of targetIds) {
      const developer = marketplaceDevelopers.find((item) => item.id === targetId);
      if (!developer) continue;

      if (action === 'approve' || action === 'bulk-approve') {
        developer.status = 'active';
        developer.verified = true;
        developer.apiKey = developer.apiKey ?? generateApiKey(developer.id);
        developer.verifiedAt = new Date().toISOString();
        developer.verifiedByEmail = session.email;
        await sendEmail({ to: developer.email, subject: 'Your ADAWCAG marketplace application was approved', html: `<p>Welcome ${developer.name}, your application has been approved and your API key is ready.</p>` });
      } else {
        developer.status = 'rejected';
        developer.verified = false;
        developer.apiKey = null;
        developer.verifiedAt = null;
        developer.verifiedByEmail = session.email;
        await sendEmail({ to: developer.email, subject: 'Update on your ADAWCAG marketplace application', html: `<p>Hi ${developer.name}, thanks for applying. We are unable to approve your application right now.</p>` });
      }

      updated.push(developer);
    }

    return NextResponse.json({ ok: true, updatedCount: updated.length, developers: updated });
  } catch (error) {
    const status = String(error).includes('UNAUTHORIZED') ? 401 : 500;
    return NextResponse.json({ error: status === 401 ? 'UNAUTHORIZED' : 'MARKETPLACE_ADMIN_UPDATE_FAILED' }, { status });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return PATCH(request);
}
