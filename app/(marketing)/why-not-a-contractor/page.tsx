import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why Purpose-Built Beats a General IT Contractor | ADAWCAG',
  description: 'Compare ADAWCAG.org against generic contractors and see why specialized accessibility workflows deliver faster, lower-risk compliance.',
};

const rows = [
  ['Accessibility Focus', 'One of many services', '100% dedicated platform'],
  ['Human Blind Tester', 'Planned / future goal', 'Active — DHS Certified'],
  ['Scan Technology', 'Single tool (axe-core only)', 'axe-core + pa11y + Lighthouse'],
  ['Time to First Report', 'Weeks via RFP process', 'Minutes'],
  ['Certification Badge', 'Not offered', 'Auto-issued at 85+ score'],
  ['Remediation Support', 'Extra SOW required', 'Built into dashboard'],
  ['Legal Shield', 'Not included', '50 ADA case database'],
  ['ADA Deadline Awareness', 'General IT timeline', 'April 24, 2025 Title II countdown'],
  ['Pricing', '$50K–$200K+ contracts', 'SaaS — starts at $X/mo'],
];

export default function WhyNotContractorPage(): JSX.Element {
  return (
    <main className="container" style={{ padding: '2rem 0', display: 'grid', gap: '1.2rem' }}>
      <section className="card">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', marginTop: 0 }}>Why Purpose-Built Beats a General IT Contractor for ADA/WCAG Compliance</h1>
      </section>
      <section className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '.6rem' }}>Category</th>
              <th style={{ textAlign: 'left', padding: '.6rem' }}>General IT Contractors</th>
              <th style={{ textAlign: 'left', padding: '.6rem' }}>ADAWCAG.org</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([cat, left, right]) => (
              <tr key={cat} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '.6rem' }}>{cat}</td><td style={{ padding: '.6rem' }}>{left}</td><td style={{ padding: '.6rem' }}>{right}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
        <article className="card"><h3>Average ADA lawsuit cost</h3><p style={{ fontSize: '1.8rem', margin: 0 }}>$25,000+</p></article>
        <article className="card"><h3>DOJ settlement risk</h3><p>Government entities face escalating enforcement exposure when remediation timelines are undocumented.</p></article>
        <article className="card"><h3>Reputational damage</h3><p>Public-facing organizations lose trust when disabled users cannot complete critical tasks independently.</p></article>
      </section>
      <section className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0 }}>Get Compliant in Days, Not Months</h2>
        <a href="/pricing" className="btn btn-primary">See pricing & checkout</a>
      </section>
    </main>
  );
}
