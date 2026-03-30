export async function sendSlackAlert({ channel, message }: { channel?: string; message: string }): Promise<void> {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return;

  try {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: channel ?? process.env.SLACK_OPS_CHANNEL, text: message }),
    });
  } catch {
    // Non-blocking by design for operational alerts.
  }
}
