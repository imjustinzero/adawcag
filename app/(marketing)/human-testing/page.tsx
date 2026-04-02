import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Human Accessibility Testing by Certified Blind Tester | ADAWCAG',
  description: 'Go beyond automation with human accessibility validation by Aaron Espinoza, a DHS Trusted Tester certified blind auditor.',
};

const misses = [
  ['Screen reader navigation flow', '⚠️', '✅'],
  ['Cognitive load issues', '❌', '✅'],
  ['Focus order logic', '⚠️', '✅'],
  ['Meaningful alt text quality', '⚠️', '✅'],
  ['Form error announcement', '⚠️', '✅'],
  ['Gesture-based interaction', '❌', '✅'],
];

export default function HumanTestingPage(): JSX.Element {
  return (
    <main className="container" style={{ padding: '2rem 0', display: 'grid', gap: '1.5rem' }}>
      <section className="card" style={{ display: 'grid', gap: '.75rem' }}>
        <p className="kpi" style={{ color: 'var(--accent-primary)' }}>Human-Verified Accessibility Audits</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', margin: 0 }}>Beyond Automated Scans — Real Testing by a Real Blind User</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Automation finds code-level patterns. Aaron validates how your website actually works in a real screen reader journey from homepage through checkout, forms, and support paths.</p>
      </section>

      <section className="card" style={{ display: 'grid', gap: '.6rem', maxWidth: 620 }}>
        <h2 style={{ margin: 0 }}>Aaron Espinoza</h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Lead Auditor · Blind Tester · QA Specialist for assistive technology workflows</p>
        <p style={{ display: 'inline-flex', alignItems: 'center', gap: '.45rem', width: 'fit-content', background: '#082236', padding: '.45rem .7rem', borderRadius: 999 }}>
          <span aria-hidden>🛡️</span>
          <strong>DHS Trusted Tester Certified</strong>
        </p>
      </section>

      <section className="card" style={{ overflowX: 'auto' }}>
        <h2>What Automated Scans Miss</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '.6rem' }}>Issue Type</th>
              <th style={{ textAlign: 'left', padding: '.6rem' }}>Caught by Automation</th>
              <th style={{ textAlign: 'left', padding: '.6rem' }}>Caught by Human Testing</th>
            </tr>
          </thead>
          <tbody>
            {misses.map(([issue, automation, human]) => (
              <tr key={issue} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '.6rem' }}>{issue}</td>
                <td style={{ padding: '.6rem' }}>{automation}</td>
                <td style={{ padding: '.6rem' }}>{human}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ marginBottom: '.35rem' }}>Get a Human-Verified Audit</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Pair machine scanning with a certified blind tester review and receive actionable remediation guidance.</p>
        </div>
        <a className="btn btn-primary" href="/pricing">Start your human audit</a>
      </section>
    </main>
  );
}
