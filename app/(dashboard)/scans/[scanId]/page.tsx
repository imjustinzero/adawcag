import { DisabilityImpactScore } from '@/components/impact/DisabilityImpactScore';
import { ConformanceTrajectory } from '@/components/trajectory/ConformanceTrajectory';
import { calculateDisabilityImpactScore } from '@/lib/impact/disability-impact-score';
import { calculateConformanceTrajectory } from '@/lib/trajectory/conformance-path';

const sampleViolations = [
  { rule_id: 'color-contrast', page_url: 'https://example.com' },
  { rule_id: 'label', page_url: 'https://example.com/checkout' },
  { rule_id: 'image-alt', page_url: 'https://example.com/products' },
];

export default async function ScanPage({ params }: { params: Promise<{ scanId: string }>}) {
  const { scanId } = await params;
  const impact = await calculateDisabilityImpactScore({ violations: sampleViolations, siteUrl: 'https://example.com', industry: 'ecommerce' });
  const trajectory = await calculateConformanceTrajectory({ currentScore: 41, violations: sampleViolations, deadline: new Date('2026-04-24'), industry: 'ecommerce', orgId: 'demo-org' });

  return (
    <main className="container" style={{padding:'2rem 0'}}>
      <h1>Scan #{scanId}</h1>
      <section className="card"><h2>WCAG 2.1 AA Score: 41</h2><p>Critical 3 · Serious 8 · Moderate 12 · Minor 7</p></section>
      <DisabilityImpactScore data={impact} />
      <ConformanceTrajectory paths={[trajectory.pathA, trajectory.pathB, trajectory.pathC, trajectory.pathD]} />
      <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem' }}>
        <a className="btn btn-primary" href={`/api/scans/${scanId}/simulate`}>Run screen reader simulation</a>
        <a className="btn btn-ghost" href={`/scans/${scanId}/experience`}>View narrative report</a>
      </div>
    </main>
  );
}
