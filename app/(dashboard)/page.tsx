import Link from 'next/link';
import { DashboardEmptyState } from '@/components/dashboard/EmptyState';
import { DisabledButton } from '@/components/DisabledTooltip';
import { GatedFeature } from '@/components/GatedFeature';

export default function DashboardPage(): JSX.Element {
  const sitesCount = 0;
  const currentPlan = 'starter';
  const score = 72;

  if (sitesCount === 0) {
    return (
      <main className="container" style={{ padding: '2rem 0' }}>
        <DashboardEmptyState />
        <section className="card" style={{ marginTop: '1rem' }}>
          <p>Your PDF report will be ready after your first completed scan.</p>
          <p>→ Add your site and run a scan — takes under 5 minutes.</p>
          <Link className="btn btn-primary" href="/en/sites/new">
            Add site button
          </Link>
        </section>
        <section className="card" style={{ marginTop: '1rem' }}>
          <h3 style={{ marginTop: 0 }}>Recent scan history</h3>
          <p style={{ margin: 0 }}>🖥️ Desktop: 72 · 📱 Mobile: 61</p>
        </section>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <h1>Dashboard Command Center</h1>
      <div className="card" style={{ display: 'grid', gap: '.75rem' }}>
        <DisabledButton reason="Run a scan first to generate your PDF report.">Download PDF</DisabledButton>

        <GatedFeature currentPlan={currentPlan} feature="Export VPAT" requiredPlan="professional">
          <button className="btn btn-primary" type="button">Export VPAT/ACR</button>
        </GatedFeature>

        <GatedFeature currentPlan={currentPlan} feature="Invite Team Member" requiredPlan="professional">
          <button className="btn btn-primary" type="button">Invite Team Member</button>
        </GatedFeature>

        <GatedFeature currentPlan={currentPlan} feature="API Keys" requiredPlan="professional">
          <button className="btn btn-primary" type="button">API Keys</button>
        </GatedFeature>

        <section className="card">
          <p>Compliance certificates are issued when your site scores 85 or above.</p>
          <p>Your current score: {score}/100</p>
          <p>Points needed: {85 - score}</p>
          <p>Top issues blocking your certificate:</p>
          <ol>
            <li>Missing alt text — 8 violations — Add descriptive alt attributes.</li>
            <li>Low color contrast — 5 violations — Increase contrast to 4.5:1.</li>
            <li>Form label mismatch — 4 violations — Add explicit label associations.</li>
          </ol>
          <Link href="/en/docs">View all issues →</Link>
        </section>
      </div>
    </main>
  );
}
