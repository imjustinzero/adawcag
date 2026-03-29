import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: {
    env: process.env.NODE_ENV,
    version: process.env.npm_package_version,
  },
  redact: ['password', 'api_key', 'stripe_key', 'authorization', 'cookie', 'x-api-key', 'email', 'phone'],
});
