import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,
  beforeSend(event) {
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
    }
    return event;
  },
});

export function setSentryOrgContext(userId: string, orgId: string, plan: string): void {
  Sentry.setUser({ id: userId, segment: plan });
  Sentry.setTag('org_id', orgId);
  Sentry.setTag('plan', plan);
}
