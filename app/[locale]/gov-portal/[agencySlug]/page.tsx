import type { CSSProperties } from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { addGovAuditLog, getAgencyBySlug, getAgencyStats, verifyGovPortalSession } from '@/lib/gov-portal/store';

function toLinePoints(scores: number[]): string {
  if (!scores.length) return '';
  const width = 280;
  const height = 80;
  const step = scores.length > 1 ? width / (scores.length - 1) : width;
  return scores
    .map((score, index) => {
      const x = index * step;
      const y = height - (score / 100) * height;
      return `${x},${y}`;
    })
    .join(' ');
}

export default async function GovPortalPage({ params }: { params: { locale: string; agencySlug: string } }) {
  const cookieStore = await cookies();
  const session = verifyGovPortalSession(cookieStore.get('gov_portal_session')?.value);
  const agency = getAgencyBySlug(params.agencySlug);

  if (!agency) return <main>Agency not found.</main>;
  if (!session || session.agencyId !== agency.id) {
    redirect(`/${params.locale}/gov-portal/${params.agencySlug}/login`);
  }

  addGovAuditLog(agency.id, session.memberEmail, 'dashboard_view', 'Viewed dashboard');
  const stats = getAgencyStats(agency.id, session.role === 'Dept_Manager' ? session.department : null);

  return (
    <main style={{ padding: 24, ['--primary' as string]: agency.primaryColor, ['--secondary' as string]: agency.secondaryColor } as CSSProperties}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>{agency.portalTitle}</h1>
          <p>{agency.name}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href={`/${params.locale}/gov-portal/${params.agencySlug}/admin`}>Admin</Link>
          <a href={`/${params.locale}/api/reports/generate`} target="_blank">Portfolio PDF</a>
          <a href={`/${params.locale}/api/reports/generate`} target="_blank">Executive PDF</a>
          <form action={`/${params.locale}/api/gov-portal/${params.agencySlug}/logout`} method="post"><button type="submit">Logout</button></form>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 12, marginTop: 20 }}>
        <article><strong>{stats.avgScore}</strong><div>Portfolio score</div></article>
        <article><strong>{stats.totalViolations}</strong><div>Total violations</div></article>
        <article><strong>{Math.round((stats.compliantCount / Math.max(stats.properties.length, 1)) * 100)}%</strong><div>Compliant</div></article>
        <article><strong>{stats.sla.onTrack}/{stats.sla.atRisk}/{stats.sla.overdue}</strong><div>SLA (On/At/Over)</div></article>
      </section>

      <h2 style={{ marginTop: 24 }}>Properties</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">URL</th><th align="left">Department</th><th align="left">Score</th><th align="left">Risk</th><th align="left">Last scan</th><th align="left">Timeline</th>
          </tr>
        </thead>
        <tbody>
          {stats.properties.map((property) => {
            const latest = property.scans[property.scans.length - 1];
            return (
              <tr key={property.id}>
                <td><Link href={`/${params.locale}/api/gov-portal/${params.agencySlug}/property/${property.id}`}>{property.url}</Link></td>
                <td>{property.department}</td>
                <td>{latest?.score ?? 0}</td>
                <td>{property.complianceStatus === 'compliant' ? 'Low' : 'High'}</td>
                <td>{latest?.scannedAt?.slice(0, 10)}</td>
                <td>
                  <svg width="280" height="80" role="img" aria-label={`Trend for ${property.url}`}>
                    <polyline fill="none" stroke="var(--primary)" strokeWidth="2" points={toLinePoints(property.scans.map((scan) => scan.score))} />
                  </svg>
                  <div style={{ background: '#e5e7eb', height: 8 }}><div style={{ background: 'var(--secondary)', width: `${property.remediationProgress}%`, height: 8 }} /></div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
