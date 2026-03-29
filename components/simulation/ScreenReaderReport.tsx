import type { ScreenReaderReport as Report } from '@/lib/simulation/screen-reader-engine';

export function ScreenReaderReport({ report }: { report: Report }) {
  return (
    <section className="card">
      <h2>What a blind user experiences on {new URL(report.siteUrl).host}</h2>
      <p>Overall completion rate: {report.overallCompletionRate}%</p>
      {report.journeys.map((journey) => (
        <article key={journey.name} className="card" style={{ marginBottom: '1rem' }}>
          <h3>{journey.name}</h3>
          <p><em>{journey.narrative}</em></p>
          <ul>
            {journey.steps.map((step) => (
              <li key={`${journey.name}-${step.stepNumber}`}>{step.result === 'success' ? '✅' : '❌'} Step {step.stepNumber}: Heard “{step.announcedText}”</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
