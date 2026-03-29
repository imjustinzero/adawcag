import { adaCases } from '@/lib/admin/data-store';

export default function AdminAdaCasesPage(): JSX.Element {
  return (
    <section>
      <h1>ADA Cases</h1>

      <details open>
        <summary>Add Case</summary>
        <form method="post" action="/api/admin/ada-cases" style={{ display: 'grid', gap: 8, maxWidth: 720, marginTop: 12 }}>
          <input name="caseNumber" placeholder="Case number" required />
          <input name="caseName" placeholder="Case name" required />
          <input name="court" placeholder="Court" required />
          <input name="plaintiff" placeholder="Plaintiff" required />
          <input name="defendant" placeholder="Defendant" required />
          <input name="industryType" placeholder="Industry" required />
          <input name="outcome" placeholder="Outcome" required />
          <input name="settlement" placeholder="Settlement" required />
          <textarea name="summary" placeholder="Summary" required />
          <textarea name="legalSignificance" placeholder="Legal significance" required />
          <input name="violations" placeholder="violations comma separated" required />
          <input name="wcagCriteria" placeholder="wcag criteria comma separated" required />
          <input name="filedDate" type="date" required />
          <button type="submit">Add Case</button>
        </form>
      </details>

      <table>
        <thead>
          <tr>
            <th>Case #</th><th>Name</th><th>Court</th><th>Industry</th><th>Outcome</th><th>Settlement</th><th>Filed</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {adaCases.filter((item) => item.isActive).map((item) => (
            <tr key={item.id}>
              <td>{item.caseNumber}</td>
              <td>{item.caseName}</td>
              <td>{item.court}</td>
              <td>{item.industryType}</td>
              <td>{item.outcome}</td>
              <td>{item.settlement}</td>
              <td>{new Date(item.filedDate).toLocaleDateString()}</td>
              <td>
                <form method="post" action="/api/admin/ada-cases" style={{ display: 'inline-block' }}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="_method" value="delete" />
                  <button type="submit">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
