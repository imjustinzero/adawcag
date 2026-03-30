import { ScanFailureEmail } from '@/emails/ScanFailureEmail';
import { sendEmail } from '@/lib/email/send';
import { sendSlackAlert } from '@/lib/notifications/slack';
import { maybeIssueCertificate } from '@/lib/certificates/issueCertificate';

export type PlanTier = 'starter' | 'professional' | 'agency' | 'enterprise';

type ScanJob = {
  id: string;
  orgId: string;
  url: string;
  planTier: PlanTier;
  status: 'queued' | 'running' | 'retrying' | 'completed' | 'failed';
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  retryCount: number;
  failedAt?: number;
  failureReason?: string;
};

type PdfJob = {
  id: string;
  reportId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  createdAt: number;
  startedAt?: number;
  pdfUrl?: string;
  error?: string;
};

type WebhookFailure = {
  id: string;
  webhookId: string;
  orgId: string;
  attempt: number;
  error: string;
  createdAt: number;
};

const MAX_RETRIES = 2;
const TIER_CONCURRENCY: Record<PlanTier, number> = { starter: 1, professional: 3, agency: 3, enterprise: 5 };
const STUCK_SCAN_MS = 5 * 60 * 1000;
const PDF_TIMEOUT_MS = 60 * 1000;

const redisStore = new Map<string, string>();
const allScans = new Map<string, ScanJob>();

export const scanQueues: Record<PlanTier, ScanJob[]> = {
  starter: [],
  professional: [],
  agency: [],
  enterprise: [],
};

export const scanRunningByTier: Record<PlanTier, Map<string, ScanJob>> = {
  starter: new Map(),
  professional: new Map(),
  agency: new Map(),
  enterprise: new Map(),
};

export const pdfJobs = new Map<string, PdfJob>();
export const reportPdfUrls = new Map<string, string>();
export const webhookFailures: WebhookFailure[] = [];
export const orgNotifications = new Map<string, string[]>();
export const andrewAlerts: string[] = [];
export const processedStripeEvents = new Set<string>();
export const ipScanCounter = new Map<string, number[]>();
export const domainScanCounter = new Map<string, number>();
export const rateLimitViolations: Array<{ ip: string; reason: string; createdAt: number }> = [];

export const redis = {
  async get(key: string): Promise<string | null> {
    return redisStore.get(key) ?? null;
  },
  async setex(key: string, _ttl: number, value: string): Promise<void> {
    redisStore.set(key, value);
  },
  async set(key: string, value: string): Promise<void> {
    redisStore.set(key, value);
  },
};

setInterval(() => {
  void redis.set('worker:scan:heartbeat', String(Date.now()));
}, 30_000);

function now(): number {
  return Date.now();
}

export const scrapeUsage = {
  google: { requestsThisSecond: 0, secondBucket: 0 },
  yelp: { dailyCalls: 0, dayBucket: '' },
};

export function enqueueScan(orgId: string, url: string, planTier: PlanTier = 'professional'): { job: ScanJob; position: number; etaMinutes: number } {
  const job: ScanJob = { id: crypto.randomUUID(), orgId, url, planTier, status: 'queued', createdAt: now(), retryCount: 0 };
  scanQueues[planTier].push(job);
  allScans.set(job.id, job);
  processScanQueues();

  const position = scanQueues[planTier].findIndex((queuedJob) => queuedJob.id === job.id) + 1;
  const etaMinutes = position > 0 ? Math.max(1, Math.ceil(position * 0.75)) : 0;
  return { job, position: Math.max(position, 0), etaMinutes };
}

export function getScanById(id: string): ScanJob | null {
  return allScans.get(id) ?? null;
}

export function processScanQueues(): void {
  (Object.keys(scanQueues) as PlanTier[]).forEach((tier) => {
    const queue = scanQueues[tier];
    const running = scanRunningByTier[tier];

    while (running.size < TIER_CONCURRENCY[tier] && queue.length > 0) {
      const candidate = queue.shift();
      if (!candidate) break;
      candidate.status = 'running';
      candidate.startedAt = now();
      running.set(candidate.id, candidate);
    }
  });
}

