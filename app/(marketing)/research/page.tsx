export default function ResearchLandingPage() {
  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <h1>ADAWCAG.org Research Program</h1>
      <p>The world’s only dataset of verified accessibility remediation outcomes.</p>
      <section className="card">
        <h2>Available datasets</h2>
        <ul>
          <li>Remediation Outcomes (2026-) — JSONL, CSV</li>
          <li>Disability Impact Estimates (2026-) — CSV</li>
          <li>Accessibility Benchmark Time Series (2026-) — CSV, Parquet</li>
          <li>Screen Reader Simulation Corpus (2026-) — JSONL</li>
        </ul>
      </section>
      <a className="btn btn-primary" href="/research/apply">Apply for Research Access →</a>
    </main>
  );
}
