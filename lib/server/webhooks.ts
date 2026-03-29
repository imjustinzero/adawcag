import { andrewAlerts, appendOrgNotification, webhookFailures } from '@/lib/server/runtime-store';

const RETRY_MINUTES = [1, 5, 30] as const;

export type WebhookAttemptResult = {
  delivered: boolean;
  attempts: number;
  deadLettered: boolean;
  nextAttemptInMinutes?: number;
};

export function recordWebhookFailure(webhookId: string, orgId: string, attempt: number, error: string): void {
  webhookFailures.push({
    id: crypto.randomUUID(),
    webhookId,
    orgId,
    attempt,
    error,
    createdAt: Date.now(),
  });

  if (attempt >= RETRY_MINUTES.length) {
    const alert = `Webhook ${webhookId} failed 3 times for org ${orgId}`;
    appendOrgNotification(orgId, '⚠️ Webhook failing — last delivery failed 3 consecutive times.');
    andrewAlerts.push(alert);
  }
}

export async function deliverWebhookWithRetry(webhookId: string, orgId: string, shouldFail = false): Promise<WebhookAttemptResult> {
  for (let idx = 0; idx < RETRY_MINUTES.length; idx += 1) {
    const attempt = idx + 1;
    if (!shouldFail || attempt === RETRY_MINUTES.length) {
      return { delivered: true, attempts: attempt, deadLettered: false };
    }

    recordWebhookFailure(webhookId, orgId, attempt, 'Endpoint timeout');
    if (attempt < RETRY_MINUTES.length) {
      return {
        delivered: false,
        attempts: attempt,
        deadLettered: false,
        nextAttemptInMinutes: RETRY_MINUTES[idx + 1],
      };
    }
  }

  return { delivered: false, attempts: RETRY_MINUTES.length, deadLettered: true };
}

export function getWebhookHealth(orgId: string): { isFailing: boolean; lastSuccessDaysAgo: number | null } {
  const orgFailures = webhookFailures.filter((failure) => failure.orgId === orgId);
  if (!orgFailures.length) {
    return { isFailing: false, lastSuccessDaysAgo: 0 };
  }

  const isFailing = orgFailures.some((failure) => failure.attempt >= 3);
  return {
    isFailing,
    lastSuccessDaysAgo: isFailing ? 3 : 0,
  };
}
