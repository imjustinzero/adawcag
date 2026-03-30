import Link from 'next/link';
import { PLAN_FEATURES } from '@/lib/plans';

const ctaByPlan = {
  starter: '/en/signup?plan=starter',
  professional: '/en/signup?plan=professional',
  agency: '/en/signup?plan=agency',
  enterprise: '/en/contact',
} as const;

export default function PricingPage() {
  return (
    <main className="container" style={{ padding: '3rem 0' }}>
      <h1>Simple, transparent pricing.</h1>
      <p>Choose the plan that matches your compliance program.</p>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
        {Object.entries(PLAN_FEATURES).map(([key, plan]) => (
          <article key={key} className="card">
            <h2>{plan.label}</h2>
            <p className="kpi">{plan.priceLabel}</p>
            <p className="text-sm">Sites: {String(plan.sitesAllowed)}</p>
            <p className="text-sm">Pages per scan: {String(plan.pagesPerScan)}</p>
            <ul style={{ margin: '0.75rem 0 1rem 1rem' }}>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Link className="btn btn-primary" href={ctaByPlan[key as keyof typeof ctaByPlan]}>
              {key === 'enterprise' ? 'Contact Us' : 'Get started'}
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
