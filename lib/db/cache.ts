import { CACHE_TTL } from '@/lib/cache/strategy';
import { redis } from '@/lib/server/runtime-store';
import { prisma } from '@/lib/prisma';

type OrgPlan = {
  plan: string;
  limits: Record<string, number> | null;
  features: string[] | null;
};

export async function getCachedOrgPlan(orgId: string): Promise<OrgPlan | null> {
  const cacheKey = `v1:org:${orgId}:plan`;
  const cached = await redis.get(cacheKey);
  if (typeof cached === 'string') {
    return JSON.parse(cached) as OrgPlan;
  }

  const plan = await prisma.orgSubscription.findUnique({
    where: { orgId },
    select: { plan: true, limits: true, features: true },
  });
  if (!plan) return null;

  await redis.setex(cacheKey, CACHE_TTL.orgPlan, JSON.stringify(plan));
  return plan as OrgPlan;
}
