export type BillingPlan = 'starter_lite' | 'starter' | 'professional' | 'agency' | '';

export const PLAN_AMOUNT_TO_TIER: Record<number, Exclude<BillingPlan, ''>> = {
  3998: 'starter_lite',
  14900: 'starter',
  24900: 'professional',
  79900: 'agency',
};

export function mapAmountToPlan(amount: number | null | undefined): Exclude<BillingPlan, ''> {
  if (typeof amount !== 'number') return 'professional';
  return PLAN_AMOUNT_TO_TIER[amount] ?? 'professional';
}

export function getPlanPageLimit(plan: BillingPlan, isAdmin = false): number {
  if (isAdmin || plan === 'agency') return Number.POSITIVE_INFINITY;
  if (plan === 'starter_lite') return 10;
  if (plan === 'starter') return 1;
  return 50;
}

export function canUseEvidenceScreenshots(plan: BillingPlan, isAdmin = false): boolean {
  return isAdmin || plan === 'professional' || plan === 'agency';
}

export function capitalizePlan(plan: BillingPlan, isAdmin = false): string {
  if (isAdmin) return 'Admin';
  if (plan === 'starter_lite') return 'Starter';
  if (plan === 'starter') return 'Basic';
  if (plan === 'agency') return 'Agency';
  if (plan === 'professional') return 'Professional';
  return 'Free';
}
