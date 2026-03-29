export default function PricingPage() {
  const tiers = [
    ['Starter','$49/mo','1 website, monthly scans'],
    ['Agency','$299/mo','10 websites, VPAT export'],
    ['Enterprise','$999/mo','Unlimited, CI/CD, API, SLA'],
    ['Government','Custom','Title II compliance ready'],
  ];
  return <main className="container" style={{ padding: '3rem 0' }}>
    <h1>Simple, transparent pricing.</h1><p>Start free. Upgrade when you&apos;re ready.</p>
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>{tiers.map(t => <article key={t[0]} className="card"><h2>{t[0]}</h2><p className="kpi">{t[1]}</p><p>{t[2]}</p><a className="btn btn-primary" href="/audit">Start Free Trial</a></article>)}</section>
  </main>;
}
