const METRICS: Record<string, string> = {
  'metric:scans:total': 'Total scans ever run',
  'metric:scans:today': 'Scans today',
  'metric:pdf:generated': 'PDFs generated today',
  'metric:leads:scraped': 'Leads scraped today',
  'metric:leads:emailed': 'Audit emails sent today',
  'metric:copilot:messages': 'AI Co-Pilot messages today',
  'metric:scan:duration:p50': 'Median scan duration (ms)',
  'metric:scan:duration:p95': 'P95 scan duration (ms)',
  'metric:scan:duration:p99': 'P99 scan duration (ms)',
  'metric:api:latency:p50': 'Median API latency (ms)',
  'metric:scan:failures': 'Failed scans today',
  'metric:pdf:failures': 'Failed PDFs today',
  'metric:webhook:failures': 'Failed webhooks today',
  'metric:ratelimit:hits': 'Rate limit violations today',
  'metric:mrr': 'Current MRR in cents',
  'metric:new_customers:today': 'New paying customers today',
  'metric:churn:this_month': 'Churned customers this month',
};

export default function InternalMetricsPage(): JSX.Element {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Platform Metrics</h1>
      <p>Live metrics refresh every 30 seconds in production wiring.</p>
      <ul>
        {Object.entries(METRICS).map(([key, description]) => (
          <li key={key}>
            <strong>{key}</strong>: {description}
          </li>
        ))}
      </ul>
    </main>
  );
}
