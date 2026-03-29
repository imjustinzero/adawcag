type ScanJob = {
  id: string;
  orgId: string;
  url: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
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

const GLOBAL_SCAN_LIMIT = 10;
const PER_ORG_SCAN_LIMIT = 2;
const STUCK_SCAN_MS = 5 * 60 * 1000;
const PDF_TIMEOUT_MS = 60 * 1000;

export const scanQueue: ScanJob[] = [];
export const scanRunning = new Map<string, ScanJob>();

export const pdfJobs = new Map<string, PdfJob>();
export const reportPdfUrls = new Map<string, string>();

export const webhookFailures: WebhookFailure[] = [];
export const orgNotifications = new Map<string, string[]>();
export const andrewAlerts: string[] = [];

export const processedStripeEvents = new Set<string>();

export const ipScanCounter = new Map<string, number[]>();
export const domainScanCounter = new Map<string, number>();
export const rateLimitViolations: Array<{ ip: string; reason: string; createdAt: number }> = [];


const redisStore = new Map<string, string>();

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

export const scrapeUsage = {
  google: { requestsThisSecond: 0, secondBucket: 0 },
  yelp: { dailyCalls: 0, dayBucket: '' },
};

function now(): number {
  return Date.now();
}

export function enqueueScan(orgId: string, url: string): { job: ScanJob; position: number; etaMinutes: number } {
  const job: ScanJob = { id: crypto.randomUUID(), orgId, url, status: 'queued', createdAt: now() };
  scanQueue.push(job);
  processScanQueue();

  const position = scanQueue.findIndex((queuedJob) => queuedJob.id === job.id) + 1;
  const etaMinutes = position > 0 ? Math.max(1, Math.ceil(position * 0.75)) : 0;
  return { job, position: Math.max(position, 0), etaMinutes };
}

function runningForOrg(orgId: string): number {
  return Array.from(scanRunning.values()).filter((job) => job.orgId === orgId).length;
}

export function processScanQueue(): void {
  if (scanRunning.size >= GLOBAL_SCAN_LIMIT || scanQueue.length === 0) {
    return;
  }

  for (let i = 0; i < scanQueue.length && scanRunning.size < GLOBAL_SCAN_LIMIT; i += 1) {
    const candidate = scanQueue[i];
    if (runningForOrg(candidate.orgId) >= PER_ORG_SCAN_LIMIT) {
      continue;
    }

    candidate.status = 'running';
    candidate.startedAt = now();
    scanRunning.set(candidate.id, candidate);
    scanQueue.splice(i, 1);
    i -= 1;
  }
}

export function releaseScan(jobId: string, success = true): void {
  const job = scanRunning.get(jobId);
  if (!job) return;
  job.status = success ? 'completed' : 'failed';
  job.completedAt = now();
  scanRunning.delete(jobId);
  processScanQueue();
}

export function killStuckScans(): Array<{ jobId: string; orgId: string }> {
  const killed: Array<{ jobId: string; orgId: string }> = [];
  const cutoff = now() - STUCK_SCAN_MS;
  for (const job of scanRunning.values()) {
    if ((job.startedAt ?? 0) < cutoff) {
      scanRunning.delete(job.id);
      job.status = 'failed';
      killed.push({ jobId: job.id, orgId: job.orgId });
      enqueueScan(job.orgId, job.url);
    }
  }
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
