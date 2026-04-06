import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ADAWCAG.org – ADA & WCAG 2.1 Compliance Platform',
  description: 'ADAWCAG.org provides ADA and WCAG 2.1 compliance scanning, remediation guidance, and reporting.',
};


const PAGE_COPY: Record<string, { title: string; description: string }> = {
  'ada-wcag-scan-tool': { title: 'ADA WCAG Scan Tool', description: 'Run automated scans and prioritize remediation.' },
  pricing: { title: 'Pricing', description: 'Compare Starter, Professional, Agency, and Enterprise plans.' },
  ecommerce: { title: 'E-Commerce Accessibility', description: 'Resources for online stores and checkout compliance.' },
  docs: { title: 'Documentation', description: 'Guides, API usage, and integration walkthroughs.' },
  locations: { title: 'Locations', description: 'Regional accessibility compliance coverage.' },
  security: { title: 'Security', description: 'Security controls, data handling, and privacy practices.' },
  accessibility: { title: 'Accessibility Statement', description: 'Our commitment to accessible software.' },
  vpat: { title: 'VPAT', description: 'VPAT and accessibility conformance reports.' },
  changelog: { title: 'Changelog', description: 'Recent product updates and release notes.' },
  risk: { title: 'Risk Intelligence', description: 'Legal and remediation risk scoring overview.' },
  contact: { title: 'Contact', description: 'Talk to sales, support, or compliance specialists.' },
  demo: { title: 'Demo', description: 'Book a platform walkthrough and live Q&A.' },
  'compliance-calendar': { title: 'Compliance Calendar', description: 'Track accessibility deadlines and reporting cycles.' },
  faq: { title: 'FAQ', description: 'Common questions and setup answers.' },
  signup: { title: 'Sign up', description: 'Create your ADAWCAG account and start your first scan.' },
  'sites': { title: 'Sites', description: 'Manage your monitored sites.' },
};

export default async function LocaleSlugPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const copy = PAGE_COPY[slug] ?? { title: 'Coming soon', description: 'This page is being prepared.' };

  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <h1>{copy.title}</h1>
      <p>{copy.description}</p>
      {slug === 'docs' ? (
        <section className="card" style={{ marginTop: '1rem' }}>
          <h2>API</h2>
          <p>API Reference is available in this documentation page at #{'api'}.</p>
          <Link href={`/${locale}/docs#api`}>Go to API section</Link>
          <h3 id="api" style={{ marginTop: '1rem' }}>Available endpoints</h3>
          <ul>
            <li>POST /api/scans</li>
            <li>GET /api/scans/:id/status</li>
            <li>GET /api/reports/:id/download</li>
            <li>GET /api/public/score/:orgId</li>
          </ul>
        </section>
      ) : null}
      <p style={{ marginTop: '1rem' }}>
        Coming soon. Return to <Link href="/">homepage</Link>.
      </p>
    </main>
  );
}