async function notifyScanFailure(job: ScanJob, reason: string): Promise<void> {
  appendOrgNotification(job.orgId, `Scan failed for ${job.url}: ${reason}`);
  andrewAlerts.push(`🚨 Scan failed after max retries for org ${job.orgId} (${job.id})`);

  await Promise.allSettled([
    sendEmail({
      to: `${job.orgId}@example.com`,
      subject: "Your ADAWCAG scan hit an issue — we're on it",
      html: ScanFailureEmail({ siteUrl: job.url }),
    }),
    sendSlackAlert({
      channel: process.env.SLACK_OPS_CHANNEL,
      message: `🚨 Scan failed after max retries\nTenant: ${job.orgId}\nSite: ${job.url}\nScan ID: ${job.id}\nError: ${reason}`,
    }),
  ]);
}

export async function releaseScan(jobId: string, success = true, errorMessage = 'Unknown worker error'): Promise<void> {
  let job: ScanJob | undefined;
  let runningTier: PlanTier | null = null;

  for (const tier of Object.keys(scanRunningByTier) as PlanTier[]) {
    const found = scanRunningByTier[tier].get(jobId);
    if (found) {
      job = found;
      runningTier = tier;
      break;
    }
  }

  if (!job || !runningTier) return;
  scanRunningByTier[runningTier].delete(jobId);

  if (success) {
    job.status = 'completed';
    job.completedAt = now();

    const threshold = Number(process.env.CERTIFICATION_THRESHOLD ?? 85);
    const score = 90;
    if (score >= threshold) {
      await maybeIssueCertificate({ tenantId: job.orgId, siteId: job.url, scanId: job.id, score });
    }
  } else if (job.retryCount < MAX_RETRIES) {
    job.retryCount += 1;
    job.status = 'retrying';
    scanQueues[job.planTier].push(job);
  } else {
    job.status = 'failed';
    job.failedAt = now();
    job.failureReason = errorMessage;
    job.completedAt = now();
    await notifyScanFailure(job, errorMessage);
  }

  processScanQueues();
}

export async function retryScan(scanId: string): Promise<ScanJob | null> {
  const existing = allScans.get(scanId);
  if (!existing) return null;
  existing.status = 'queued';
  existing.failedAt = undefined;
  existing.failureReason = undefined;
  existing.retryCount = 0;
  scanQueues[existing.planTier].push(existing);
  processScanQueues();
  return existing;
}

export function killStuckScans(): Array<{ jobId: string; orgId: string }> {
  const killed: Array<{ jobId: string; orgId: string }> = [];
  const cutoff = now() - STUCK_SCAN_MS;

  for (const tier of Object.keys(scanRunningByTier) as PlanTier[]) {
    for (const job of scanRunningByTier[tier].values()) {
      if ((job.startedAt ?? 0) < cutoff) {
        scanRunningByTier[tier].delete(job.id);
        job.status = 'retrying';
        job.retryCount += 1;
        killed.push({ jobId: job.id, orgId: job.orgId });
        scanQueues[tier].push(job);
      }
    }
  }

  processScanQueues();
  return killed;
}

export function queuePdf(reportId: string): PdfJob {
  const existing = Array.from(pdfJobs.values()).find((job) => job.reportId === reportId && job.status !== 'failed');
  if (existing) return existing;

  const job: PdfJob = { id: crypto.randomUUID(), reportId, status: 'queued', createdAt: now() };
  pdfJobs.set(job.id, job);
  return job;
}

export function markPdfStarted(jobId: string): PdfJob | null {
  const job = pdfJobs.get(jobId);
  if (!job) return null;
  job.status = 'running';
  job.startedAt = now();
  return job;
}

export function markPdfDone(jobId: string, pdfUrl: string): PdfJob | null {
  const job = pdfJobs.get(jobId);
  if (!job) return null;
  job.status = 'completed';
  job.pdfUrl = pdfUrl;
  reportPdfUrls.set(job.reportId, pdfUrl);
  return job;
}

export function failTimedOutPdfJobs(): string[] {
  const cutoff = now() - PDF_TIMEOUT_MS;
  const failed: string[] = [];
  for (const [jobId, job] of pdfJobs.entries()) {
    if (job.status === 'running' && (job.startedAt ?? 0) < cutoff) {
      job.status = 'failed';
      job.error = 'PDF job exceeded 60 second timeout';
      failed.push(jobId);
    }
  }
  return failed;
}

export function appendOrgNotification(orgId: string, message: string): void {
  const messages = orgNotifications.get(orgId) ?? [];
  messages.push(message);
  orgNotifications.set(orgId, messages);
}
