import { marketplaceDevelopers, MarketplaceStatus } from '@/lib/admin/data-store';

type SearchParams = { status?: MarketplaceStatus };

export default function AdminMarketplacePage({ searchParams }: { searchParams?: SearchParams }): JSX.Element {
  const status = searchParams?.status;
  const pending = marketplaceDevelopers.filter((dev) => dev.status === 'pending').length;
  const filtered = status ? marketplaceDevelopers.filter((dev) => dev.status === status) : marketplaceDevelopers;

  return (
    <section>
      <h1>Marketplace Developers</h1>
      {pending > 0 && (
        <div style={{ marginBottom: 12, padding: 12, background: '#fff3cd', borderRadius: 8 }}>
          {pending} developers pending review.
        </div>
      )}
      <p>
        Filters:{' '}
        {['pending', 'active', 'rejected'].map((value) => (
          <a key={value} href={`?status=${value}`} style={{ marginRight: 12 }}>{value}</a>
        ))}
      </p>

      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Skills</th><th>Rate</th><th>Status</th><th>Verified</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((dev) => (
            <tr key={dev.id}>
              <td>{dev.name}</td>
              <td>{dev.email}</td>
              <td>{dev.skills.join(', ')}</td>
              <td>${dev.hourlyRate}/hr</td>
              <td>{dev.status}</td>
              <td>{dev.verified ? '✅' : '—'}</td>
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
