import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const rateLimits = {
  public: {
    freeAudit: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      prefix: 'rl:public:audit',
      analytics: true,
    }),
    badgeView: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      prefix: 'rl:public:badge',
    }),
    shareReport: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 m'),
      prefix: 'rl:public:share',
    }),
  },
  starter: {
    scansPerDay: new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(5, '24 h'),
      prefix: 'rl:starter:scan',
    }),
    apiRequests: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      prefix: 'rl:starter:api',
    }),
    pdfDownloads: new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(10, '24 h'),
      prefix: 'rl:starter:pdf',
    }),
  },
  agency: {
    scansPerDay: new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(50, '24 h'),
      prefix: 'rl:agency:scan',
    }),
    apiRequests: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(500, '1 m'),
      prefix: 'rl:agency:api',
    }),
  },
  enterprise: {
    scansPerDay: new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(500, '24 h'),
      prefix: 'rl:enterprise:scan',
    }),
    apiRequests: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(2000, '1 m'),
      prefix: 'rl:enterprise:api',
    }),
    deployGate: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 m'),
      prefix: 'rl:enterprise:gate',
    }),
  },
  internal: {
    apiRequests: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10000, '1 m'),
      prefix: 'rl:internal:api',
    }),
  },
} as const;

export const burstLimits = {
  scan: new Ratelimit({
    redis,
    limiter: Ratelimit.tokenBucket(5, '30 s', 2),
    prefix: 'rl:burst:scan',
  }),
  aiCopilot: new Ratelimit({
    redis,
    limiter: Ratelimit.tokenBucket(10, '1 m', 3),
    prefix: 'rl:burst:copilot',
  }),
  pdfGenerate: new Ratelimit({
    redis,
    limiter: Ratelimit.tokenBucket(3, '1 m', 1),
    prefix: 'rl:burst:pdf',
  }),
} as const;
