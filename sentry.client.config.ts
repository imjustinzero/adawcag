import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1,
  beforeSend(event) {
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
    }
    return event;
  },
  ignoreErrors: ['ResizeObserver loop limit exceeded', 'Non-Error promise rejection captured', /^Network request failed/],
});
