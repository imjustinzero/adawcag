import { NextRequest, NextResponse } from 'next/server';
import { retryScan } from '@/lib/server/runtime-store';

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const { id } = await params;
  const scan = await retryScan(id);
  if (!scan) {
    return NextResponse.json({ error: 'SCAN_NOT_FOUND' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, scanId: id, status: scan.status });
}
