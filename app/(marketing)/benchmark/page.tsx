import { getBenchmarkSummary, getBenchmarkSites } from '@/lib/benchmark/site-list-builder';

export default async function BenchmarkPage() {
  const summary = await getBenchmarkSummary();
  const sites = await getBenchmarkSites();
  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <h1>Accessibility Benchmark</h1>
      <p>Last updated: {new Date(summary.lastUpdated).toUTCString()} | {summary.tracked.toLocaleString()} sites tracked | Updated daily</p>
      <section className="card">
        <h2>National Summary</h2>
        <p>Average WCAG Score: {summary.averageScore}/100</p>
        <p>Sites at Critical Risk: {summary.criticalRisk}</p>
      </section>
      <section className="card">
        <h2>Leaderboard</h2>
        <table style={{ width: '100%' }}>
          <thead><tr><th>Organization</th><th>Score</th><th>Change (30d)</th><th>State</th></tr></thead>
          <tbody>{sites.map((site) => <tr key={site.url}><td>{site.organization_name}</td><td>{site.wcag_score}</td><td>{site.score_delta_30d}</td><td>{site.state}</td></tr>)}</tbody>
        </table>
      </section>
    </main>
  );
}
