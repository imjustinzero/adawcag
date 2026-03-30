import { sendEmail } from '@/lib/email/send';

type OnboardingPayload = { tenantId: string; email: string; firstName?: string; planName?: string };

function renderWelcomeEmail(firstName?: string): string {
  return `<p>Hi ${firstName || 'there'},</p><p>Welcome. You're now protected by the only accessibility compliance platform that combines automated scanning with a certified blind tester.</p><p><strong>Here's what to do right now (takes 3 minutes):</strong></p><ol><li>Add your website → Go to Dashboard</li><li>Run your first scan → click "Run New Scan"</li><li>Download your PDF report → share it with your team or attorney</li></ol><p>Questions? Reply to this email — a human reads every response.</p><p>— Justin & the ADAWCAG Team</p>`;
}

function renderEducationEmail(firstName?: string): string {
  return `<p>Hi ${firstName || 'there'},</p><p>By now you've seen your compliance report. The most common violation we find across every industry is missing image alt text.</p><p>Here's the fix: Add alt="" to decorative images and alt="[description]" to functional ones.</p><p>Example: &lt;img src="product.jpg" alt="Red running shoe, size 10"&gt;</p><p>→ View your violations now</p><p>— Aaron Espinoza, Lead Auditor · DHS Trusted Tester</p>`;
}

function renderWeekOneEmail(firstName?: string): string {
  return `<p>Hi ${firstName || 'there'},</p><p>It's been one week since your first ADAWCAG scan. Your week-1 compliance snapshot is ready.</p><p>If you haven't set up recurring monitoring yet, now is the time to enable weekly monitoring.</p><p>→ Set up weekly monitoring — takes 30 seconds</p><p>— The ADAWCAG Team</p>`;
}

export async function scheduleOnboardingSequence({ tenantId, email, firstName, planName }: OnboardingPayload): Promise<void> {
  const shared = { to: email };
  const jobs = [
    { delayMs: 0, subject: `Welcome to ADAWCAG — here's how to read your first report`, html: renderWelcomeEmail(firstName) },
    { delayMs: 48 * 60 * 60 * 1000, subject: 'What your #1 violation actually means (and how to fix it)', html: renderEducationEmail(firstName) },
    { delayMs: 7 * 24 * 60 * 60 * 1000, subject: 'Your week-1 compliance snapshot is ready', html: renderWeekOneEmail(firstName) },
  ];

  for (const job of jobs) {
    setTimeout(() => {
      void sendEmail({ ...shared, subject: job.subject, html: `${job.html}<p style="color:#64748b">Tenant: ${tenantId} · Plan: ${planName || 'n/a'}</p>` });
    }, job.delayMs);
  }
}
