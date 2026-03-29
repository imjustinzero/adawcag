import { NextResponse } from 'next/server';
import { recordFixStarted } from '@/lib/outcomes/tracker';

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await recordFixStarted(id);
  return NextResponse.json({ ok: true });
}
