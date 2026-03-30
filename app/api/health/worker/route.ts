import { NextResponse } from 'next/server';
import { sendSlackAlert } from '@/lib/notifications/slack';
import { redis } from '@/lib/server/runtime-store';

// SETUP REQUIRED: Add UptimeRobot monitor for https://adawcag.org/api/health/worker
// Poll every 5 minutes and alert contact@adawcag.org plus the ops Slack channel.
export async function GET(): Promise<NextResponse> {
  const lastBeat = await redis.get('worker:scan:heartbeat');
  const age = lastBeat ? Date.now() - parseInt(lastBeat, 10) : Infinity;
  const alive = age < 60_000;

  if (!alive) {
    await sendSlackAlert({
      channel: process.env.SLACK_OPS_CHANNEL,
      message: `🔴 ADAWCAG scan worker is DOWN. Last heartbeat age: ${age}ms. Scans are not processing.`,
    });
  }

  return NextResponse.json({ alive, lastBeat, ageMs: age });
}
