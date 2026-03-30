import Link from 'next/link';
import { planRank, type PlanTier } from '@/lib/plans';

interface GatedFeatureProps {
  feature: string;
  requiredPlan: PlanTier;
  currentPlan: string;
  children: React.ReactNode;
}

export function GatedFeature({ feature, requiredPlan, currentPlan, children }: GatedFeatureProps) {
  const hasAccess = planRank(currentPlan) >= planRank(requiredPlan);

  if (!hasAccess) {
    return (
      <div className="relative">
        <div className="pointer-events-none select-none opacity-30 blur-sm">{children}</div>
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-black/60 p-4 text-center">
          <div className="mb-2 text-2xl">🔒</div>
          <p className="mb-1 text-sm font-semibold text-white">{feature}</p>
          <p className="mb-4 text-xs text-gray-300">Available on {capitalize(requiredPlan)} and above</p>
          <Link
            href={`/en/pricing?upgrade=true&from=${encodeURIComponent(currentPlan || 'free')}&to=${requiredPlan}`}
            className="rounded bg-green-500 px-4 py-2 text-xs font-semibold text-black hover:bg-green-400"
          >
            Upgrade to unlock →
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function capitalize(plan: PlanTier): string {
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}
