import type { Metadata } from 'next';
import { rfps } from '@/lib/admin/data-store';

export const metadata: Metadata = {
  title: 'ADAWCAG.org – ADA & WCAG 2.1 Compliance Platform',
  description: 'ADAWCAG.org provides ADA and WCAG 2.1 compliance scanning, remediation guidance, and reporting.',
};


export default function AdminRfpsPage(): JSX.Element {
  const total = rfps.length;
  const statusCounts = rfps.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = (acc[item.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section>
      <h1>RFP Opportunities</h1>
      <p>Total: {total}</p>
      <p>
        {Object.entries(statusCounts).map(([status, count]) => (
          <span key={status} style={{ marginRight: 12 }}>{status}: {count}</span>
        ))}
      </p>

      <details>
        <summary>Add Global RFP</summary>
        <form method="post" action="/api/admin/rfps" style={{ display: 'grid', gap: 8, maxWidth: 520, marginTop: 12 }}>
          <input name="title" placeholder="Title" required />
          <input name="agency" placeholder="Agency" required />
          <input name="matchScore" type="number" min={0} max={100} placeholder="Match score" required />
          <input name="dueDate" type="date" required />
          <input name="value" placeholder="$100,000 - $200,000" required />
          <button type="submit">Add Global RFP</button>
        </form>
      </details>

      <table>
        <thead>
          <tr>
            <th>Title</th><th>Agency</th><th>Status</th><th>Match</th><th>Due</th><th>Value</th><th>Tenant</th>
          </tr>
        </thead>
        <tbody>
          {rfps.map((rfp) => (
            <tr key={rfp.id}>
              <td>{rfp.title}</td>
              <td>{rfp.agency}</td>
              <td>{rfp.status}</td>
              <td>{rfp.matchScore}</td>
              <td>{new Date(rfp.dueDate).toLocaleDateString()}</td>
              <td>{rfp.value}</td>
              <td>{rfp.tenantName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
