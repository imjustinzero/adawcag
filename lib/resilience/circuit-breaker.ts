import { logger } from '@/lib/logger';

export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime?: Date;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private readonly threshold = 5,
    private readonly timeout = 60000,
    private readonly name = 'default',
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      const elapsed = Date.now() - (this.lastFailureTime?.getTime() ?? 0);
      if (elapsed < this.timeout) throw new Error(`Circuit breaker OPEN: ${this.name}`);
      this.state = 'half-open';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failures += 1;
    this.lastFailureTime = new Date();
    if (this.failures >= this.threshold) {
      this.state = 'open';
      logger.error({ circuit: this.name }, 'Circuit breaker opened');
    }
  }
}

export const breakers = {
  anthropic: new CircuitBreaker(5, 60000, 'anthropic'),
  stripe: new CircuitBreaker(3, 30000, 'stripe'),
  resend: new CircuitBreaker(5, 60000, 'resend'),
  samGov: new CircuitBreaker(5, 300000, 'sam-gov'),
  googlePlaces: new CircuitBreaker(5, 60000, 'google-places'),
};
