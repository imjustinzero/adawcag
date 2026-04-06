import type { Metadata } from 'next';
import { marketplaceDevelopers, MarketplaceStatus } from '@/lib/admin/data-store';

export const metadata: Metadata = {
  title: 'ADAWCAG.org – ADA & WCAG 2.1 Compliance Platform',
  description: 'ADAWCAG.org provides ADA and WCAG 2.1 compliance scanning, remediation guidance, and reporting.',
};


type SearchParams = { status?: MarketplaceStatus };

export default function AdminMarketplacePage({ searchParams }: { searchParams?: SearchParams }): JSX.Element {
  const status = searchParams?.status;
  const pending = marketplaceDevelopers.filter((dev) => dev.status === 'pending').length;
  const filtered = status ? marketplaceDevelopers.filter((dev) => dev.status === status) : marketplaceDevelopers;

  return (
    <section>
      <h1>Marketplace Applications</h1>
      {pending > 0 && <div style={{ marginBottom: 12, padding: 12, background: '#fff3cd', borderRadius: 8 }}>{pending} applications pending review.</div>}

      <form method="post" action="/api/admin/marketplace" style={{ marginBottom: 12 }}>
        <input type="hidden" name="action" value="bulk-approve" />
        {filtered.filter((dev) => dev.status === 'pending').map((dev) => <input key={dev.id} type="hidden" name="developerIds" value={dev.id} />)}
        <button type="submit" disabled={pending === 0}>Bulk approve pending</button>
      </form>

      <p>Filters: {['pending', 'active', 'rejected'].map((value) => <a key={value} href={`?status=${value}`} style={{ marginRight: 12 }}>{value}</a>)}</p>

      <table>
        <thead>
          <tr>
            <th>Applicant</th><th>Company</th><th>Email</th><th>Submitted</th><th>Status</th><th>API Key</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((dev) => (
            <tr key={dev.id}>
              <td>{dev.name}</td>
              <td>{dev.company}</td>
              <td>{dev.email}</td>
              <td>{new Date(dev.submittedDate).toLocaleDateString()}</td>
              <td>{dev.status}</td>
              <td>{dev.apiKey ? '✅ Issued' : '—'}</td>
              <td>
                <form method="post" action="/api/admin/marketplace" style={{ display: 'inline-block', marginRight: 8 }}>
                  <input type="hidden" name="developerId" value={dev.id} />
                  <input type="hidden" name="action" value="approve" />
                  <button type="submit" disabled={dev.status === 'active'}>Approve</button>
                </form>
                <form method="post" action="/api/admin/marketplace" style={{ display: 'inline-block' }}>
                  <input type="hidden" name="developerId" value={dev.id} />
                  <input type="hidden" name="action" value="reject" />
                  <button type="submit" disabled={dev.status === 'rejected'}>Reject</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
