export type PlanTier = 'starter' | 'professional' | 'agency' | 'enterprise';

export const PLAN_ORDER: PlanTier[] = ['starter', 'professional', 'agency', 'enterprise'];

export function planRank(plan: string): number {
  return PLAN_ORDER.indexOf((plan as PlanTier) ?? 'starter') + 1;
}

export const PLAN_FEATURES: Record<PlanTier, {
  label: string;
  priceLabel: string;
  sitesAllowed: number | 'unlimited';
  pagesPerScan: number | 'unlimited';
  scanSchedule: 'manual' | 'daily_weekly_monthly';
  features: string[];
}> = {
  starter: {
    label: 'Starter',
    priceLabel: '$49/mo',
    sitesAllowed: 1,
    pagesPerScan: 10,
    scanSchedule: 'manual',
    features: [
      'PDF report export',
      'Embeddable widget',
      'Compliance badge',
    ],
  },
  professional: {
    label: 'Professional',
    priceLabel: '$249/mo',
    sitesAllowed: 1,
    pagesPerScan: 50,
    scanSchedule: 'daily_weekly_monthly',
    features: [
      'Evidence screenshots',
      'VPAT/ACR export',
      'Up to 5 team members',
      'API access',
      'CI/CD webhooks',
      'Priority scan queue',
      'Kanban remediation',
    ],
  },
  agency: {
    label: 'Agency',
    priceLabel: '$799/mo',
    sitesAllowed: 'unlimited',
    pagesPerScan: 'unlimited',
    scanSchedule: 'daily_weekly_monthly',
    features: [
      'Unlimited team members',
      'AT session recording',
      'Document scanning',
      'White-label reports',
      'Client workspaces',
      'Certified blind tester review',
      'Dedicated onboarding',
    ],
  },
  enterprise: {
    label: 'Enterprise',
    priceLabel: 'Custom',
    sitesAllowed: 'unlimited',
    pagesPerScan: 'unlimited',
    scanSchedule: 'daily_weekly_monthly',
    features: [
      'SSO',
      '24/7 support',
      'Certified blind tester review',
      'Dedicated onboarding',
    ],
  },
};
