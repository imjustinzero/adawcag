import type { BillingPlan } from '@/lib/billing/plan';

type BillingRecord = {
  active: boolean;
  plan: BillingPlan;
};

const billingByCustomer = new Map<string, BillingRecord>();

export function getBillingByCustomer(customerId: string): BillingRecord {
  return billingByCustomer.get(customerId) ?? { active: false, plan: '' };
}

export function upsertBillingByCustomer(customerId: string, next: Partial<BillingRecord>): BillingRecord {
  const current = getBillingByCustomer(customerId);
  const merged: BillingRecord = {
    active: next.active ?? current.active,
    plan: next.plan ?? current.plan,
  };
  billingByCustomer.set(customerId, merged);
  return merged;
}
