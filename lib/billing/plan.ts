import { planRank, type PlanTier } from '@/lib/plans';

export type BillingPlan = PlanTier | '';

export const PLAN_AMOUNT_TO_TIER: Record<number, Exclude<BillingPlan, ''>> = {
  4900: 'starter',
  24900: 'professional',
  79900: 'agency',
};

export function mapAmountToPlan(amount: number | null | undefined): Exclude<BillingPlan, ''> {
  if (typeof amount !== 'number') return 'starter';
  return PLAN_AMOUNT_TO_TIER[amount] ?? 'starter';
}

export function getPlanPageLimit(plan: BillingPlan, isAdmin = false): number {
  if (isAdmin || plan === 'agency' || plan === 'enterprise') return Number.POSITIVE_INFINITY;
  if (plan === 'starter') return 10;
  return 50;
}

export function canUseEvidenceScreenshots(plan: BillingPlan, isAdmin = false): boolean {
  return isAdmin || planRank(plan) >= planRank('professional');
}

export function capitalizePlan(plan: BillingPlan, isAdmin = false): string {
  if (isAdmin) return 'Admin';
  if (plan === 'agency') return 'Agency';
  if (plan === 'professional') return 'Professional';
  if (plan === 'enterprise') return 'Enterprise';
  if (plan === 'starter') return 'Starter';
  return 'Free';
}
