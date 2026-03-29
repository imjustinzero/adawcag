type Props = {
  headline: string;
  stat: string;
  riskStats: string[];
  cta: string;
};

export function VerticalLandingLayout({ headline, stat, riskStats, cta }: Props) {
  return (
    <main className="container" style={{ padding: '3rem 0' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem' }}>{headline}</h1>
      <p>{stat}</p>
      <section className="card" style={{ display: 'grid', gap: '.7rem', margin: '1rem 0' }}>
        {riskStats.map((s) => <div key={s} className="kpi">{s}</div>)}
      </section>
      <section className="card"><h2>What happens if you get sued</h2><p>Legal exposure, rushed remediation, and reputational risk all increase when accessibility defects remain unresolved.</p></section>
      <section className="card"><h2>How ADAWCAG.org helps</h2><p>Automated scans, legal-grade evidence reports, and prioritized remediation workflows.</p></section>
      <section className="card"><h2>Case study scenario</h2><p>A realistic scenario shows how a team moved from high-risk to an audit-defensible position in 6 weeks.</p></section>
      <section className="card"><h2>Recommended plan</h2><p>Most organizations in this vertical start on Agency and move to Enterprise for CI/CD and legal workflows.</p></section>
      <a className="btn btn-primary" href="/audit">{cta}</a>
    </main>
  );
}
