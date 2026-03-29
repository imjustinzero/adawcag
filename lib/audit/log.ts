import { logger } from '@/lib/logger';

export async function auditLog(params: {
  orgId?: string;
  userId?: string;
  staffId?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  oldValue?: object;
  newValue?: object;
  result: 'success' | 'failure' | 'error';
  errorMessage?: string;
  request: Request;
}): Promise<void> {
  const ip = params.request.headers.get('x-forwarded-for')?.split(',')[0] ?? null;
  const userAgent = params.request.headers.get('user-agent') ?? null;

  logger.info({
    action: params.action,
    orgId: params.orgId,
    userId: params.userId,
    result: params.result,
    ip,
    userAgent,
    requestId: params.request.headers.get('x-request-id') ?? null,
  });
}
