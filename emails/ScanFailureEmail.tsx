export function ScanFailureEmail({ firstName, siteUrl }: { firstName?: string; siteUrl: string }): string {
  const safeName = firstName?.trim() || 'there';
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a">
      <p>Hi ${safeName},</p>
      <p>Your scan for <strong>${siteUrl}</strong> ran into a technical issue and couldn't complete.</p>
      <p>Our team has been automatically notified and will investigate within 1 business hour.</p>
      <p>You don't need to do anything — we'll re-run your scan and email you the results as soon as it's fixed.</p>
      <p>If you need immediate assistance: <a href="mailto:contact@adawcag.org">contact@adawcag.org</a></p>
      <p>— The ADAWCAG Team</p>
    </div>
  `;
}
