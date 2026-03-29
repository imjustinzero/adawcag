export default function MarketingHome() {
  return (
    <main>
      <section className="container" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: '1.5rem', alignItems: 'center' }}>
        <div>
          <p className="kpi">🔴 LIVE — April 24, 2026 Federal Deadline</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', lineHeight: 1.05 }}>Your Website Is a Lawsuit Waiting to Happen.</h1>
          <p style={{ color: 'var(--text-secondary)' }}>ADAWCAG.org scans for WCAG 2.1 AA violations and generates legal-grade evidence reports before deadline enforcement.</p>
          <div style={{ display: 'flex', gap: '.8rem' }}><a className="btn btn-primary" href="/audit">Run Free Audit →</a><a className="btn btn-ghost" href="#how">See How It Works</a></div>
        </div>
        <div className="card"><pre>{`scanning homepage... ✓
scanning /about... ✓
scanning /contact... ✓
found 23 violations
critical: 3 serious: 8 moderate: 12
WCAG score: 41/100 ⚠️`}</pre></div>
      </section>
      <section style={{ background: 'var(--accent-danger)', color: 'white', padding: '1rem' }}><div className="container">The DOJ's April 24, 2026 Title II deadline applies to state and local governments. <a href="/audit" style={{ color: 'white' }}>Check Your Risk Free →</a></div></section>
      <section id="how" className="container" style={{ padding: '2rem 0', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
        {['Scan','Prioritize','Prove'].map((s, i) => <article key={s} className="card"><h3>{i+1}. {s}</h3><p>Focused workflow for compliance teams and counsel.</p></article>)}
      </section>

      <section className="container" style={{ paddingBottom: '2rem', display: 'flex', gap: '.75rem' }}>
        <a className="btn btn-ghost" href="/benchmark">View Benchmark</a>
        <a className="btn btn-ghost" href="/research">Research Program</a>
      </section>
    </main>
  );
}
