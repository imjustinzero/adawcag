import type { Metadata } from 'next';
import { certificateReviewQueue, certifications, CertificationStatus } from '@/lib/admin/data-store';

export const metadata: Metadata = {
  title: 'ADAWCAG.org – ADA & WCAG 2.1 Compliance Platform',
  description: 'ADAWCAG.org provides ADA and WCAG 2.1 compliance scanning, remediation guidance, and reporting.',
};


type SearchParams = { status?: CertificationStatus };

const badgeStyle = { display: 'inline-block', padding: '4px 10px', borderRadius: 999, background: '#eef2ff' };

export default function AdminCertificationsPage({ searchParams }: { searchParams?: SearchParams }): JSX.Element {
  const status = searchParams?.status;
  const now = new Date();
  const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const activeCount = certifications.filter((cert) => cert.status === 'active').length;
  const expiringThisWeek = certifications.filter((cert) => {
    const expiresAt = new Date(cert.expiresAt);
    return cert.status !== 'expired' && expiresAt >= now && expiresAt <= in7Days;
  }).length;

  const filtered = status ? certifications.filter((cert) => cert.status === status) : certifications;

  return (
    <section>
      <h1>Certifications</h1>
      <p style={badgeStyle}>{activeCount} Active / {expiringThisWeek} Expiring This Week</p>

      <h2 style={{ marginTop: 24 }}>Certificates Awaiting Review</h2>
      <table>
        <thead>
          <tr><th>Tenant</th><th>Site URL</th><th>Score</th><th>Scan Date</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {certificateReviewQueue.map((task) => (
            <tr key={task.id}>
              <td>{task.tenantName}</td>
              <td>{task.siteUrl}</td>
              <td>{task.score}</td>
              <td>{new Date(task.scanDate).toLocaleDateString()}</td>
              <td>
                <button style={{ marginRight: 8 }}>Countersign & Activate</button>
                <button>Flag for Manual Review</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {expiringThisWeek > 0 && <div style={{ margin: '12px 0', padding: 12, borderRadius: 8, background: '#fff3cd' }}>⚠️ {expiringThisWeek} certification(s) expire in the next 7 days.</div>}

      <p>Filters: {['active', 'conditional', 'suspended', 'expired'].map((value) => <a key={value} href={`?status=${value}`} style={{ marginRight: 12 }}>{value}</a>)}</p>

      <table>
        <thead>
          <tr><th>Tenant</th><th>Domain</th><th>Status</th><th>Issued</th><th>Expires</th><th>Lighthouse</th></tr>
        </thead>
        <tbody>
          {filtered.map((cert) => (
            <tr key={cert.id}>
              <td>{cert.tenantName}</td><td>{cert.domain}</td><td>{cert.status}</td><td>{new Date(cert.issuedAt).toLocaleDateString()}</td><td>{new Date(cert.expiresAt).toLocaleDateString()}</td><td>{cert.lighthouseScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
