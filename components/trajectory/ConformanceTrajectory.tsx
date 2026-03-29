import type { ConformancePath } from '@/lib/trajectory/conformance-path';

export function ConformanceTrajectory({ paths }: { paths: ConformancePath[] }) {
  return (
    <section className="card">
      <h2>Conformance Trajectory</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '1rem' }}>
        {paths.map((path) => (
          <article key={path.name} className="card" style={{ border: path.name.includes('Do Nothing') ? '1px solid #ef4444' : '1px solid var(--border)' }}>
            <h3>{path.name} {path.recommendedPath ? '✅' : ''}</h3>
            <p>{path.description}</p>
            <p>Score at deadline: {path.projectedScoreAtDeadline}/100</p>
            <p>Status: {path.complianceStatus}</p>
            <p>DIY cost: ${path.estimatedCostDiy.toLocaleString()}</p>
            <p>Lawsuit probability (30d): {path.lawsuitProbability30Days}%</p>
          </article>
        ))}
      </div>
    </section>
  );
}
