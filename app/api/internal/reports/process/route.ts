import { NextResponse } from 'next/server';
import { failTimedOutPdfJobs, markPdfDone, markPdfStarted, pdfJobs } from '@/lib/server/runtime-store';

export async function POST(): Promise<NextResponse> {
  const timedOut = failTimedOutPdfJobs();

  const queuedJob = Array.from(pdfJobs.values()).find((job) => job.status === 'queued');
  if (!queuedJob) {
    return NextResponse.json({ processed: false, timedOut });
  }

  markPdfStarted(queuedJob.id);
  const url = `https://storage.supabase.local/reports/${queuedJob.reportId}.pdf`;
  markPdfDone(queuedJob.id, url);

  return NextResponse.json({ processed: true, jobId: queuedJob.id, pdfUrl: url, timedOut });
}
