import type { Metadata } from 'next';
import { tenantOverrides } from '@/lib/admin/data-store';

export const metadata: Metadata = {
  title: 'ADAWCAG.org – ADA & WCAG 2.1 Compliance Platform',
  description: 'ADAWCAG.org provides ADA and WCAG 2.1 compliance scanning, remediation guidance, and reporting.',
};


export default function AdminTenantsPage(): JSX.Element {
  return (
    <section>
      <h1>Tenant Overrides</h1>
      <form method="post" action="/api/admin/tenant-overrides" style={{ display: 'grid', gap: 8, maxWidth: 560, marginBottom: 16 }}>
        <input name="tenantId" placeholder="tenant id" required />
        <input name="tenantName" placeholder="tenant name" required />
        <input name="pageLimit" type="number" placeholder="page limit" />
        <input name="sitesAllowed" type="number" placeholder="sites allowed" />
        <select name="scanFrequency" defaultValue=""><option value="">Select frequency</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select>
        <input name="expiresAt" type="date" />
        <input name="reason" placeholder="override reason" required />
        <button type="submit">Save Override</button>
      </form>

      <table>
        <thead><tr><th>Tenant</th><th>Page Limit</th><th>Sites</th><th>Frequency</th><th>Expires</th><th>Reason</th></tr></thead>
        <tbody>
          {tenantOverrides.map((item) => (
            <tr key={item.id}>
              <td>{item.tenantName}</td><td>{item.pageLimit ?? '—'}</td><td>{item.sitesAllowed ?? '—'}</td><td>{item.scanFrequency ?? '—'}</td><td>{item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : 'Never'}</td><td>{item.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
