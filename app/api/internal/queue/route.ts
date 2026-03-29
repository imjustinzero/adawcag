import { NextResponse } from 'next/server';
import { killStuckScans, processScanQueue, scanQueue, scanRunning } from '@/lib/server/runtime-store';

export async function GET(): Promise<NextResponse> {
  processScanQueue();
  const killed = killStuckScans();

  return NextResponse.json({
    queued: scanQueue.length,
    running: scanRunning.size,
    killedStuck: killed.length,
    killed,
    limits: {
      global: 10,
      perOrg: 2,
      timeoutMinutes: 5,
    },
  });
}
