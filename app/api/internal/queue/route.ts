import { NextResponse } from 'next/server';
import { killStuckScans, processScanQueues, scanQueues, scanRunningByTier } from '@/lib/server/runtime-store';

export async function GET(): Promise<NextResponse> {
  processScanQueues();
  const killed = killStuckScans();

  const queued = Object.values(scanQueues).reduce((sum, queue) => sum + queue.length, 0);
  const running = Object.values(scanRunningByTier).reduce((sum, lane) => sum + lane.size, 0);

  return NextResponse.json({
    queued,
    running,
    killedStuck: killed.length,
    killed,
    lanes: {
      starter: { queued: scanQueues.starter.length, running: scanRunningByTier.starter.size, concurrency: 1 },
      professional: { queued: scanQueues.professional.length, running: scanRunningByTier.professional.size, concurrency: 3 },
      agency: { queued: scanQueues.agency.length, running: scanRunningByTier.agency.size, concurrency: 3 },
      enterprise: { queued: scanQueues.enterprise.length, running: scanRunningByTier.enterprise.size, concurrency: 5 },
    },
  });
}
