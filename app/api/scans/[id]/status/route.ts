import { NextRequest, NextResponse } from 'next/server';
import { getScanById } from '@/lib/server/runtime-store';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const { id } = await params;
  const scan = getScanById(id);

  if (!scan) {
    return NextResponse.json({ error: 'SCAN_NOT_FOUND' }, { status: 404 });
  }

  const runningForMs = scan.status === 'running' && scan.startedAt ? Date.now() - scan.startedAt : 0;

  return NextResponse.json({
    id: scan.id,
    status: scan.status,
    failedAt: scan.failedAt ?? null,
    failureReason: scan.failureReason ?? null,
    retryCount: scan.retryCount,
    timeoutWarning: scan.status === 'running' && runningForMs > 15 * 60 * 1000,
  });
}
