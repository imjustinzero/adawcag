import { getWebhookHealth } from '@/lib/server/webhooks';

export default function Page() {
  const health = getWebhookHealth('unknown-org');

  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <h1>Settings</h1>
      <div className="card">
        <h2>Webhook Health</h2>
        <p>
          {health.isFailing
            ? `⚠️ Webhook failing — last successful delivery ${health.lastSuccessDaysAgo} days ago`
            : '✅ Webhooks healthy'}
        </p>
      </div>
    </main>
  );
}
