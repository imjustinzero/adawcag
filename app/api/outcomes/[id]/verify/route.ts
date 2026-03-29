import { NextRequest, NextResponse } from 'next/server';
import { recordAaronVerification } from '@/lib/outcomes/tracker';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await recordAaronVerification(id, await request.json());
  return NextResponse.json({ ok: true });
}
